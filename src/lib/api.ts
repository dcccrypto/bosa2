const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchTokenStats() {
  try {
    const response = await fetch(`${API_URL}/api/token-stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch token stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching token stats:', error);
    throw error;
  }
}