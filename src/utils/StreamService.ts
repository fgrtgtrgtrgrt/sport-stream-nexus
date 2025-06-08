import type { Game } from '@/pages/Index';

const BACKEND_URL = 'http://localhost:4000'; // Change to your deployed backend URL

export class StreamService {
  static async getTodaysGames(): Promise<Game[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/live-games`);
      if (!res.ok) throw new Error('Failed to fetch games');
      const games: Game[] = await res.json();
      return games;
    } catch (error) {
      console.error('Error fetching today\'s games:', error);
      return [];
    }
  }

  static async getGameById(gameId: string): Promise<Game | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/game/${gameId}`);
      if (!res.ok) return null;
      const game: Game = await res.json();
      return game;
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      return null;
    }
  }
}
