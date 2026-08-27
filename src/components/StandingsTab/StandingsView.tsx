import React, { useState } from 'react';
import { 
  Trophy, 
  Download, 
  Search, 
  Filter, 
  Users, 
  UserCheck, 
  TrendingUp,
  Award,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Tournament, Team } from '../../types/competition';

interface StandingsViewProps {
  tournament: Tournament;
  speakerStandings: any[];
}

export const StandingsView: React.FC<StandingsViewProps> = ({
  tournament,
  speakerStandings
}) => {
  const [activeTab, setActiveTab] = useState<'TEAMS' | 'SPEAKERS'>('TEAMS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filtered Teams
  const filteredTeams = tournament.teams
    .filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.totalSpeakerScore !== a.totalSpeakerScore) return b.totalSpeakerScore - a.totalSpeakerScore;
      return b.netMargin - a.netMargin;
    });

  // Filtered Speakers
  const filteredSpeakers = speakerStandings
    .filter(s => {
      const matchesSearch = s.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'ALL' || s.category === categoryFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
      return b.totalScore - a.totalScore;
    });

  // Export CSV
  const handleExportCSV = () => {
    if (activeTab === 'TEAMS') {
      const headers = ['Rank', 'Team Name', 'Code', 'Institution', 'Category', 'Wins', 'Losses', 'Total Points', 'Net Margin', 'Gov Count', 'Opp Count'];
      const rows = filteredTeams.map((t, idx) => [
        idx + 1,
        `"${t.name}"`,
        t.code,
        `"${t.institutionName}"`,
        t.category,
        t.wins,
        t.losses,
        t.totalSpeakerScore,
        t.netMargin,
        t.govCount,
        t.oppCount
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${tournament.slug}_team_standings.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['Rank', 'Speaker Name', 'Team Name', 'Institution', 'Category', 'Rounds Spoken', 'Total Points', 'Average Score'];
      const rows = filteredSpeakers.map((s, idx) => [
        idx + 1,
        `"${s.speakerName}"`,
        `"${s.teamName}"`,
        `"${s.institutionName}"`,
        s.category,
        s.roundsCount,
        s.totalScore,
        s.averageScore
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${tournament.slug}_speaker_standings.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Official Tabulations
            </span>
            <span className="text-xs text-slate-500 font-mono">Formula: Wins &gt; Total Speaker Points &gt; Net Margin</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Tournament Standings & Speaker Tab
          </h2>
          <p className="text-xs text-slate-500">
            Real-time cumulative team and individual speaker rankings after verified ballots.
          </p>
        </div>

        {/* Export & Switch Buttons */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex">
            <button
              onClick={() => setActiveTab('TEAMS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'TEAMS'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Team Tab ({tournament.teams.length})
            </button>
            <button
              onClick={() => setActiveTab('SPEAKERS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'SPEAKERS'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Speaker Tab ({speakerStandings.length})
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition flex items-center gap-1.5"
            title="Download CSV for official records"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'TEAMS' ? 'Search teams, institutions, codes...' : 'Search speaker names...'}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white text-slate-700 text-xs font-medium rounded-xl border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          >
            <option value="ALL">All Categories</option>
            <option value="OPEN">Open Category</option>
            <option value="NOVICE">Novice Category</option>
            <option value="ESL">ESL Category</option>
          </select>
        </div>
      </div>

      {/* Standings Table */}
      {activeTab === 'TEAMS' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Team & Code</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Wins</th>
                  <th className="py-3 px-4 text-center">Losses</th>
                  <th className="py-3 px-4 text-right font-mono">Total Points</th>
                  <th className="py-3 px-4 text-right font-mono">Net Margin</th>
                  <th className="py-3 px-4 text-center">Side History</th>
                  <th className="py-3 px-4 text-center">Break Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTeams.map((team, idx) => {
                  const isTopBreak = idx < (tournament.settings.breakSize || 8);
                  return (
                    <tr 
                      key={team.id} 
                      className={`hover:bg-slate-50/60 transition ${isTopBreak ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="py-3 px-4 text-center font-bold font-mono">
                        {idx === 0 ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300">1</span>
                        ) : idx === 1 ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 text-slate-700 border border-slate-300">2</span>
                        ) : idx === 2 ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200">3</span>
                        ) : (
                          <span className="text-slate-500">{idx + 1}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{team.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{team.code}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-600">{team.institutionName}</td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          team.category === 'NOVICE' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {team.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">{team.wins}</td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">{team.losses}</td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{team.totalSpeakerScore}</td>
                      
                      <td className="py-3 px-4 text-right font-mono">
                        <span className={team.netMargin >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                          {team.netMargin > 0 ? `+${team.netMargin}` : team.netMargin}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center text-[11px] text-slate-500">
                        <span className="text-blue-900 font-mono">{team.govCount}G</span>
                        <span className="mx-1">/</span>
                        <span className="text-amber-700 font-mono">{team.oppCount}O</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isTopBreak ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            <Trophy className="h-3 w-3 text-amber-500" /> Break #{idx + 1}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Speaker Name</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Rounds Spoken</th>
                  <th className="py-3 px-4 text-right font-mono">Total Points</th>
                  <th className="py-3 px-4 text-right font-mono">Average Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSpeakers.map((spk, idx) => (
                  <tr key={spk.speakerId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 text-center font-bold font-mono">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300">1</span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 text-slate-700 border border-slate-300">2</span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200">3</span>
                      ) : (
                        <span className="text-slate-500">{idx + 1}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">{spk.speakerName}</td>
                    <td className="py-3 px-4 text-slate-700">{spk.teamName}</td>
                    <td className="py-3 px-4 text-slate-500">{spk.institutionName}</td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        spk.category === 'NOVICE' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {spk.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-slate-700">{spk.roundsCount}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">{spk.totalScore}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-cyan-800">{spk.averageScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
