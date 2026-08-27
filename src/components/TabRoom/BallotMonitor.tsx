import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Eye, 
  Send, 
  ShieldCheck, 
  X,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { Tournament, DebateMatch, Ballot, BallotStatus } from '../../types/competition';

interface BallotMonitorProps {
  tournament: Tournament;
  onSubmitBallot: (debateId: string, ballot: Ballot) => void;
  onCorrectBallot: (ballotId: string, field: string, oldValue: any, newValue: any, reason: string) => void;
  isActionLoading: boolean;
}

export const BallotMonitor: React.FC<BallotMonitorProps> = ({
  tournament,
  onSubmitBallot,
  onCorrectBallot,
  isActionLoading
}) => {
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(tournament.currentRoundNumber || 4);
  const [activeDebateForEntry, setActiveDebateForEntry] = useState<DebateMatch | null>(null);
  const [activeBallotForCorrection, setActiveBallotForCorrection] = useState<Ballot | null>(null);

  // Quick Tab Ballot Entry State
  const [tabWinner, setTabWinner] = useState<'GOVERNMENT' | 'OPPOSITION'>('GOVERNMENT');
  const [propScores, setPropScores] = useState<number[]>([76, 75, 76, 38]);
  const [oppScores, setOppScores] = useState<number[]>([74, 75, 74, 37]);
  const [tabFeedback, setTabFeedback] = useState<string>('');

  // Tab Score Correction State
  const [correctionField, setCorrectionField] = useState<string>('Speaker 1 (Gov)');
  const [correctionOldVal, setCorrectionOldVal] = useState<string>('74');
  const [correctionNewVal, setCorrectionNewVal] = useState<string>('76');
  const [correctionReason, setCorrectionReason] = useState<string>('');

  const currentRound = tournament.rounds.find(r => r.roundNumber === selectedRoundNumber) || tournament.rounds[0];
  const debates = currentRound?.debates || [];

  const totalDebates = debates.length;
  const receivedBallots = debates.filter(d => 
    d.ballots.some(b => b.status === 'SUBMITTED' || b.status === 'VERIFIED')
  ).length;
  const pendingBallots = totalDebates - receivedBallots;

  const handleOpenEntry = (debate: DebateMatch) => {
    setActiveDebateForEntry(debate);
    const existingBallot = debate.ballots[0];
    if (existingBallot && existingBallot.propScores.length >= 3) {
      setPropScores(existingBallot.propScores.map(p => p.score));
      setOppScores(existingBallot.oppScores.map(o => o.score));
      setTabWinner(existingBallot.winnerSide || 'GOVERNMENT');
      setTabFeedback(existingBallot.feedback || '');
    } else {
      setPropScores([75, 75, 75, 37.5]);
      setOppScores([74, 74, 74, 37]);
      setTabWinner('GOVERNMENT');
      setTabFeedback('');
    }
  };

  const handleSaveTabEntry = () => {
    if (!activeDebateForEntry) return;

    const gov = activeDebateForEntry.governmentTeam;
    const opp = activeDebateForEntry.oppositionTeam;
    const chair = activeDebateForEntry.chairJudge;

    const ballot: Ballot = {
      id: `ballot-${activeDebateForEntry.id}-${chair?.id || 'tab'}`,
      debateId: activeDebateForEntry.id,
      roundId: activeDebateForEntry.roundId,
      roundNumber: activeDebateForEntry.roundNumber,
      judgeId: chair?.id || 'tab-staff',
      judgeName: chair?.name || 'Tab Director (Manual Entry)',
      isChair: true,
      status: 'SUBMITTED',
      winnerSide: tabWinner,
      winnerTeamId: tabWinner === 'GOVERNMENT' ? gov.id : opp.id,
      propScores: [
        { speakerId: gov.speakers[0]?.id || 's1', speakerName: gov.speakers[0]?.name || 'Speaker 1', role: 'PROP_1', score: Number(propScores[0]) },
        { speakerId: gov.speakers[1]?.id || 's2', speakerName: gov.speakers[1]?.name || 'Speaker 2', role: 'PROP_2', score: Number(propScores[1]) },
        { speakerId: gov.speakers[2]?.id || 's3', speakerName: gov.speakers[2]?.name || 'Speaker 3', role: 'PROP_3', score: Number(propScores[2]) },
        { speakerId: gov.speakers[0]?.id || 's1', speakerName: gov.speakers[0]?.name || 'Speaker 1', role: 'PROP_REPLY', score: Number(propScores[3] || 37.5) }
      ],
      oppScores: [
        { speakerId: opp.speakers[0]?.id || 'o1', speakerName: opp.speakers[0]?.name || 'Speaker 1', role: 'OPP_1', score: Number(oppScores[0]) },
        { speakerId: opp.speakers[1]?.id || 'o2', speakerName: opp.speakers[1]?.name || 'Speaker 2', role: 'OPP_2', score: Number(oppScores[1]) },
        { speakerId: opp.speakers[2]?.id || 'o3', speakerName: opp.speakers[2]?.name || 'Speaker 3', role: 'OPP_3', score: Number(oppScores[2]) },
        { speakerId: opp.speakers[0]?.id || 'o1', speakerName: opp.speakers[0]?.name || 'Speaker 1', role: 'OPP_REPLY', score: Number(oppScores[3] || 37) }
      ],
      totalPropScore: propScores.reduce((a, b) => a + Number(b), 0),
      totalOppScore: oppScores.reduce((a, b) => a + Number(b), 0),
      feedback: tabFeedback,
      submittedAt: new Date().toISOString()
    };

    onSubmitBallot(activeDebateForEntry.id, ballot);
    setActiveDebateForEntry(null);
  };

  const handleApplyCorrection = () => {
    if (!activeBallotForCorrection || !correctionReason.trim()) return;
    onCorrectBallot(
      activeBallotForCorrection.id,
      correctionField,
      correctionOldVal,
      correctionNewVal,
      correctionReason
    );
    setActiveBallotForCorrection(null);
    setCorrectionReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Live Tab Operations
            </span>
            <span className="text-xs text-slate-500 font-mono">Ballot Tabulation & Integrity</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Live Ballot Monitor & Verification Desk
          </h2>
          <p className="text-xs text-slate-500">
            Monitor real-time judge submissions, verify score bounds, and record Tab corrections with auditable reasons.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* Progress Bar & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs md:col-span-2">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">Round {selectedRoundNumber} Ballot Collection Progress</span>
            <span className="font-mono font-bold text-blue-900">{receivedBallots} of {totalDebates} Ballots Received ({Math.round((receivedBallots / (totalDebates || 1)) * 100)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-900 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(receivedBallots / (totalDebates || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Missing Ballots</span>
            <div className="font-display text-2xl font-bold text-rose-600">{pendingBallots}</div>
          </div>
          <Clock className={`h-8 w-8 ${pendingBallots > 0 ? 'text-amber-500 animate-pulse' : 'text-emerald-600'}`} />
        </div>

      </div>

      {/* Ballot Monitor Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Ballot Submission Status Matrix</h3>
          <p className="text-xs text-slate-500">Real-time receipt tracker, speaker point totals, and Tab verification</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Matchup</th>
                <th className="py-3 px-4">Chair Adjudicator</th>
                <th className="py-3 px-4">Ballot Status</th>
                <th className="py-3 px-4">Decision & Margin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {debates.map((match, idx) => {
                const ballot = match.ballots[0];
                const isSubmitted = ballot?.status === 'SUBMITTED' || ballot?.status === 'VERIFIED';
                const isCorrected = ballot?.status === 'CORRECTED';

                return (
                  <tr key={match.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      <div>Room {idx + 1}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{match.room.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        <span className="text-blue-900">{match.governmentTeam.name}</span>
                        <span className="text-slate-400 mx-1.5">vs</span>
                        <span className="text-amber-900">{match.oppositionTeam.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-900">{match.chairJudge?.name || 'Unassigned'}</div>
                        <div className="text-[11px] text-slate-500">{match.chairJudge?.institutionName}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isSubmitted || isCorrected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {isCorrected ? 'Corrected & Logged' : 'Submitted'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded animate-pulse">
                          <Clock className="h-3 w-3 text-amber-600" />
                          Pending Submission
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {ballot && ballot.winnerSide ? (
                        <div>
                          <div className="font-bold text-slate-900">
                            Win: <span className={ballot.winnerSide === 'GOVERNMENT' ? 'text-blue-900' : 'text-amber-900'}>{ballot.winnerSide}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            Gov: {ballot.totalPropScore} | Opp: {ballot.totalOppScore} (Margin: {Math.abs(ballot.totalPropScore - ballot.totalOppScore)})
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEntry(match)}
                        className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded text-[11px] font-semibold transition shadow-xs"
                      >
                        {isSubmitted ? 'View / Edit' : 'Enter Ballot'}
                      </button>

                      {isSubmitted && (
                        <button
                          onClick={() => {
                            setActiveBallotForCorrection(ballot);
                            setCorrectionOldVal(String(ballot.propScores[0]?.score || 75));
                            setCorrectionNewVal(String(ballot.propScores[0]?.score || 75));
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-medium transition shadow-xs"
                          title="Tab score correction with mandatory audit reason"
                        >
                          Correction
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tab Direct Ballot Entry Modal */}
      {activeDebateForEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Direct Tab Ballot Entry</span>
                <h3 className="text-base font-bold text-slate-900">
                  Room {activeDebateForEntry.room.name} — {activeDebateForEntry.governmentTeam.name} vs {activeDebateForEntry.oppositionTeam.name}
                </h3>
              </div>
              <button onClick={() => setActiveDebateForEntry(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Decision Radio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Winner Determination:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTabWinner('GOVERNMENT')}
                  className={`p-3 rounded-lg border text-left font-semibold text-xs transition ${
                    tabWinner === 'GOVERNMENT'
                      ? 'bg-blue-50 border-blue-900 text-blue-900 ring-1 ring-blue-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-blue-900">Government Win</div>
                  <div className="text-sm font-bold text-slate-900">{activeDebateForEntry.governmentTeam.name}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTabWinner('OPPOSITION')}
                  className={`p-3 rounded-lg border text-left font-semibold text-xs transition ${
                    tabWinner === 'OPPOSITION'
                      ? 'bg-amber-50 border-amber-800 text-amber-900 ring-1 ring-amber-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-amber-700">Opposition Win</div>
                  <div className="text-sm font-bold text-slate-900">{activeDebateForEntry.oppositionTeam.name}</div>
                </button>
              </div>
            </div>

            {/* Speaker Scores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Government Scores */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-blue-900 uppercase">Government Scores (60-80)</span>
                {['1st Speaker (75)', '2nd Speaker (75)', '3rd Speaker (75)', 'Reply Speech (30-40)'].map((label, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{label}</span>
                    <input
                      type="number"
                      step={idx === 3 ? "0.5" : "1"}
                      value={propScores[idx]}
                      onChange={(e) => {
                        const val = [...propScores];
                        val[idx] = Number(e.target.value);
                        setPropScores(val);
                      }}
                      className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-right font-mono text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 shadow-xs"
                    />
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-mono font-bold text-xs text-slate-900">
                  <span>Gov Total:</span>
                  <span className="text-blue-900">{propScores.reduce((a, b) => a + Number(b), 0)} pts</span>
                </div>
              </div>

              {/* Opposition Scores */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-amber-900 uppercase">Opposition Scores (60-80)</span>
                {['1st Speaker (75)', '2nd Speaker (75)', '3rd Speaker (75)', 'Reply Speech (30-40)'].map((label, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{label}</span>
                    <input
                      type="number"
                      step={idx === 3 ? "0.5" : "1"}
                      value={oppScores[idx]}
                      onChange={(e) => {
                        const val = [...oppScores];
                        val[idx] = Number(e.target.value);
                        setOppScores(val);
                      }}
                      className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-right font-mono text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 shadow-xs"
                    />
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-mono font-bold text-xs text-slate-900">
                  <span>Opp Total:</span>
                  <span className="text-amber-900">{oppScores.reduce((a, b) => a + Number(b), 0)} pts</span>
                </div>
              </div>

            </div>

            {/* Tab Feedback Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adjudication / Tab Notes:</label>
              <textarea
                value={tabFeedback}
                onChange={(e) => setTabFeedback(e.target.value)}
                placeholder="Key justification of decision or oral feedback summary..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setActiveDebateForEntry(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTabEntry}
                disabled={isActionLoading}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save & Verify Ballot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Score Correction Modal */}
      {activeBallotForCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Tab Score Correction</h3>
              </div>
              <button onClick={() => setActiveBallotForCorrection(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Score corrections are strictly logged in the immutable audit trail. A valid justification reason is mandatory.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field to Correct:</label>
                <select
                  value={correctionField}
                  onChange={(e) => setCorrectionField(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 shadow-xs"
                >
                  <option value="Speaker 1 (Gov)">Speaker 1 (Gov)</option>
                  <option value="Speaker 2 (Gov)">Speaker 2 (Gov)</option>
                  <option value="Speaker 3 (Gov)">Speaker 3 (Gov)</option>
                  <option value="Speaker 1 (Opp)">Speaker 1 (Opp)</option>
                  <option value="Speaker 2 (Opp)">Speaker 2 (Opp)</option>
                  <option value="Speaker 3 (Opp)">Speaker 3 (Opp)</option>
                  <option value="Decision Winner">Decision Winner</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Original Value:</label>
                  <input
                    type="text"
                    value={correctionOldVal}
                    onChange={(e) => setCorrectionOldVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Corrected Value:</label>
                  <input
                    type="text"
                    value={correctionNewVal}
                    onChange={(e) => setCorrectionNewVal(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-bold shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-700 mb-1">
                  Justification Reason (Required):
                </label>
                <input
                  type="text"
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g. Judge arithmetic transcript error confirmed by Chair"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 shadow-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setActiveBallotForCorrection(null)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCorrection}
                disabled={!correctionReason.trim()}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                Apply & Record Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
