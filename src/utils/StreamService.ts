import type { Game } from '@/pages/Index';

const BACKEND_URL = 'https://backend-eiw2.onrender.com'; // Change to deployed URL when hosting

export class StreamService {
  static async getTodaysGames(): Promise<Game[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/live-games`);
      if (!res.ok) throw new Error('Failed to fetch games');
      return await res.json();
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  static async getGameById(id: string): Promise<Game | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/game/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      return null;
    }
  }
}
