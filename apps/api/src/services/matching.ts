import prisma from '../utils/prisma';

export class MatchingService {
    /**
     * Calculates a match score (0-100) between a candidate and a challenge.
     * Logic: Percentage of required skills that the candidate has demonstrated via proofs.
     */
    static async calculateMatchScore(candidateId: string, challengeId: string): Promise<number> {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            select: { requiredSkills: true }
        });

        if (!challenge || !challenge.requiredSkills.length) {
            return 50; // Default score if no requirements are set
        }

        const proofs = await prisma.proof.findMany({
            where: { candidateId },
            select: { skillTags: true }
        });

        const candidateSkills = new Set(proofs.flatMap(p => p.skillTags.map(s => s.toLowerCase())));
        const requiredSkills = challenge.requiredSkills.map(s => s.toLowerCase());

        let matches = 0;
        for (const skill of requiredSkills) {
            if (candidateSkills.has(skill)) {
                matches++;
            }
        }

        const score = Math.round((matches / requiredSkills.length) * 100);
        return score;
    }

    /**
     * Gets top matches for a candidate.
     */
    static async getTopMatches(candidateId: string, limit: number = 5) {
        const challenges = await prisma.challenge.findMany({
            where: { status: 'ACTIVE' },
            take: 50 // Pull a candidate pool
        });

        const matches = await Promise.all(challenges.map(async (challenge) => {
            const score = await this.calculateMatchScore(candidateId, challenge.id);
            return {
                ...challenge,
                matchScore: score
            };
        }));

        return matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, limit);
    }
}
