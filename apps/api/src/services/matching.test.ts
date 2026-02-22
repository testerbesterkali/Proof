import { describe, it, expect, vi, beforeEach } from 'vitest';

// Explicitly mock the module
vi.mock('../utils/prisma', () => {
    return {
        prisma: {
            challenge: {
                findUnique: vi.fn(),
            },
            proof: {
                findMany: vi.fn(),
            },
        }
    }
});

// Import after mocking
import { prisma } from '../utils/prisma';
import { MatchingService } from './matching';

describe('MatchingService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should calculate 100% match when all skills overlap', async () => {
        vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
            requiredSkills: ['React', 'TypeScript']
        } as any);
        vi.mocked(prisma.proof.findMany).mockResolvedValue([
            { skillTags: ['react', 'node'] },
            { skillTags: ['typescript'] }
        ] as any);

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(100);
    });

    it('should calculate 50% match when half skills overlap', async () => {
        vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
            requiredSkills: ['React', 'Go', 'Docker', 'K8s']
        } as any);
        vi.mocked(prisma.proof.findMany).mockResolvedValue([
            { skillTags: ['react', 'docker'] }
        ] as any);

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(50);
    });

    it('should return 0% match when no skills overlap', async () => {
        vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
            requiredSkills: ['Rust']
        } as any);
        vi.mocked(prisma.proof.findMany).mockResolvedValue([
            { skillTags: ['Java'] }
        ] as any);

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(0);
    });

    it('should return 50 as default if challenge has no required skills', async () => {
        vi.mocked(prisma.challenge.findUnique).mockResolvedValue({
            requiredSkills: []
        } as any);

        const score = await MatchingService.calculateMatchScore('candidate-1', 'challenge-1');
        expect(score).toBe(50);
    });
});
