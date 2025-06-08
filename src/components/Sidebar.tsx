
import { useState } from 'react';
import { 
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  selectedLeague: string;
  onLeagueSelect: (league: string) => void;
}

const sportsCategories = [
  { id: 'all', name: 'All Sports', icon: '🏆', count: 0 },
  { id: 'nfl', name: 'NFL', icon: '🏈', count: 8 },
  { id: 'nba', name: 'NBA', icon: '🏀', count: 12 },
  { id: 'mlb', name: 'MLB', icon: '⚾', count: 15 },
  { id: 'nhl', name: 'NHL', icon: '🏒', count: 6 },
  { id: 'soccer', name: 'Soccer', icon: '⚽', count: 22 },
  { id: 'ufc', name: 'UFC/MMA', icon: '🥊', count: 2 },
  { id: 'boxing', name: 'Boxing', icon: '🥊', count: 1 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', count: 4 },
  { id: 'golf', name: 'Golf', icon: '⛳', count: 3 },
  { id: 'f1', name: 'Formula 1', icon: '🏎️', count: 1 },
];

export const Sidebar = ({ selectedLeague, onLeagueSelect }: SidebarProps) => {
  return (
    <SidebarPrimitive className="border-r border-slate-800/50 bg-slate-950/60 backdrop-blur-xl">
      <SidebarHeader className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/25 relative">
            <span className="text-white font-bold text-xl">S</span>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl blur-xl"></div>
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">StreamHub</h2>
            <p className="text-sm text-slate-400 font-medium">Free Sports Streams</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-3 mb-6">
            Sports Categories
          </h3>
          <SidebarMenu>
            {sportsCategories.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  onClick={() => onLeagueSelect(category.id)}
                  className={`w-full justify-start gap-4 p-4 rounded-xl transition-all duration-200 ${
                    selectedLeague === category.id 
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl shadow-blue-500/25 border border-blue-500/30' 
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-slate-700/50'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium flex-1 text-left">{category.name}</span>
                  {category.count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-auto text-xs font-medium ${
                        selectedLeague === category.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-slate-700/50 text-slate-300 border-slate-600/50'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </SidebarPrimitive>
  );
};
