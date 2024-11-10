const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchTokenStats() {
  try {
    console.log('[Frontend] Fetching token stats from:', `${API_URL}/api/token-stats`);
    const response = await fetch(`${API_URL}/api/token-stats`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('[Frontend] HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[Frontend] Received data:', data);
    return data;
  } catch (error) {
    console.error('[Frontend] Error fetching token stats:', error);
    throw error;
  }
}