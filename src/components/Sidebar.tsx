
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
    <SidebarPrimitive className="border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">StreamHub</h2>
            <p className="text-xs text-slate-400">Free Sports Streams</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-3 mb-4">
            Sports Categories
          </h3>
          <SidebarMenu>
            {sportsCategories.map((category) => (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  onClick={() => onLeagueSelect(category.id)}
                  className={`w-full justify-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                    selectedLeague === category.id 
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  {category.count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto bg-slate-700 text-slate-200 text-xs"
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
