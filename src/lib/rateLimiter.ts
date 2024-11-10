class RateLimiter {
  private timestamps: number[] = [];
  private readonly limit: number;
  private readonly interval: number;

  constructor(limit: number, interval: number) {
    this.limit = limit;
    this.interval = interval;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(time => now - time < this.interval);
    
    if (this.timestamps.length >= this.limit) {
      const oldestCall = this.timestamps[0];
      const waitTime = this.interval - (now - oldestCall);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.timestamps.push(now);
  }
}

// Create instances for different API endpoints
export const priceRateLimiter = new RateLimiter(2, 1000); // 2 requests per second
export const solanaRateLimiter = new RateLimiter(10, 1000); // 10 requests per second 