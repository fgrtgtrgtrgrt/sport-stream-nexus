
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { GamesGrid } from '@/components/GamesGrid';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { StreamService } from '@/utils/StreamService';
import { SidebarProvider } from '@/components/ui/sidebar';

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  status: 'live' | 'upcoming' | 'finished';
  homeScore?: number;
  awayScore?: number;
  homeLogo: string;
  awayLogo: string;
  streams: StreamLink[];
}

export interface StreamLink {
  id: string;
  url: string;
  quality: string;
  server: string;
  isWorking: boolean;
}

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLiveOnly, setShowLiveOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadGames();
    // Refresh every 5 minutes
    const interval = setInterval(loadGames, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterGames();
  }, [games, selectedLeague, searchQuery, showLiveOnly]);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      console.log('Loading games from StreamService...');
      const todaysGames = await StreamService.getTodaysGames();
      setGames(todaysGames);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = [...games];

    // Filter by league
    if (selectedLeague !== 'all') {
      filtered = filtered.filter(game => game.league.toLowerCase() === selectedLeague.toLowerCase());
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(game => 
        game.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by live status
    if (showLiveOnly) {
      filtered = filtered.filter(game => game.status === 'live');
    }

    // Sort by start time
    filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    setFilteredGames(filtered);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white w-full">
        <div className="flex w-full">
          <Sidebar selectedLeague={selectedLeague} onLeagueSelect={setSelectedLeague} />
          
          <main className="flex-1 p-6 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    Live Sports Streams
                  </h1>
                  <p className="text-slate-400 mt-2">
                    Watch live sports for free - No ads, no registration required
                  </p>
                </div>
                <SearchBar 
                  value={searchQuery} 
                  onChange={setSearchQuery}
                />
              </div>

              <FilterBar 
                showLiveOnly={showLiveOnly}
                onToggleLiveOnly={() => setShowLiveOnly(!showLiveOnly)}
                gamesCount={filteredGames.length}
                liveCount={games.filter(g => g.status === 'live').length}
              />

              <GamesGrid 
                games={filteredGames}
                isLoading={isLoading}
                onRefresh={loadGames}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
