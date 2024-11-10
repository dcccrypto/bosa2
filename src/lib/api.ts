import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bosa.wtf';

export const fetchTokenStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stats`, {
      timeout: 5000, // 5 second timeout
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
    // Return cached or fallback data if available
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

// Add retry logic for failed requests
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};