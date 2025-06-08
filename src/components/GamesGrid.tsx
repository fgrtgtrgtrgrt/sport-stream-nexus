
import { GameCard } from './GameCard';
import { Button } from '@/components/ui/button';
import type { Game } from '@/pages/Index';

interface GamesGridProps {
  games: Game[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const GamesGrid = ({ games, isLoading, onRefresh }: GamesGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-slate-700 rounded w-16"></div>
              <div className="h-6 bg-slate-700 rounded w-12"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded flex-1"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">No games found</h3>
        <p className="text-slate-400 mb-6">
          Try adjusting your filters or check back later for more games.
        </p>
        <Button 
          onClick={onRefresh}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          Refresh Games
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          onClick={onRefresh}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Refresh All Streams
        </Button>
      </div>
    </div>
  );
};
