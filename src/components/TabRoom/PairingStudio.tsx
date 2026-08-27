import React, { useState } from 'react';
import { 
  Zap, 
  ArrowLeftRight, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Share2, 
  Eye, 
  RefreshCw,
  Info,
  HelpCircle
} from 'lucide-react';
import { Tournament, Round, DebateMatch } from '../../types/competition';

interface PairingStudioProps {
  tournament: Tournament;
  onGenerateDraw: (roundNumber: number) => void;
  onToggleReleaseDraw: (roundNumber: number, current: boolean) => void;
  isActionLoading: boolean;
}

export const PairingStudio: React.FC<PairingStudioProps> = ({
  tournament,
  onGenerateDraw,
  onToggleReleaseDraw,
  isActionLoading
}) => {
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(tournament.currentRoundNumber || 4);
  const [selectedMatch, setSelectedMatch] = useState<DebateMatch | null>(null);
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');

  const currentRound = tournament.rounds.find(r => r.roundNumber === selectedRoundNumber) || tournament.rounds[0];
  const debates = currentRound?.debates || [];

  const handleSwapSides = () => {
    if (!selectedMatch) return;
    // Swap Gov and Opp
    const temp = selectedMatch.governmentTeam;
    selectedMatch.governmentTeam = selectedMatch.oppositionTeam;
    selectedMatch.oppositionTeam = temp;
    setSwapModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Tab Director Draw Studio
            </span>
            <span className="text-xs text-slate-500 font-mono">Format: WSDC Power-Paired Swiss</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Pairings & Side Allocation Studio
          </h2>
          <p className="text-xs text-slate-500">
            Deterministic power-matching by win brackets with net side balancing and institutional conflict avoidance.
          </p>
        </div>

        {/* Round Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedRoundNumber}
            onChange={(e) => setSelectedRoundNumber(Number(e.target.value))}
            className="bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          >
            {tournament.rounds.map((r) => (
              <option key={r.id} value={r.roundNumber}>
                {r.name} ({r.status})
              </option>
            ))}
          </select>

          <button
            onClick={() => onGenerateDraw(selectedRoundNumber)}
            disabled={isActionLoading}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Generate Power Draw</span>
          </button>

          <button
            onClick={() => onToggleReleaseDraw(selectedRoundNumber, currentRound.drawReleased)}
            disabled={isActionLoading}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border shadow-xs transition flex items-center gap-1.5 ${
              currentRound.drawReleased
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{currentRound.drawReleased ? 'Unpublish Draw' : 'Publish Draw to Portal'}</span>
          </button>
        </div>
      </div>

      {/* Pairing Inspection Grid */}
      {debates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <Zap className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Draw Generated for {currentRound.name}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Click "Generate Power Draw" to pair active checked-in teams according to their win-loss records and previous speaker scores.
          </p>
          <button
            onClick={() => onGenerateDraw(selectedRoundNumber)}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Generate Draw Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong>{debates.length}</strong> paired debates for {currentRound.name}</span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Optimal Pairing
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 ml-2" /> Notice Flag
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debates.map((match, idx) => {
              const gov = match.governmentTeam;
              const opp = match.oppositionTeam;
              const hasWarning = match.hasWarning || gov.institutionId === opp.institutionId;

              return (
                <div
                  key={match.id}
                  className={`bg-white border rounded-xl p-5 relative transition shadow-xs ${
                    hasWarning ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar: Room and Match Number */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Room {idx + 1}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{match.room.name}</span>
                    </div>

                    {hasWarning ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        <AlertTriangle className="h-3 w-3" /> Exception Notice
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" /> Balanced
                      </span>
                    )}
                  </div>

                  {/* Matchup Comparison Card */}
                  <div className="grid grid-cols-5 gap-2 items-center bg-slate-50 rounded-lg p-3.5 border border-slate-200 mb-3">
                    
                    {/* Government Side */}
                    <div className="col-span-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          GOV / PROP
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={gov.name}>{gov.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{gov.institutionName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                        <span className="font-mono text-emerald-600 font-semibold">{gov.wins}W - {gov.losses}L</span>
                        <span>•</span>
                        <span>{gov.totalSpeakerScore} pts</span>
                        <span>•</span>
                        <span title="Gov count">{gov.govCount}G / {gov.oppCount}O</span>
                      </div>
                    </div>

                    {/* VS Badge */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold font-mono text-slate-500 bg-white h-7 w-7 rounded-full flex items-center justify-center border border-slate-200 shadow-xs">
                        VS
                      </span>
                    </div>

                    {/* Opposition Side */}
                    <div className="col-span-2 space-y-1 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          OPP
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={opp.name}>{opp.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{opp.institutionName}</p>
                      <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500 pt-1">
                        <span title="Gov count">{opp.govCount}G / {opp.oppCount}O</span>
                        <span>•</span>
                        <span>{opp.totalSpeakerScore} pts</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-600 font-semibold">{opp.wins}W - {opp.losses}L</span>
                      </div>
                    </div>

                  </div>

                  {/* Warning Details if any */}
                  {match.warningReasons && match.warningReasons.length > 0 && (
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 flex items-start gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{match.warningReasons.join('; ')}</span>
                    </div>
                  )}

                  {/* Assigned Judge Info & Manual Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="text-[11px] text-slate-500">
                      Chair: <span className="font-semibold text-slate-800">{match.chairJudge?.name || 'Unallocated'}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMatch(match);
                        setSwapModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 px-2 py-1 bg-white rounded border border-slate-200 hover:bg-slate-50 shadow-xs transition"
                    >
                      <ArrowLeftRight className="h-3 w-3" />
                      <span>Swap Sides / Inspect</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Swap / Override Modal */}
      {swapModalOpen && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Manual Side Adjustment</h3>
            <p className="text-xs text-slate-500">
              You are about to swap sides for debate <strong>{selectedMatch.governmentTeam.name}</strong> (currently Gov) vs <strong>{selectedMatch.oppositionTeam.name}</strong> (currently Opp).
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-700">
              <div><strong>New Government:</strong> {selectedMatch.oppositionTeam.name}</div>
              <div><strong>New Opposition:</strong> {selectedMatch.governmentTeam.name}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tab Override Reason (Mandatory for Audit Trail):
              </label>
              <input
                type="text"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Side imbalance correction from Round 2"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSwapModalOpen(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSwapSides}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                Confirm Swap & Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
