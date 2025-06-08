
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  showLiveOnly: boolean;
  onToggleLiveOnly: () => void;
  gamesCount: number;
  liveCount: number;
}

export const FilterBar = ({ showLiveOnly, onToggleLiveOnly, gamesCount, liveCount }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        <Button
          onClick={onToggleLiveOnly}
          variant={showLiveOnly ? "default" : "outline"}
          className={showLiveOnly 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "border-slate-700 text-slate-300 hover:bg-slate-800"
          }
        >
          {showLiveOnly ? '● Live Only' : 'All Games'}
        </Button>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {gamesCount} games
          </Badge>
          {liveCount > 0 && (
            <Badge className="bg-green-600 text-white animate-pulse">
              {liveCount} live
            </Badge>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-400">
        Auto-refresh every 5 minutes
      </div>
    </div>
  );
};
