import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bosa-api-5cea7419d839.herokuapp.com';

export const fetchTokenStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/token-stats`, {
      timeout: 5000,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error('Failed to fetch token stats');
  } catch (error) {
    console.error('Error fetching token stats:', error);
    return {
      price: 0,
      totalSupply: 0,
      founderBalance: 0,
      holders: 0,
      lastUpdated: new Date().toISOString(),
      cached: true,
      error: true
    };
  }
};

// Improved retry logic with exponential backoff
export const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 5000 * (i + 1), // Increase timeout with each retry
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};