import type { Game } from '@/pages/Index';

const BACKEND = 'https://backend-eiw2.onrender.com'; // Change to your deployed backend

export class StreamService {
  static async getTodaysGames(): Promise<Game[]> {
    try {
      const res = await fetch(`${BACKEND}/api/live-games`);
      if (!res.ok) throw new Error('Failed to fetch live games');
      return (await res.json()) as Game[];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  static async getGameById(gameId: string): Promise<Game | null> {
    try {
      const games = await this.getTodaysGames();
      return games.find(g => g.id === gameId) || null;
    } catch {
      return null;
    }
  }
}
