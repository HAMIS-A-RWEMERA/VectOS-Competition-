import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  Edit2,
  Lock,
  Layers,
  Crown
} from 'lucide-react';
import { Tournament, Team, BreakQualifier } from '../../types/competition';

interface BreakStudioProps {
  tournament: Tournament;
  breakAdvancement: BreakQualifier[];
}

export const BreakStudio: React.FC<BreakStudioProps> = ({
  tournament,
  breakAdvancement
}) => {
  const [breakSize, setBreakSize] = useState<number>(tournament.settings.breakSize || 8);
  const [bracketType, setBracketType] = useState<'OPEN' | 'NOVICE'>('OPEN');

  const qualifiers = breakAdvancement.slice(0, breakSize);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Elimination Rounds Setup
            </span>
            <span className="text-xs text-slate-500 font-mono">Standard Out-Round Seed Matching (1 vs 8, 2 vs 7...)</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Break Calculator & Elimination Brackets
          </h2>
          <p className="text-xs text-slate-500">
            Determine break qualifiers, apply institutional caps or manual disqualification overrides, and build live knock-out brackets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Break Size:</span>
            <select
              value={breakSize}
              onChange={(e) => setBreakSize(Number(e.target.value))}
              className="bg-white text-slate-800 font-bold text-xs rounded border border-slate-200 py-1 px-2 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
            >
              <option value={4}>Top 4 (Semifinals)</option>
              <option value={8}>Top 8 (Quarterfinals)</option>
              <option value={16}>Top 16 (Octofinals)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Break Qualifiers Table & Status */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Projected Break Qualifiers (Top {breakSize})</span>
            </h3>
            <p className="text-xs text-slate-500">Ranked by Wins, Speaker Points, and Cumulative Net Margin</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Seed</th>
                <th className="py-3 px-4">Qualified Team</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4 text-center">Wins - Losses</th>
                <th className="py-3 px-4 text-right font-mono">Total Points</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {qualifiers.map((qual) => (
                <tr key={qual.teamId} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 text-center font-bold font-mono">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                      #{qual.seed}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{qual.teamName}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">{qual.institutionName}</td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                    {qual.wins}W - {qual.losses}L
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {qual.totalSpeakerScore}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Qualified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Knockout Bracket Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              <span>Out-Round Bracket Structure (Quarterfinals to Grand Final)</span>
            </h3>
            <p className="text-xs text-slate-500">Standard single-elimination tournament tree with paired seeds</p>
          </div>
        </div>

        {/* 3-Column Bracket Tree */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Quarterfinals */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 text-center pb-2 border-b border-slate-200">
              Quarterfinals (Round 6)
            </h4>
            
            {/* QF 1: Seed 1 vs Seed 8 */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-900">
                <span className="text-blue-900">#1 {qualifiers[0]?.teamName || 'Seed 1'}</span>
                <span className="font-mono text-slate-500">{qualifiers[0]?.wins}W</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>#8 {qualifiers[7]?.teamName || 'Seed 8'}</span>
                <span className="font-mono text-slate-400">{qualifiers[7]?.wins}W</span>
              </div>
            </div>

            {/* QF 2: Seed 4 vs Seed 5 */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-900">
                <span className="text-blue-900">#4 {qualifiers[3]?.teamName || 'Seed 4'}</span>
                <span className="font-mono text-slate-500">{qualifiers[3]?.wins}W</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>#5 {qualifiers[4]?.teamName || 'Seed 5'}</span>
                <span className="font-mono text-slate-400">{qualifiers[4]?.wins}W</span>
              </div>
            </div>

            {/* QF 3: Seed 2 vs Seed 7 */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-900">
                <span className="text-blue-900">#2 {qualifiers[1]?.teamName || 'Seed 2'}</span>
                <span className="font-mono text-slate-500">{qualifiers[1]?.wins}W</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>#7 {qualifiers[6]?.teamName || 'Seed 7'}</span>
                <span className="font-mono text-slate-400">{qualifiers[6]?.wins}W</span>
              </div>
            </div>

            {/* QF 4: Seed 3 vs Seed 6 */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-900">
                <span className="text-blue-900">#3 {qualifiers[2]?.teamName || 'Seed 3'}</span>
                <span className="font-mono text-slate-500">{qualifiers[2]?.wins}W</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>#6 {qualifiers[5]?.teamName || 'Seed 6'}</span>
                <span className="font-mono text-slate-400">{qualifiers[5]?.wins}W</span>
              </div>
            </div>
          </div>

          {/* Semifinals */}
          <div className="space-y-4 flex flex-col justify-around">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 text-center pb-2 border-b border-slate-200">
              Semifinals (Round 7)
            </h4>

            {/* SF 1 */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-blue-200 space-y-2 shadow-xs">
              <div className="text-[10px] font-bold uppercase text-blue-900">Winner QF 1 vs Winner QF 2</div>
              <div className="text-xs font-bold text-slate-900">TBD Matchup</div>
              <div className="text-[11px] text-slate-500">Panel of 3 Adjudicators</div>
            </div>

            {/* SF 2 */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-blue-200 space-y-2 shadow-xs">
              <div className="text-[10px] font-bold uppercase text-blue-900">Winner QF 3 vs Winner QF 4</div>
              <div className="text-xs font-bold text-slate-900">TBD Matchup</div>
              <div className="text-[11px] text-slate-500">Panel of 3 Adjudicators</div>
            </div>
          </div>

          {/* Grand Final */}
          <div className="space-y-4 flex flex-col justify-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 text-center pb-2 border-b border-slate-200 flex items-center justify-center gap-1.5">
              <Crown className="h-4 w-4 text-amber-500" />
              <span>Grand Final (Round 8)</span>
            </h4>

            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-200 text-center space-y-3 shadow-xs">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 border border-amber-300 mx-auto">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900">Championship Trophy Match</h5>
                <p className="text-xs text-slate-600">Winner Semifinal 1 vs Winner Semifinal 2</p>
              </div>
              <div className="text-[11px] font-mono text-amber-800 bg-amber-100 py-1 px-3 rounded-full inline-block border border-amber-200">
                Auditorium Main Stage • 5-Judge Panel
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
