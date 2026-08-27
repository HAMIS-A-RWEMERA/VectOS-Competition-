import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Zap, 
  Award,
  Users,
  Eye,
  Settings
} from 'lucide-react';
import { Tournament, Judge, DebateMatch } from '../../types/competition';

interface JudgeAllocationStudioProps {
  tournament: Tournament;
  onAllocateJudges: (roundNumber: number) => void;
  isActionLoading: boolean;
}

export const JudgeAllocationStudio: React.FC<JudgeAllocationStudioProps> = ({
  tournament,
  onAllocateJudges,
  isActionLoading
}) => {
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(tournament.currentRoundNumber || 4);
  const currentRound = tournament.rounds.find(r => r.roundNumber === selectedRoundNumber) || tournament.rounds[0];
  const debates = currentRound?.debates || [];

  const unassignedCount = debates.filter(d => !d.chairJudge).length;
  const exceptionCount = debates.filter(d => d.hasWarning).length;
  const optimalCount = debates.length - exceptionCount - unassignedCount;

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
              Adjudication Core Studio
            </span>
            <span className="text-xs text-slate-500 font-mono">Conflict Matrix & Ranking Distribution</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Judge Allocation & Conflict Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Automated conflict-free chair and panelist allocation adhering to strict institutional and coaching clash rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedRoundNumber}
            onChange={(e) => setSelectedRoundNumber(Number(e.target.value))}
            className="bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          >
            {tournament.rounds.map((r) => (
              <option key={r.id} value={r.roundNumber}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onAllocateJudges(selectedRoundNumber)}
            disabled={isActionLoading || debates.length === 0}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Auto-Allocate Adjudicators</span>
          </button>
        </div>
      </div>

      {/* Allocation Quality Report Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Optimal Assignments</span>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-slate-900">{optimalCount}</span>
            <span className="text-xs text-slate-500">/ {debates.length} debates (Zero conflicts)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Exception Notices</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-slate-900">{exceptionCount}</span>
            <span className="text-xs text-amber-700 font-medium">Flagged for Tab review</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Adjudicator Pool Available</span>
            <Users className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-slate-900">{tournament.judges.length}</span>
            <span className="text-xs text-slate-500">judges ({tournament.judges.filter(j => j.isChairAccredited).length} chair-certified)</span>
          </div>
        </div>

      </div>

      {/* Allocation Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Adjudicator Assignments for {currentRound.name}</h3>
          <p className="text-xs text-slate-500">Chair ratings, panel judges, and conflict detection status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Room / Match</th>
                <th className="py-3 px-4">Debating Teams</th>
                <th className="py-3 px-4">Chair Adjudicator</th>
                <th className="py-3 px-4">Rating & Accr.</th>
                <th className="py-3 px-4">Conflict Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {debates.map((match, idx) => {
                const chair = match.chairJudge;
                const hasNotice = match.hasWarning || (chair && (chair.institutionId === match.governmentTeam.institutionId || chair.institutionId === match.oppositionTeam.institutionId));

                return (
                  <tr key={match.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      <div>Room {idx + 1}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{match.room.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-blue-900 font-semibold">
                          Gov: {match.governmentTeam.name} <span className="text-[10px] text-slate-500 font-normal">({match.governmentTeam.institutionName})</span>
                        </span>
                        <span className="text-xs text-amber-900 font-semibold">
                          Opp: {match.oppositionTeam.name} <span className="text-[10px] text-slate-500 font-normal">({match.oppositionTeam.institutionName})</span>
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {chair ? (
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{chair.name}</span>
                            {chair.isChairAccredited && (
                              <Award className="h-3.5 w-3.5 text-amber-500" title="Accredited Chair" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{chair.institutionName}</div>
                        </div>
                      ) : (
                        <span className="text-rose-600 font-semibold">Unallocated</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {chair ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                            {chair.rating} / 10
                          </span>
                          <span className="text-[10px] text-slate-500">{chair.experienceLevel}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {hasNotice ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                          Institutional Notice
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                          Clean (No Conflicts)
                        </span>
                      )}
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
