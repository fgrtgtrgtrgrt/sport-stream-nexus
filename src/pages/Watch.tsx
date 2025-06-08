
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StreamPlayer } from '@/components/StreamPlayer';
import { StreamService } from '@/utils/StreamService';
import type { Game, StreamLink } from '@/pages/Index';

const Watch = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [selectedStream, setSelectedStream] = useState<StreamLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    if (!gameId) return;
    
    setIsLoading(true);
    try {
      console.log('Loading game details for:', gameId);
      const gameData = await StreamService.getGameById(gameId);
      setGame(gameData);
      
      // Select first working stream
      const workingStream = gameData?.streams.find(s => s.isWorking);
      if (workingStream) {
        setSelectedStream(workingStream);
      }
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStreams = async () => {
    if (!game) return;
    
    console.log('Refreshing streams for game:', game.id);
    try {
      const updatedGame = await StreamService.refreshGameStreams(game.id);
      setGame(updatedGame);
      
      // If current stream is broken, select a new working one
      if (selectedStream && !updatedGame.streams.find(s => s.id === selectedStream.id)?.isWorking) {
        const newWorkingStream = updatedGame.streams.find(s => s.isWorking);
        if (newWorkingStream) {
          setSelectedStream(newWorkingStream);
        }
      }
    } catch (error) {
      console.error('Error refreshing streams:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-64"></div>
            <div className="aspect-video bg-slate-700 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Not Found</h1>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            ← Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {game.league.toUpperCase()}
              </Badge>
              <Badge className={game.status === 'live' ? 'bg-green-600 animate-pulse' : 'bg-slate-600'}>
                {game.status === 'live' ? '● LIVE' : game.status.toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">
              {game.homeTeam} vs {game.awayTeam}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              {selectedStream ? (
                <StreamPlayer 
                  stream={selectedStream}
                  onStreamError={() => refreshStreams()}
                />
              ) : (
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📺</div>
                    <h3 className="text-xl font-semibold mb-2">No Working Streams</h3>
                    <p className="text-slate-400 mb-4">
                      We're looking for available streams...
                    </p>
                    <Button onClick={refreshStreams}>
                      Refresh Streams
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Stream Controls */}
            <div className="flex gap-4">
              <Button 
                onClick={refreshStreams}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                🔄 Refresh Streams
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                🔧 Fix Player
              </Button>
            </div>
          </div>

          {/* Stream Servers */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="font-semibold mb-4">Available Servers</h3>
              <div className="space-y-2">
                {game.streams.map((stream) => (
                  <Button
                    key={stream.id}
                    onClick={() => setSelectedStream(stream)}
                    variant={selectedStream?.id === stream.id ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedStream?.id === stream.id 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "border-slate-700 text-slate-300 hover:bg-slate-800"
                    } ${!stream.isWorking ? 'opacity-50' : ''}`}
                    disabled={!stream.isWorking}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className={`w-2 h-2 rounded-full ${stream.isWorking ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="flex-1 text-left">{stream.server}</span>
                      <span className="text-xs text-slate-400">{stream.quality}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Game Info */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="font-semibold mb-4">Match Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={game.homeLogo} 
                    alt={game.homeTeam}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <span className="flex-1">{game.homeTeam}</span>
                  {game.status === 'live' && typeof game.homeScore === 'number' && (
                    <span className="font-bold text-green-400">{game.homeScore}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src={game.awayLogo} 
                    alt={game.awayTeam}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <span className="flex-1">{game.awayTeam}</span>
                  {game.status === 'live' && typeof game.awayScore === 'number' && (
                    <span className="font-bold text-green-400">{game.awayScore}</span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
