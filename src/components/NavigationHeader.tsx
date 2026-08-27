import React from 'react';
import { 
  Trophy, 
  Shield, 
  UserCheck, 
  Smartphone, 
  Globe, 
  RefreshCw, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserRole, Tournament, TournamentHealth } from '../types/competition';

interface NavigationHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  tournament: Tournament;
  health: TournamentHealth;
  onOpenHealthModal: () => void;
  onOpenNewTournamentModal: () => void;
  onResetSeed: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isResetting: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentRole,
  onRoleChange,
  tournament,
  health,
  onOpenHealthModal,
  onOpenNewTournamentModal,
  onResetSeed,
  activeTab,
  onTabChange,
  isResetting
}) => {
  const roleOptions: { role: UserRole; label: string; icon: any }[] = [
    { role: 'TOURNAMENT_DIRECTOR', label: 'Tournament Director', icon: Shield },
    { role: 'TAB_DIRECTOR', label: 'Tab Director', icon: Activity },
    { role: 'ADJ_CORE', label: 'Adjudication Core', icon: UserCheck },
    { role: 'JUDGE', label: 'Judge (Mobile Ballot)', icon: Smartphone },
    { role: 'PUBLIC_VIEWER', label: 'Public Portal', icon: Globe }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Bar: Brand, Tournament Name, Quick Actions, Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-900 flex items-center justify-center shadow-xs">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                  VectOS<span className="text-blue-600">Comp</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Tournament OS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate max-w-xs">{tournament.organizationName}</p>
            </div>
          </div>

          {/* Tournament Active Selector & Status */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 truncate max-w-xs">{tournament.name}</span>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-mono text-blue-700 font-semibold">{tournament.format}</span>
                <span>•</span>
                <span>Round {tournament.currentRoundNumber} in Progress</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">{tournament.city}, {tournament.country}</span>
              </div>
            </div>
          </div>

          {/* Health Status Pill */}
          <button 
            onClick={onOpenHealthModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs ${
              health.status === 'GREEN'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : health.status === 'YELLOW'
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
            title="Click to view tournament operational health diagnostics"
          >
            {health.status === 'GREEN' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            <span>Health: {health.status === 'GREEN' ? 'Operational' : health.status}</span>
          </button>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Role Switcher Dropdown */}
            <div className="relative">
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-white text-slate-700 text-xs font-medium rounded-lg border border-slate-200 py-1.5 pl-2.5 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer shadow-xs"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.role} value={opt.role}>
                    Role: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Demo Reset Seed Button */}
            <button
              onClick={onResetSeed}
              disabled={isResetting}
              className="p-1.5 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200 shadow-xs transition"
              title="Reset to EAUDC 2026 default demo state"
            >
              <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* New Tournament Button */}
            <button
              onClick={onOpenNewTournamentModal}
              className="hidden lg:flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Tournament</span>
            </button>

          </div>
        </div>

        {/* Tab Navigation for Staff */}
        {currentRole !== 'JUDGE' && currentRole !== 'PUBLIC_VIEWER' && (
          <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-100 py-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Command Center' },
              { id: 'pairings', label: 'Pairings & Draw' },
              { id: 'judges', label: 'Judge Allocation' },
              { id: 'ballots', label: 'Ballot Monitor' },
              { id: 'standings', label: 'Standings (Team & Speaker)' },
              { id: 'break', label: 'Break & Elimination' },
              { id: 'participants', label: 'Participants & Check-In' },
              { id: 'motions', label: 'Motion Vault' },
              { id: 'announcements', label: 'Announcements' },
              { id: 'audit', label: 'Audit Trail' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`text-xs font-medium whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
