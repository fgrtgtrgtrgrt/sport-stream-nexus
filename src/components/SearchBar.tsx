
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Search className="w-5 h-5 text-slate-400" />
      </div>
      <Input
        type="text"
        placeholder="Search teams, leagues, matches..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-4 py-3 bg-slate-900/60 backdrop-blur-sm border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200 shadow-lg hover:bg-slate-900/70 focus:bg-slate-900/80"
      />
    </div>
  );
};
