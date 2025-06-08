import type { Game, StreamLink } from '@/pages/Index';

const BACKEND_URL = 'https://backend-eiw2.onrender.com/'; // Replace with your deployed backend URL
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

type CacheEntry<T> = {
  timestamp: number;
  data: T;
};

export class StreamService {
  private static gamesCache: CacheEntry<Game[]> | null = null;
  private static gameDetailsCache: Map<string, CacheEntry<Game>> = new Map();

  private static async fetchWithRetry<T>(url: string, retries = 3, delay = 500): Promise<T> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return data as T;
      } catch (err) {
        console.warn(`Fetch attempt ${attempt + 1} failed for ${url}`, err);
        if (attempt < retries - 1) await new Promise(r => setTimeout(r, delay));
        else throw err;
      }
    }
    throw new Error('Failed to fetch after retries');
  }

  // Filters streams to only working ones and sorts by quality (HD > SD > others)
  private static filterAndSortStreams(streams: StreamLink[]): StreamLink[] {
    const qualityRank = { 'FHD': 3, 'HD': 2, 'SD': 1 };
    return streams
      .filter(s => s.isWorking)
      .sort((a, b) => (qualityRank[b.quality] || 0) - (qualityRank[a.quality] || 0));
  }

  static async getTodaysGames(forceRefresh = false): Promise<Game[]> {
    const now = Date.now();
    if (
      !forceRefresh &&
      this.gamesCache &&
      now - this.gamesCache.timestamp < CACHE_DURATION
    ) {
      return this.gamesCache.data;
    }

    try {
      const games = await this.fetchWithRetry<Game[]>(`${BACKEND_URL}/api/live-games`);
      // Process streams: filter and sort
      const processedGames = games.map(game => ({
        ...game,
        streams: this.filterAndSortStreams(game.streams),
      }));
      this.gamesCache = { timestamp: now, data: processedGames };
      return processedGames;
    } catch (error) {
      console.error("Error fetching today's games:", error);
      return this.gamesCache?.data || [];
    }
  }

  static async getGameById(gameId: string, forceRefresh = false): Promise<Game | null> {
    const now = Date.now();
    const cached = this.gameDetailsCache.get(gameId);
    if (!forceRefresh && cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const game = await this.fetchWithRetry<Game>(`${BACKEND_URL}/api/game/${gameId}`);
      if (!game) return null;

      const processedGame = {
        ...game,
        streams: this.filterAndSortStreams(game.streams),
      };

      this.gameDetailsCache.set(gameId, { timestamp: now, data: processedGame });
      return processedGame;
    } catch (error) {
      console.error(`Error fetching game ${gameId}:`, error);
      return cached?.data || null;
    }
  }
}
