import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackLogin, getLocation, formatLocation } from '../../utils/analytics';

// Mock fetch
global.fetch = vi.fn();

describe('Analytics Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackLogin', () => {
    it('should successfully track login and return data', async () => {
      const mockData = {
        success: true,
        data: {
          ip: '123.45.67.89',
          country: 'United States',
          region: 'California',
          timestamp: '2026-01-21T10:00:00',
        },
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await trackLogin();

      expect(result).toEqual(mockData.data);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/track-login'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should return null on failure and not throw', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await trackLogin();

      expect(result).toBeNull();
    });

    it('should return null if response is not successful', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ success: false }),
      });

      const result = await trackLogin();

      expect(result).toBeNull();
    });
  });

  describe('getLocation', () => {
    it('should successfully get location', async () => {
      const mockLocation = {
        country: 'United States',
        region: 'California',
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLocation,
      });

      const result = await getLocation();

      expect(result).toEqual(mockLocation);
    });

    it('should return Unknown location on failure', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await getLocation();

      expect(result).toEqual({ country: 'Unknown', region: 'Unknown' });
    });
  });

  describe('formatLocation', () => {
    it('should format location with region and country', () => {
      const result = formatLocation('United States', 'California');
      expect(result).toBe('California, United States');
    });

    it('should format location with only country', () => {
      const result = formatLocation('Japan', 'Unknown');
      expect(result).toBe('Japan');
    });

    it('should handle unknown location', () => {
      const result = formatLocation('Unknown', 'Unknown');
      expect(result).toBe('Unknown location');
    });

    it('should handle country without region', () => {
      const result = formatLocation('Germany', null);
      expect(result).toBe('Germany');
    });
  });
});
