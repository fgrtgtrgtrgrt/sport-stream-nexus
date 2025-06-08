
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Globe, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  showLiveOnly: boolean;
  onToggleLiveOnly: () => void;
  gamesCount: number;
  liveCount: number;
}

export const FilterBar = ({ showLiveOnly, onToggleLiveOnly, gamesCount, liveCount }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-6 items-center justify-between">
      <div className="flex gap-4 items-center">
        <Button
          onClick={onToggleLiveOnly}
          variant={showLiveOnly ? "default" : "outline"}
          className={showLiveOnly 
            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 border-0" 
            : "border-slate-600/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500 backdrop-blur-sm"
          }
        >
          {showLiveOnly ? (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Live Only
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 mr-2" />
              All Games
            </>
          )}
        </Button>
        
        <div className="flex gap-3">
          <Badge variant="outline" className="border-slate-600/50 text-slate-300 bg-slate-800/30 backdrop-blur-sm px-3 py-1.5">
            {gamesCount} games
          </Badge>
          {liveCount > 0 && (
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white animate-pulse shadow-lg shadow-green-500/25 px-3 py-1.5">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              {liveCount} live
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-400">
        <RefreshCw className="w-4 h-4" />
        <span>Auto-refresh every 5 minutes</span>
      </div>
    </div>
  );
};
