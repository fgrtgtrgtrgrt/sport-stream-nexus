
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white w-full relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="flex w-full relative z-10">
          <Sidebar selectedLeague={selectedLeague} onLeagueSelect={setSelectedLeague} />
          
          <main className="flex-1 p-8 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Enhanced Header */}
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <div>
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent leading-tight">
                        StreamHub
                      </h1>
                      <p className="text-slate-400 text-lg font-medium">
                        Premium Sports Streaming • Free Forever
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-green-600/20 border border-green-600/30 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-400 font-medium">Live Now</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>✨ No Ads</span>
                      <span>•</span>
                      <span>🔒 No Registration</span>
                      <span>•</span>
                      <span>⚡ HD Quality</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-auto lg:min-w-[320px]">
                  <SearchBar 
                    value={searchQuery} 
                    onChange={setSearchQuery}
                  />
                </div>
              </div>

              {/* Enhanced Filter Bar */}
              <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
                <FilterBar 
                  showLiveOnly={showLiveOnly}
                  onToggleLiveOnly={() => setShowLiveOnly(!showLiveOnly)}
                  gamesCount={filteredGames.length}
                  liveCount={games.filter(g => g.status === 'live').length}
                />
              </div>

              {/* Games Grid */}
              <div className="pb-8">
                <GamesGrid 
                  games={filteredGames}
                  isLoading={isLoading}
                  onRefresh={loadGames}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
