import { describe, it, expect, vi, beforeEach } from 'vitest';
import { canSendMessage, formatTimeRemaining, getTimeUntilMidnight } from '../../utils/rateLimit';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
}));

describe('rateLimit utils', () => {
  describe('formatTimeRemaining', () => {
    it('should format hours and minutes correctly', () => {
      const threeHoursThirtyMins = 3 * 60 * 60 * 1000 + 30 * 60 * 1000;
      expect(formatTimeRemaining(threeHoursThirtyMins)).toBe('3h 30m');
    });

    it('should format only minutes when less than an hour', () => {
      const fortyFiveMins = 45 * 60 * 1000;
      expect(formatTimeRemaining(fortyFiveMins)).toBe('45m');
    });

    it('should handle zero correctly', () => {
      expect(formatTimeRemaining(0)).toBe('0m');
    });

    it('should round down to nearest minute', () => {
      const oneHourFiftyNineSecondsNinetyFiveMins = 1 * 60 * 60 * 1000 + 15 * 60 * 1000 + 30 * 1000;
      expect(formatTimeRemaining(oneHourFiftyNineSecondsNinetyFiveMins)).toBe('1h 15m');
    });
  });

  describe('getTimeUntilMidnight', () => {
    it('should return a positive number', () => {
      const result = getTimeUntilMidnight();
      expect(result).toBeGreaterThan(0);
    });

    it('should return less than 24 hours in milliseconds', () => {
      const result = getTimeUntilMidnight();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      expect(result).toBeLessThanOrEqual(twentyFourHours);
    });
  });

  describe('canSendMessage', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should allow sending if no messages in last 24h', async () => {
      const { getDocs } = await import('firebase/firestore');
      getDocs.mockResolvedValue({ empty: true, docs: [] });

      const result = await canSendMessage('conv123', 'user123');
      
      expect(result.canSend).toBe(true);
      expect(result.nextAvailable).toBeNull();
    });
  });
});
