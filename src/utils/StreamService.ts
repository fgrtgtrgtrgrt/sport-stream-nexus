import type { Game, StreamLink } from '@/pages/Index';

const API_KEY = '1'; // TheSportsDB free API key
const API_BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

function createDummyStreams(game: Game): StreamLink[] {
  // You would replace this with real embed URLs from your backend scraper
  return [
    {
      id: `${game.id}-twitch1`,
      url: `https://player.twitch.tv/?channel=free&parent=yourdomain.com&autoplay=false`,
      quality: 'HD',
      server: 'Twitch1',
      isWorking: true,
    },
    {
      id: `${game.id}-twitch2`,
      url: `https://player.twitch.tv/?channel=gaming&parent=yourdomain.com&autoplay=false`,
      quality: 'HD',
      server: 'Twitch2',
      isWorking: true,
    },
  ];
}

export class StreamService {
  static async getTodaysGames(): Promise<Game[]> {
    console.log('Fetching today\'s live events from TheSportsDB');

    // Get live events across all sports for today
    // This API returns live events; you can filter by sport later if needed
    const res = await fetch(`${API_BASE}/eventslast.php?id=441613`); // example: NBA last events for Lakers
    const data = await res.json();

    if (!data || !data.results) return [];

    // Map API data to your Game type
    const games: Game[] = data.results.map((item: any) => {
      return {
        id: item.idEvent,
        homeTeam: item.strHomeTeam,
        awayTeam: item.strAwayTeam,
        league: item.strLeague,
        startTime: item.dateEvent + 'T' + item.strTime,
        status: item.strStatus || 'live',
        homeScore: item.intHomeScore ? parseInt(item.intHomeScore) : 0,
        awayScore: item.intAwayScore ? parseInt(item.intAwayScore) : 0,
        homeLogo: `https://www.thesportsdb.com/images/media/team/badge/${item.strHomeTeamBadge || ''}`,
        awayLogo: `https://www.thesportsdb.com/images/media/team/badge/${item.strAwayTeamBadge || ''}`,
        streams: createDummyStreams(item),
      };
    });

    return games;
  }

  static async getGameById(gameId: string): Promise<Game | null> {
    console.log('Fetching game details from TheSportsDB for:', gameId);

    const res = await fetch(`${API_BASE}/lookupevent.php?id=${gameId}`);
    const data = await res.json();

    if (!data || !data.events || !data.events.length) return null;

    const item = data.events[0];

    return {
      id: item.idEvent,
      homeTeam: item.strHomeTeam,
      awayTeam: item.strAwayTeam,
      league: item.strLeague,
      startTime: item.dateEvent + 'T' + item.strTime,
      status: item.strStatus || 'live',
      homeScore: item.intHomeScore ? parseInt(item.intHomeScore) : 0,
      awayScore: item.intAwayScore ? parseInt(item.intAwayScore) : 0,
      homeLogo: `https://www.thesportsdb.com/images/media/team/badge/${item.strHomeTeamBadge || ''}`,
      awayLogo: `https://www.thesportsdb.com/images/media/team/badge/${item.strAwayTeamBadge || ''}`,
      streams: createDummyStreams(item),
    };
  }

  static async refreshGameStreams(gameId: string): Promise<Game> {
    // In a real app, this would re-scrape or check if streams are still valid
    const game = await this.getGameById(gameId);
    if (!game) throw new Error('Game not found');
    return game;
  }

  static async searchGames(query: string): Promise<Game[]> {
    const allGames = await this.getTodaysGames();
    return allGames.filter(game =>
      game.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
      game.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
      game.league.toLowerCase().includes(query.toLowerCase())
    );
  }
}
