
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Tv } from 'lucide-react';
import type { Game } from '@/pages/Index';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 text-white animate-pulse shadow-lg shadow-green-500/25';
      case 'upcoming':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25';
      case 'finished':
        return 'bg-slate-600/50 text-slate-300';
      default:
        return 'bg-slate-600/50 text-slate-300';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleWatchClick = () => {
    navigate(`/watch/${game.id}`);
  };

  return (
    <Card className="bg-slate-900/40 backdrop-blur-sm border-slate-700/50 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-slate-600/50 group relative overflow-hidden rounded-xl">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="border-slate-600/50 text-slate-300 text-xs font-medium bg-slate-800/30 backdrop-blur-sm">
            {game.league.toUpperCase()}
          </Badge>
          <Badge className={`${getStatusColor(game.status)} px-3 py-1`}>
            {game.status === 'live' ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                LIVE
              </>
            ) : (
              game.status.toUpperCase()
            )}
          </Badge>
        </div>

        {/* Teams */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={game.homeLogo} 
                alt={game.homeTeam}
                className="w-10 h-10 rounded-lg object-cover border border-slate-700/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <span className="font-medium text-white flex-1 text-lg">{game.homeTeam}</span>
            {game.status === 'live' && typeof game.homeScore === 'number' && (
              <span className="font-bold text-2xl text-green-400 bg-green-500/10 px-3 py-1 rounded-lg">
                {game.homeScore}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={game.awayLogo} 
                alt={game.awayTeam}
                className="w-10 h-10 rounded-lg object-cover border border-slate-700/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <span className="font-medium text-white flex-1 text-lg">{game.awayTeam}</span>
            {game.status === 'live' && typeof game.awayScore === 'number' && (
              <span className="font-bold text-2xl text-green-400 bg-green-500/10 px-3 py-1 rounded-lg">
                {game.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Time and Action */}
        <div className="space-y-4 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>
                {game.status === 'live' ? 'Live Now' : formatTime(game.startTime)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Tv className="w-4 h-4" />
              <span>
                {game.streams.filter(s => s.isWorking).length} streams
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleWatchClick}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-blue-500/25 text-white font-medium py-3 rounded-lg"
            disabled={game.streams.filter(s => s.isWorking).length === 0}
          >
            {game.status === 'live' ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Watch Live
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                View Details
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
