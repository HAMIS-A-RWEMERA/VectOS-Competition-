import React, { useState } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Award, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  Sparkles,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Tournament, DebateMatch, Ballot } from '../../types/competition';

interface JudgeBallotFormProps {
  tournament: Tournament;
  onSubmitBallot: (debateId: string, ballot: Ballot) => void;
  isActionLoading: boolean;
}

export const JudgeBallotForm: React.FC<JudgeBallotFormProps> = ({
  tournament,
  onSubmitBallot,
  isActionLoading
}) => {
  const currentRound = tournament.rounds.find(r => r.roundNumber === tournament.currentRoundNumber) || tournament.rounds[0];
  const activeDebates = currentRound?.debates || [];
  
  // Default to first debate in active round
  const [selectedDebateId, setSelectedDebateId] = useState<string>(activeDebates[0]?.id || '');
  const match = activeDebates.find(d => d.id === selectedDebateId) || activeDebates[0];

  // Scores State
  const [propScores, setPropScores] = useState<number[]>([76, 75, 76, 38]);
  const [oppScores, setOppScores] = useState<number[]>([74, 75, 75, 37]);
  const [winnerSide, setWinnerSide] = useState<'GOVERNMENT' | 'OPPOSITION'>('GOVERNMENT');
  const [oralFeedback, setOralFeedback] = useState<string>('');
  const [submittedReceipt, setSubmittedReceipt] = useState<boolean>(false);

  if (!match) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs">
        <Smartphone className="h-8 w-8 text-blue-900 mx-auto mb-2" />
        <p>No active debate assigned to your adjudicator account for {currentRound?.name}.</p>
      </div>
    );
  }

  const gov = match.governmentTeam;
  const opp = match.oppositionTeam;

  const totalGovScore = propScores.reduce((a, b) => a + Number(b), 0);
  const totalOppScore = oppScores.reduce((a, b) => a + Number(b), 0);
  const margin = Math.abs(totalGovScore - totalOppScore);

  // Sanity check: does winner match higher speaker points?
  const hasScoreMismatch = (winnerSide === 'GOVERNMENT' && totalGovScore < totalOppScore) ||
    (winnerSide === 'OPPOSITION' && totalOppScore < totalGovScore);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chair = match.chairJudge;

    const ballot: Ballot = {
      id: `ballot-${match.id}-${chair?.id || 'chair-judge'}`,
      debateId: match.id,
      roundId: match.roundId,
      roundNumber: match.roundNumber,
      judgeId: chair?.id || 'chair-judge',
      judgeName: chair?.name || 'Accredited Chair Adjudicator',
      isChair: true,
      status: 'SUBMITTED',
      winnerSide,
      winnerTeamId: winnerSide === 'GOVERNMENT' ? gov.id : opp.id,
      propScores: [
        { speakerId: gov.speakers[0]?.id || 's1', speakerName: gov.speakers[0]?.name || '1st Speaker', role: 'PROP_1', score: Number(propScores[0]) },
        { speakerId: gov.speakers[1]?.id || 's2', speakerName: gov.speakers[1]?.name || '2nd Speaker', role: 'PROP_2', score: Number(propScores[1]) },
        { speakerId: gov.speakers[2]?.id || 's3', speakerName: gov.speakers[2]?.name || '3rd Speaker', role: 'PROP_3', score: Number(propScores[2]) },
        { speakerId: gov.speakers[0]?.id || 's1', speakerName: gov.speakers[0]?.name || 'Reply Speaker', role: 'PROP_REPLY', score: Number(propScores[3] || 38) }
      ],
      oppScores: [
        { speakerId: opp.speakers[0]?.id || 'o1', speakerName: opp.speakers[0]?.name || '1st Speaker', role: 'OPP_1', score: Number(oppScores[0]) },
        { speakerId: opp.speakers[1]?.id || 'o2', speakerName: opp.speakers[1]?.name || '2nd Speaker', role: 'OPP_2', score: Number(oppScores[1]) },
        { speakerId: opp.speakers[2]?.id || 'o3', speakerName: opp.speakers[2]?.name || '3rd Speaker', role: 'OPP_3', score: Number(oppScores[2]) },
        { speakerId: opp.speakers[0]?.id || 'o1', speakerName: opp.speakers[0]?.name || 'Reply Speaker', role: 'OPP_REPLY', score: Number(oppScores[3] || 37) }
      ],
      totalPropScore: totalGovScore,
      totalOppScore: totalOppScore,
      feedback: oralFeedback,
      submittedAt: new Date().toISOString()
    };

    onSubmitBallot(match.id, ballot);
    setSubmittedReceipt(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Mobile-Optimized Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Digital Adjudicator Ballot</span>
              <h2 className="text-sm font-bold text-slate-900">Room: {match.room.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online & Synced</span>
          </div>
        </div>

        {/* Motion Card */}
        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500">
            <BookOpen className="h-3.5 w-3.5 text-blue-900" />
            <span>Round {currentRound.roundNumber} Official Motion</span>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {match.motion?.text || currentRound.motion?.text || 'This House believes that African nations should prioritize regional digital currency integration over individual sovereign currencies.'}
          </p>
        </div>
      </div>

      {/* Submission Success Receipt */}
      {submittedReceipt ? (
        <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-6 text-center space-y-4 animate-fade-in shadow-xs">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ballot Submitted & Confirmed</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
              Your official decision and individual speaker scores have been recorded in the central Tabulation database.
            </p>
          </div>

          <div className="bg-white rounded-lg p-3.5 border border-slate-200 text-xs font-mono max-w-md mx-auto space-y-1 shadow-xs">
            <div className="text-slate-600">Decision: <span className="text-emerald-700 font-bold">{winnerSide} WIN</span></div>
            <div className="text-slate-600">Scores: Gov {totalGovScore} pts — Opp {totalOppScore} pts (Margin {margin})</div>
          </div>

          <button
            onClick={() => setSubmittedReceipt(false)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition"
          >
            Review or Edit Ballot
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Winner Selection Radio Cards */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Debate Decision (Select Winner):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWinnerSide('GOVERNMENT')}
                className={`p-4 rounded-xl border text-left transition ${
                  winnerSide === 'GOVERNMENT'
                    ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-blue-900">Proposition / Government</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{gov.name}</div>
                <div className="text-[11px] text-slate-500">{gov.institutionName}</div>
              </button>

              <button
                type="button"
                onClick={() => setWinnerSide('OPPOSITION')}
                className={`p-4 rounded-xl border text-left transition ${
                  winnerSide === 'OPPOSITION'
                    ? 'bg-amber-50/50 border-amber-600 ring-2 ring-amber-600/20'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-amber-800">Opposition</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{opp.name}</div>
                <div className="text-[11px] text-slate-500">{opp.institutionName}</div>
              </button>
            </div>

            {hasScoreMismatch && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Notice:</strong> Your selected winner has lower total speaker points than the losing team (Gov {totalGovScore} vs Opp {totalOppScore}). Please verify scores or adjust your decision.
                </span>
              </div>
            )}
          </div>

          {/* Speaker Points Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Individual Speaker Scores:
            </h3>

            {/* Government Team Inputs */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase">Proposition ({gov.name})</span>
                <span className="font-mono text-xs font-bold text-slate-900">Gov Total: <strong className="text-blue-900">{totalGovScore}</strong></span>
              </div>

              <div className="space-y-2">
                {gov.speakers.map((spk, idx) => (
                  <div key={spk.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{spk.name}</div>
                      <div className="text-[10px] text-slate-500">{idx === 0 ? '1st Prop' : idx === 1 ? '2nd Prop' : '3rd Prop'} (Standard 60-80)</div>
                    </div>
                    <input
                      type="number"
                      min={60}
                      max={80}
                      step={1}
                      value={propScores[idx]}
                      onChange={(e) => {
                        const s = [...propScores];
                        s[idx] = Number(e.target.value);
                        setPropScores(s);
                      }}
                      className="w-20 bg-white border border-slate-200 rounded-lg py-1 px-2 text-right font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 shadow-xs"
                    />
                  </div>
                ))}

                {/* Reply Speech */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Prop Reply Speech</div>
                    <div className="text-[10px] text-slate-500">Reply Half Score (30-40)</div>
                  </div>
                  <input
                    type="number"
                    min={30}
                    max={40}
                    step={0.5}
                    value={propScores[3]}
                    onChange={(e) => {
                      const s = [...propScores];
                      s[3] = Number(e.target.value);
                      setPropScores(s);
                    }}
                    className="w-20 bg-white border border-slate-200 rounded-lg py-1 px-2 text-right font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Opposition Team Inputs */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase">Opposition ({opp.name})</span>
                <span className="font-mono text-xs font-bold text-slate-900">Opp Total: <strong className="text-amber-800">{totalOppScore}</strong></span>
              </div>

              <div className="space-y-2">
                {opp.speakers.map((spk, idx) => (
                  <div key={spk.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{spk.name}</div>
                      <div className="text-[10px] text-slate-500">{idx === 0 ? '1st Opp' : idx === 1 ? '2nd Opp' : '3rd Opp'} (Standard 60-80)</div>
                    </div>
                    <input
                      type="number"
                      min={60}
                      max={80}
                      step={1}
                      value={oppScores[idx]}
                      onChange={(e) => {
                        const s = [...oppScores];
                        s[idx] = Number(e.target.value);
                        setOppScores(s);
                      }}
                      className="w-20 bg-white border border-slate-200 rounded-lg py-1 px-2 text-right font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 shadow-xs"
                    />
                  </div>
                ))}

                {/* Reply Speech */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Opp Reply Speech</div>
                    <div className="text-[10px] text-slate-500">Reply Half Score (30-40)</div>
                  </div>
                  <input
                    type="number"
                    min={30}
                    max={40}
                    step={0.5}
                    value={oppScores[3]}
                    onChange={(e) => {
                      const s = [...oppScores];
                      s[3] = Number(e.target.value);
                      setOppScores(s);
                    }}
                    className="w-20 bg-white border border-slate-200 rounded-lg py-1 px-2 text-right font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Adjudication Notes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Constructive Adjudication Feedback:
            </label>
            <textarea
              rows={3}
              value={oralFeedback}
              onChange={(e) => setOralFeedback(e.target.value)}
              placeholder="Outline the key clash points, burden fulfillment, and recommendations for both teams..."
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isActionLoading}
            className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit Official Digital Ballot</span>
          </button>

        </form>
      )}

    </div>
  );
};
