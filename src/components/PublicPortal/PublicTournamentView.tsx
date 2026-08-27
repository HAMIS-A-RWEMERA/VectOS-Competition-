import React, { useState } from 'react';
import { 
  Globe, 
  Trophy, 
  BookOpen, 
  Layers, 
  Crown, 
  Bell, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search,
  ArrowRight
} from 'lucide-react';
import { Tournament, BreakQualifier } from '../../types/competition';

interface PublicTournamentViewProps {
  tournament: Tournament;
  speakerStandings: any[];
  breakAdvancement: BreakQualifier[];
}

export const PublicTournamentView: React.FC<PublicTournamentViewProps> = ({
  tournament,
  speakerStandings,
  breakAdvancement
}) => {
  const [activeTab, setActiveTab] = useState<'DRAW' | 'MOTIONS' | 'STANDINGS' | 'BRACKET' | 'ANNOUNCEMENTS'>('DRAW');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentRound = tournament.rounds.find(r => r.roundNumber === tournament.currentRoundNumber) || tournament.rounds[0];
  const releasedDebates = currentRound?.drawReleased ? currentRound.debates : [];
  const releasedMotions = tournament.motions.filter(m => m.isReleased);

  const filteredDraw = releasedDebates.filter(d => {
    return d.governmentTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.oppositionTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.chairJudge?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const topQualifiers = breakAdvancement.slice(0, tournament.settings.breakSize || 8);

  return (
    <div className="space-y-6">
      
      {/* Public Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                Official Public Portal
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Round {tournament.currentRoundNumber} in Session
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {tournament.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hosted by <strong className="text-slate-800">{tournament.organizationName}</strong> • {tournament.description}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-2 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                {tournament.venue}, {tournament.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-900" />
                {tournament.startDate} to {tournament.endDate}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                {tournament.teams.length} Teams ({tournament.teams.length * 3} Debaters)
              </span>
            </div>
          </div>

          {/* Live Round Motion Snapshot */}
          {currentRound?.motionReleased && currentRound.motion && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-sm shadow-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-900">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Round {currentRound.roundNumber} Motion</span>
              </div>
              <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                "{currentRound.motion.text}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Public Navigation Tabs */}
      <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex flex-wrap gap-1 shadow-xs">
        {[
          { id: 'DRAW', label: `Public Draw (Round ${tournament.currentRoundNumber})`, icon: Layers },
          { id: 'MOTIONS', label: `Motions Archive (${releasedMotions.length})`, icon: BookOpen },
          { id: 'STANDINGS', label: 'Live Standings Tab', icon: Trophy },
          { id: 'BRACKET', label: 'Elimination Break', icon: Crown },
          { id: 'ANNOUNCEMENTS', label: 'Announcements', icon: Bell }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Public Draw View */}
      {activeTab === 'DRAW' && (
        <div className="space-y-4">
          {!currentRound?.drawReleased ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-xs">
              <Clock className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 mb-1">Draw Not Yet Released</h3>
              <p className="text-xs">The Tabulation Director is currently finalizing pairings and judge allocations. The draw will appear here immediately upon release.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by team, room, judge..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs placeholder-slate-400"
                  />
                </div>
                <span className="text-xs text-slate-500">Round {currentRound.roundNumber} Draw • {releasedDebates.length} Matches</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDraw.map((match, idx) => (
                  <div key={match.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Room: {match.room.name}
                      </span>
                      <span className="text-slate-400">Match #{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-blue-900">Proposition</div>
                        <div className="text-xs font-bold text-slate-900 truncate">{match.governmentTeam.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{match.governmentTeam.institutionName}</div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-amber-800">Opposition</div>
                        <div className="text-xs font-bold text-slate-900 truncate">{match.oppositionTeam.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{match.oppositionTeam.institutionName}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                      <span>Chair: <strong className="text-slate-800">{match.chairJudge?.name || 'Assigned'}</strong></span>
                      <span className="text-slate-400">{match.room.building}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Public Motions Archive */}
      {activeTab === 'MOTIONS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {releasedMotions.map((motion) => (
              <div key={motion.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    Round {motion.assignedRoundNumber}
                  </span>
                  <span className="text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {motion.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                  "{motion.text}"
                </h3>

                {motion.infoSlide && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 italic">
                    <strong className="not-italic text-slate-500 block text-[10px] uppercase font-mono">Info Slide:</strong>
                    {motion.infoSlide}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Public Standings View */}
      {activeTab === 'STANDINGS' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">Live Preliminary Team Standings</h3>
            <p className="text-xs text-slate-500">Wins, Losses, and Total Speaker Scores</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4 text-center">Wins - Losses</th>
                  <th className="py-3 px-4 text-right font-mono">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tournament.teams.map((team, idx) => (
                  <tr key={team.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{team.name}</td>
                    <td className="py-3 px-4 text-slate-600">{team.institutionName}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">{team.wins}W - {team.losses}L</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{team.totalSpeakerScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Public Elimination Bracket */}
      {activeTab === 'BRACKET' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              <span>Championship Elimination Break (Top {tournament.settings.breakSize})</span>
            </h3>
            <p className="text-xs text-slate-500">Quarterfinals, Semifinals, and Grand Final bracket projection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* QF */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center pb-2 border-b border-slate-200">
                Quarterfinals
              </h4>
              {[
                { seedA: topQualifiers[0], seedB: topQualifiers[7], num: 1 },
                { seedA: topQualifiers[3], seedB: topQualifiers[4], num: 2 },
                { seedA: topQualifiers[1], seedB: topQualifiers[6], num: 3 },
                { seedA: topQualifiers[2], seedB: topQualifiers[5], num: 4 }
              ].map((m, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="text-blue-900">#{m.seedA?.seed || '1'} {m.seedA?.teamName || 'TBD'}</span>
                    <span className="font-mono text-emerald-700">{m.seedA?.wins}W</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>#{m.seedB?.seed || '8'} {m.seedB?.teamName || 'TBD'}</span>
                    <span className="font-mono text-slate-400">{m.seedB?.wins}W</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SF */}
            <div className="space-y-3 flex flex-col justify-around">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center pb-2 border-b border-slate-200">
                Semifinals
              </h4>
              <div className="bg-slate-50 p-4 rounded-lg border border-blue-200 text-xs space-y-2">
                <div className="text-[10px] font-bold uppercase text-blue-900">Semifinal 1</div>
                <div className="font-bold text-slate-900">Winner QF 1 vs Winner QF 2</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-blue-200 text-xs space-y-2">
                <div className="text-[10px] font-bold uppercase text-blue-900">Semifinal 2</div>
                <div className="font-bold text-slate-900">Winner QF 3 vs Winner QF 4</div>
              </div>
            </div>

            {/* Grand Final */}
            <div className="space-y-3 flex flex-col justify-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 text-center pb-2 border-b border-slate-200">
                Grand Final
              </h4>
              <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-200 text-center space-y-2">
                <Trophy className="h-6 w-6 text-amber-600 mx-auto" />
                <h5 className="text-xs font-bold text-slate-900">Championship Grand Final</h5>
                <p className="text-[11px] text-slate-500">Auditorium Main Stage</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Public Announcements */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-4">
          {tournament.announcements.map((ann) => (
            <div key={ann.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Posted by {ann.authorName}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
