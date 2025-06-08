
import type { Game, StreamLink } from '@/pages/Index';

// Mock data for demonstration - In production, this would integrate with actual streaming APIs
const mockGames: Game[] = [
  {
    id: '1',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    league: 'NBA',
    startTime: new Date().toISOString(),
    status: 'live',
    homeScore: 98,
    awayScore: 92,
    homeLogo: '/placeholder.svg',
    awayLogo: '/placeholder.svg',
    streams: [
      { id: '1a', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'HD', server: 'Stream1', isWorking: true },
      { id: '1b', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'HD', server: 'Stream2', isWorking: true },
      { id: '1c', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'SD', server: 'Stream3', isWorking: false },
    ]
  },
  {
    id: '2',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Buffalo Bills',
    league: 'NFL',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    status: 'upcoming',
    homeLogo: '/placeholder.svg',
    awayLogo: '/placeholder.svg',
    streams: [
      { id: '2a', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'HD', server: 'Stream1', isWorking: true },
      { id: '2b', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'HD', server: 'Stream2', isWorking: true },
    ]
  },
  {
    id: '3',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    league: 'Soccer',
    startTime: new Date().toISOString(),
    status: 'live',
    homeScore: 2,
    awayScore: 1,
    homeLogo: '/placeholder.svg',
    awayLogo: '/placeholder.svg',
    streams: [
      { id: '3a', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'HD', server: 'Stream1', isWorking: true },
      { id: '3b', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'FHD', server: 'Stream2', isWorking: true },
    ]
  },
  {
    id: '4',
    homeTeam: 'New York Yankees',
    awayTeam: 'Boston Red Sox',
    league: 'MLB',
    startTime: new Date(Date.now() - 7200000).toISOString(),
    status: 'finished',
    homeScore: 7,
    awayScore: 4,
    homeLogo: '/placeholder.svg',
    awayLogo: '/placeholder.svg',
    streams: []
  },
  {
    id: '5',
    homeTeam: 'Golden State Warriors',
    awayTeam: 'Miami Heat',
    league: 'NBA',
    startTime: new Date(Date.now() + 1800000).toISOString(),
    status: 'upcoming',
    homeLogo: '/placeholder.svg',
    awayLogo: '/placeholder.svg',
    streams: [
      { id: '5a', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'HD', server: 'Stream1', isWorking: true },
    ]
  },
  {
    id: '6',
    homeTeam: 'Pittsburgh Steelers',
    awayTeam: 'Cincinnati Bengals',
    league: 'NFL',
    startTime: new Date().toISOString(),
    status: 'live',
    homeScore: 14,
    awayScore: 10,
    homeLogo: '/placeholder.svg',
    awayLogo: '/placeholder.svg',
    streams: [
      { id: '6a', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'HD', server: 'Stream1', isWorking: true },
      { id: '6b', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: 'SD', server: 'Stream2', isWorking: false },
    ]
  }
];

export class StreamService {
  static async getTodaysGames(): Promise<Game[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Fetching today\'s games...');
    
    // In production, this would scrape or fetch from actual streaming APIs
    // For now, return mock data with some randomization
    const games = mockGames.map(game => ({
      ...game,
      streams: game.streams.map(stream => ({
        ...stream,
        isWorking: Math.random() > 0.3 // 70% chance a stream is working
      }))
    }));
    
    console.log(`Found ${games.length} games`);
    return games;
  }

  static async getGameById(gameId: string): Promise<Game | null> {
    console.log('Fetching game details for:', gameId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const game = mockGames.find(g => g.id === gameId);
    if (!game) return null;
    
    // Refresh stream status
    return {
      ...game,
      streams: game.streams.map(stream => ({
        ...stream,
        isWorking: Math.random() > 0.2 // 80% chance a stream is working when checked directly
      }))
    };
  }

  static async refreshGameStreams(gameId: string): Promise<Game> {
    console.log('Refreshing streams for game:', gameId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const game = mockGames.find(g => g.id === gameId);
    if (!game) throw new Error('Game not found');
    
    // Simulate finding new working streams
    const refreshedStreams = game.streams.map(stream => ({
      ...stream,
      isWorking: Math.random() > 0.15 // 85% chance after refresh
    }));
    
    // Sometimes add a new emergency stream
    if (Math.random() > 0.7) {
      refreshedStreams.push({
        id: `${gameId}_emergency_${Date.now()}`,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        quality: 'HD',
        server: 'Emergency',
        isWorking: true
      });
    }
    
    return {
      ...game,
      streams: refreshedStreams
    };
  }

  static async searchGames(query: string): Promise<Game[]> {
    const allGames = await this.getTodaysGames();
    
    return allGames.filter(game => 
      game.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
      game.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
      game.league.toLowerCase().includes(query.toLowerCase())
    );
  }

  // In production, these methods would integrate with actual streaming sources:
  
  static async scrapeWeakStreams(): Promise<StreamLink[]> {
    // Would scrape weakstreams.com for active links
    console.log('Scraping WeakStreams...');
    return [];
  }

  static async scrapeSportsurge(): Promise<StreamLink[]> {
    // Would scrape sportsurge.net for active links  
    console.log('Scraping Sportsurge...');
    return [];
  }

  static async scrapeV2Links(): Promise<StreamLink[]> {
    // Would scrape v2links for active streams
    console.log('Scraping V2Links...');
    return [];
  }
}
