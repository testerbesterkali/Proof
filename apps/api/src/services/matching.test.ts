import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatchingService } from './matching';
import { prisma } from '../utils/prisma';

vi.mock('../utils/prisma', () => ({
    prisma: {
        challenge: {
            findUnique: vi.fn()
        },
        proof: {
            findMany: vi.fn()
        }
    }
}));

describe('MatchingService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should calculate 100% match when all skills overlap', async () => {
        (prisma.challenge.findUnique as any).mockResolvedValue({
            requiredSkills: ['React', 'TypeScript']
        });
        (prisma.proof.findMany as any).mockResolvedValue([
            { skillTags: ['react', 'node'] },
            { skillTags: ['typescript'] }
        ]);

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(100);
    });

    it('should calculate 50% match when half skills overlap', async () => {
        (prisma.challenge.findUnique as any).mockResolvedValue({
            requiredSkills: ['React', 'Go', 'Docker', 'K8s']
        });
        (prisma.proof.findMany as any).mockResolvedValue([
            { skillTags: ['react', 'docker'] }
        ]);

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(50);
    });

    it('should return 0% match when no skills overlap', async () => {
        (prisma.challenge.findUnique as any).mockResolvedValue({
            requiredSkills: ['Rust']
        });
        (prisma.proof.findMany as any).mockResolvedValue([
            { skillTags: ['Java'] }
        ]);

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(0);
    });

    it('should return 50 as default if challenge has no required skills', async () => {
        (prisma.challenge.findUnique as any).mockResolvedValue({
            requiredSkills: []
        });

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(50);
    });
});
