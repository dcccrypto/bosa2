import axios, { AxiosError } from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';
import { priceRateLimiter, solanaRateLimiter } from './rateLimiter';

// API configuration
const apiKey = process.env.API_KEY;
const tokenAddress = '26wx2UwenfvTS8vTrpysPdtDLyCfu47uJ44CpEpD1AQG';
const founderWalletAddress = '7wtbTXc7Lyxt1enezJa7eNyNxenaLYsmBeiZTsA3KvwL';
const SOLANA_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

// Axios client with API key for Solana Tracker
const apiClient = axios.create({
  baseURL: 'https://data.solanatracker.io',
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
  },
});

// Update RPC endpoints with more reliable ones
const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  'https://solana-mainnet.rpc.extrnode.com',
  'https://rpc.ankr.com/solana',
  'https://api.mainnet-beta.solana.com'
].filter(Boolean); // Remove null/undefined endpoints

// Add connection options for better reliability
const connectionConfig = {
  commitment: 'confirmed' as const,
  confirmTransactionInitialTimeout: 60000,
  disableRetryOnRateLimit: false,
  fetch: fetch
};

async function getWorkingConnection() {
  for (const endpoint of RPC_ENDPOINTS) {
    if (!endpoint) continue;
    try {
      const connection = new Connection(endpoint, connectionConfig);
      // Test the connection with a lighter operation
      await connection.getSlot();
      console.log(`Connected to RPC endpoint: ${endpoint}`);
      return connection;
    } catch (error) {
      console.warn(`Failed to connect to ${endpoint}, trying next...`, error);
    }
  }
  throw new Error('All RPC endpoints failed');
}

// Update retry logic with exponential backoff and jitter
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 5,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i) * (0.5 + Math.random() * 0.5); // Add jitter
        console.log(`Retry ${i + 1}/${maxRetries} after ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Update token price fetching with better error handling
export async function getTokenPrice() {
  console.log('Fetching token price...');
  return retryWithBackoff(async () => {
    await priceRateLimiter.throttle();
    try {
      const response = await apiClient.get('/price', {
        params: { token: tokenAddress },
        timeout: 10000, // Add timeout
      });
      if (!response.data || typeof response.data.price === 'undefined') {
        throw new Error('Invalid price data received');
      }
      console.log('Token price fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('API key is invalid or missing');
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded');
        }
      }
      throw error;
    }
  });
}

export async function fetchTotalTokenSupply() {
  console.log('Fetching total token supply...');
  try {
    await solanaRateLimiter.throttle();
    const connection = await getWorkingConnection();
    const mintPublicKey = new PublicKey(tokenAddress);
    const supplyResponse = await connection.getTokenSupply(mintPublicKey);
    console.log('Total supply fetched successfully:', supplyResponse.value.uiAmount);
    return supplyResponse.value.uiAmount;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch total token supply: ${message}`);
  }
}

export async function fetchFounderBalance() {
  console.log('Fetching founder balance...');
  try {
    const connection = await getWorkingConnection();
    const walletPublicKey = new PublicKey(founderWalletAddress);
    const tokenAccounts = await connection.getTokenAccountsByOwner(walletPublicKey, {
      mint: new PublicKey(tokenAddress),
    });

    let totalBalance = 0;
    for (const account of tokenAccounts.value) {
      const accountInfo = await connection.getParsedAccountInfo(account.pubkey);
      if (accountInfo.value?.data && 'parsed' in accountInfo.value.data) {
        const tokenAmount = accountInfo.value.data.parsed.info.tokenAmount.uiAmount;
        totalBalance += tokenAmount;
        console.log(`Found token balance in account ${account.pubkey.toString()}: ${tokenAmount}`);
      }
    }
    
    console.log(`Total founder balance: ${totalBalance}`);
    return totalBalance;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching founder balance:', error.message);
    } else {
      console.error('Error fetching founder balance:', String(error));
    }
    return null;
  }
}

export async function fetchTokenHolders() {
  console.log('Fetching token holders...');
  try {
    const response = await apiClient.get('/holders', {
      params: { token: tokenAddress },
    });
    console.log('Token holders fetched successfully:', response.data.totalHolders);
    return response.data.totalHolders;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching token holders:', error.response?.data || error.message);
    } else {
      console.error('Error fetching token holders:', String(error));
    }
    return null;
  }
}

// Helper function to format numbers for display
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(num);
}

// Helper function to calculate percentage
export function calculatePercentage(part: number, total: number): number {
  if (!total) return 0;
  return (part / total) * 100;
}

// Function to log all token stats
export async function logAllTokenStats() {
  console.log('=== Fetching all token statistics ===');
  
  try {
    // Fetch token price data
    const priceData = await getTokenPrice();
    if (priceData) {
      console.log('Token Price Data:', priceData);
    } else {
      console.log('Failed to fetch token price data.');
    }

    // Fetch total token supply
    const totalSupply = await fetchTotalTokenSupply();
    if (totalSupply !== null) {
      console.log('Total Token Supply:', totalSupply);
    } else {
      console.log('Failed to fetch total token supply.');
    }

    // Fetch founder balance
    const founderBal = await fetchFounderBalance();
    if (founderBal !== null) {
      console.log(`Founder Balance for ${founderWalletAddress}:`, founderBal);

      // Calculate the percentage of total supply held by the founder
      if (totalSupply !== null && totalSupply > 0) {
        const percentageOwned = (founderBal / totalSupply) * 100;
        console.log(`Percentage of Total Supply Owned by Founder: ${percentageOwned.toFixed(2)}%`);
      } else {
        console.log('Total supply is zero or undefined. Cannot calculate percentage owned.');
      }
    } else {
      console.log('Failed to fetch founder balance.');
    }

    // Fetch holders count
    const holders = await fetchTokenHolders();

    return {
      price: priceData,
      supply: totalSupply,
      holders,
      founderBalance: founderBal,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in logAllTokenStats:', error.message);
    } else {
      console.error('Error in logAllTokenStats:', String(error));
    }
    return {
      price: null,
      supply: null,
      holders: null,
      founderBalance: null,
    };
  }
}