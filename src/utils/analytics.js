/**
 * Analytics utilities for tracking user data in a non-intrusive way
 * Captures IP and approximate location on login/signup
 */

const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:8000';

/**
 * Track user login and get IP/location data
 * This is non-intrusive and only captures approximate location
 */
export const trackLogin = async () => {
  try {
    const response = await fetch(`${API_URL}/api/track-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to track login');
    }

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error tracking login:', error);
    // Fail silently - analytics should not block user experience
    return null;
  }
};

/**
 * Get approximate location without storing anything
 * Used for display purposes only
 */
export const getLocation = async () => {
  try {
    const response = await fetch(`${API_URL}/api/get-location`);
    
    if (!response.ok) {
      throw new Error('Failed to get location');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting location:', error);
    return { country: 'Unknown', region: 'Unknown' };
  }
};

/**
 * Format location data for display
 */
export const formatLocation = (country, region) => {
  if (country === 'Unknown') {
    return 'Unknown location';
  }
  
  if (region && region !== 'Unknown') {
    return `${region}, ${country}`;
  }
  
  return country;
};
