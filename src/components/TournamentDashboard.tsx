import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  UserCheck, 
  Layers, 
  DoorOpen, 
  BookOpen, 
  Share2, 
  FileText, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Zap,
  PlayCircle,
  Eye
} from 'lucide-react';
import { Tournament, TournamentHealth } from '../types/competition';

interface TournamentDashboardProps {
  tournament: Tournament;
  health: TournamentHealth;
  onNavigateTab: (tabId: string) => void;
  onGenerateDraw: (roundNumber: number) => void;
  onAllocateJudges: (roundNumber: number) => void;
  onToggleReleaseDraw: (roundNumber: number, current: boolean) => void;
  onToggleReleaseMotion: (roundNumber: number, current: boolean) => void;
  isActionLoading: boolean;
}

export const TournamentDashboard: React.FC<TournamentDashboardProps> = ({
  tournament,
  health,
  onNavigateTab,
  onGenerateDraw,
  onAllocateJudges,
  onToggleReleaseDraw,
  onToggleReleaseMotion,
  isActionLoading
}) => {
  const currentRound = tournament.rounds.find(r => r.roundNumber === tournament.currentRoundNumber) || tournament.rounds[0];
  const checkedInTeams = tournament.teams.filter(t => t.status === 'CHECKED_IN').length;
  const checkedInJudges = tournament.judges.filter(j => j.status === 'CHECKED_IN').length;

  const debatesCount = currentRound?.debates?.length || 0;
  const submittedBallots = currentRound?.debates?.filter(d => 
    d.ballots.some(b => b.status === 'SUBMITTED' || b.status === 'VERIFIED')
  ).length || 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Tournament Command Center */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                {tournament.format} Competition
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live: Round {tournament.currentRoundNumber} ({currentRound?.type})
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {tournament.name}
            </h1>

            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {tournament.description} • Venue: <span className="text-slate-900 font-semibold">{tournament.venue}</span> ({tournament.city}, {tournament.country})
            </p>
          </div>

          {/* Quick Round State Badge */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigateTab('ballots')}
              className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xs transition"
            >
              <FileText className="h-4 w-4" />
              <span>Live Ballot Monitor ({submittedBallots}/{debatesCount})</span>
            </button>
            <button
              onClick={() => onNavigateTab('standings')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-lg border border-slate-200 shadow-xs transition"
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>View Standings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Teams Check-In</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-slate-900">{checkedInTeams}</span>
            <span className="text-xs text-slate-500">/ {tournament.teams.length} teams ({tournament.teams.length * 3} debaters)</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(checkedInTeams / tournament.teams.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Adjudicator Pool</span>
            <UserCheck className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-slate-900">{checkedInJudges}</span>
            <span className="text-xs text-slate-500">/ {tournament.judges.length} accredited</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-600 h-1.5 rounded-full" style={{ width: `${(checkedInJudges / tournament.judges.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rooms & Venues</span>
            <DoorOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-slate-900">{tournament.rooms.length}</span>
            <span className="text-xs text-slate-500">active rooms (8 required)</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Capacity verified</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Preliminary Progress</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-slate-900">Round {tournament.currentRoundNumber}</span>
            <span className="text-xs text-slate-500">of {tournament.settings.prelimRoundsCount}</span>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500">
            Break to <span className="text-blue-700 font-semibold">Top {tournament.settings.breakSize} (Quarterfinals)</span>
          </div>
        </div>

      </div>

      {/* Operational Workflow Lifecycle Progress Pipeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span>Round {currentRound.roundNumber} Operational Workflow Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500">Connected tournament operating sequence from draw to ballot tabulation</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Status: {currentRound.status}
          </span>
        </div>

        {/* Workflow Steps Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          
          {/* Step 1: Check-in */}
          <div className="p-3.5 rounded-lg border bg-slate-50 border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">1. Check-In</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-slate-900">All Teams Present</p>
            <p className="text-[11px] text-slate-500">16 / 16 checked in</p>
            <button 
              onClick={() => onNavigateTab('participants')}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold mt-1 inline-flex items-center gap-1"
            >
              <span>Manage</span> <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Step 2: Draw / Pairings */}
          <div className="p-3.5 rounded-lg border bg-slate-50 border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">2. Pairings</span>
              {debatesCount > 0 ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900">{debatesCount > 0 ? `${debatesCount} Debates Paired` : 'Draw Pending'}</p>
            <p className="text-[11px] text-slate-500">Power-paired Swiss</p>
            <button 
              onClick={() => onNavigateTab('pairings')}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold mt-1 inline-flex items-center gap-1"
            >
              <span>Inspect Draw</span> <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Step 3: Judge Allocation */}
          <div className="p-3.5 rounded-lg border bg-slate-50 border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">3. Adjudication</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-slate-900">Chairs Assigned</p>
            <p className="text-[11px] text-amber-700 font-medium">1 Conflict notice</p>
            <button 
              onClick={() => onNavigateTab('judges')}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold mt-1 inline-flex items-center gap-1"
            >
              <span>Review Panel</span> <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Step 4: Motion Release */}
          <div className={`p-3.5 rounded-lg border space-y-1.5 ${
            currentRound.motionReleased
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">4. Motion</span>
              {currentRound.motionReleased ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <Clock className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900">
              {currentRound.motionReleased ? 'Motion Released' : 'Motion Embargoed'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{currentRound.motion?.text || 'Motion #4'}</p>
            <button 
              onClick={() => onToggleReleaseMotion(currentRound.roundNumber, currentRound.motionReleased)}
              disabled={isActionLoading}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold mt-1 inline-flex items-center gap-1"
            >
              <span>{currentRound.motionReleased ? 'Hide Motion' : 'Release Motion'}</span>
            </button>
          </div>

          {/* Step 5: Draw Publication */}
          <div className={`p-3.5 rounded-lg border space-y-1.5 ${
            currentRound.drawReleased
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">5. Public Release</span>
              {currentRound.drawReleased ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <Clock className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900">
              {currentRound.drawReleased ? 'Draw Published' : 'Draft Only'}
            </p>
            <p className="text-[11px] text-slate-500">Portal & App synced</p>
            <button 
              onClick={() => onToggleReleaseDraw(currentRound.roundNumber, currentRound.drawReleased)}
              disabled={isActionLoading}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold mt-1 inline-flex items-center gap-1"
            >
              <span>{currentRound.drawReleased ? 'Unpublish' : 'Publish Draw'}</span>
            </button>
          </div>

          {/* Step 6: Ballots & Tabulation */}
          <div className="p-3.5 rounded-lg border bg-slate-50 border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">6. Ballots</span>
              <Clock className="h-4 w-4 text-blue-600 animate-spin" />
            </div>
            <p className="text-xs font-semibold text-slate-900">{submittedBallots} / {debatesCount} Received</p>
            <p className="text-[11px] text-slate-500">{debatesCount - submittedBallots} pending submission</p>
            <button 
              onClick={() => onNavigateTab('ballots')}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold mt-1 inline-flex items-center gap-1"
            >
              <span>Monitor Live</span> <ArrowRight className="h-3 w-3" />
            </button>
          </div>

        </div>

        {/* Quick Direct Actions Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateDraw(currentRound.roundNumber)}
              disabled={isActionLoading}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition flex items-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Regenerate Power Pairings</span>
            </button>

            <button
              onClick={() => onAllocateJudges(currentRound.roundNumber)}
              disabled={isActionLoading}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition flex items-center gap-1.5"
            >
              <UserCheck className="h-3.5 w-3.5 text-cyan-600" />
              <span>Auto-Allocate Judges</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('motions')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-700" />
              <span>Motion Vault</span>
            </button>

            <button
              onClick={() => onNavigateTab('audit')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>View Audit Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Round Debates Snapshot Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Round 4 Matches & Adjudication Table</h3>
            <p className="text-xs text-slate-500">Real-time room allocations, government/opposition sides, and chair assignments</p>
          </div>
          <button
            onClick={() => onNavigateTab('pairings')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Open Pairing Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Debate / Room</th>
                <th className="py-3 px-4">Government (Proposition)</th>
                <th className="py-3 px-4">Opposition</th>
                <th className="py-3 px-4">Chair Adjudicator</th>
                <th className="py-3 px-4">Ballot Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentRound.debates.map((match, idx) => {
                const ballot = match.ballots[0];
                const isSubmitted = ballot?.status === 'SUBMITTED' || ballot?.status === 'VERIFIED';
                return (
                  <tr key={match.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">Match #{idx + 1}</div>
                      <div className="text-[11px] text-slate-500">{match.room.name}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-blue-900">{match.governmentTeam.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {match.governmentTeam.institutionName} • <span className="font-mono text-emerald-600 font-semibold">{match.governmentTeam.wins}W</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-amber-900">{match.oppositionTeam.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {match.oppositionTeam.institutionName} • <span className="font-mono text-emerald-600 font-semibold">{match.oppositionTeam.wins}W</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {match.chairJudge ? (
                        <div>
                          <div className="font-semibold text-slate-800">{match.chairJudge.name}</div>
                          <div className="text-[11px] text-slate-500">{match.chairJudge.institutionName}</div>
                        </div>
                      ) : (
                        <span className="text-rose-600 font-semibold">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="h-3 w-3" /> Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <Clock className="h-3 w-3 text-amber-500" /> Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigateTab('ballots')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded text-[11px] font-medium border border-slate-200 shadow-xs transition"
                      >
                        Ballot
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
