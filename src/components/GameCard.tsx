
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import type { Game } from '@/pages/Index';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-600 text-white animate-pulse';
      case 'upcoming':
        return 'bg-blue-600 text-white';
      case 'finished':
        return 'bg-slate-600 text-slate-300';
      default:
        return 'bg-slate-600 text-slate-300';
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
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
            {game.league.toUpperCase()}
          </Badge>
          <Badge className={getStatusColor(game.status)}>
            {game.status === 'live' ? '● LIVE' : game.status.toUpperCase()}
          </Badge>
        </div>

        {/* Teams */}
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
            <span className="font-medium text-white flex-1">{game.homeTeam}</span>
            {game.status === 'live' && typeof game.homeScore === 'number' && (
              <span className="font-bold text-lg text-green-400">{game.homeScore}</span>
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
            <span className="font-medium text-white flex-1">{game.awayTeam}</span>
            {game.status === 'live' && typeof game.awayScore === 'number' && (
              <span className="font-bold text-lg text-green-400">{game.awayScore}</span>
            )}
          </div>
        </div>

        {/* Time and Action */}
        <div className="space-y-3 pt-2 border-t border-slate-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">
              {game.status === 'live' ? 'Live Now' : formatTime(game.startTime)}
            </span>
            <span className="text-slate-400">
              {game.streams.filter(s => s.isWorking).length} streams
            </span>
          </div>
          
          <Button 
            onClick={handleWatchClick}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-blue-500/25"
            disabled={game.streams.filter(s => s.isWorking).length === 0}
          >
            {game.status === 'live' ? '📺 Watch Live' : '📅 View Details'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
