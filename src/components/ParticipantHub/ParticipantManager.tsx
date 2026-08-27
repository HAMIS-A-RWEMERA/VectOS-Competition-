import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  DoorOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Upload, 
  Plus, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { Tournament, Team, Judge, Room, CheckInStatus } from '../../types/competition';

interface ParticipantManagerProps {
  tournament: Tournament;
  onUpdateCheckIn: (targetType: 'TEAM' | 'JUDGE', targetId: string, status: CheckInStatus) => void;
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  tournament,
  onUpdateCheckIn
}) => {
  const [activeTab, setActiveTab] = useState<'TEAMS' | 'JUDGES' | 'ROOMS'>('TEAMS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTeams = tournament.teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredJudges = tournament.judges.filter(j => {
    const matchesSearch = j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportRoster = () => {
    const headers = ['Type', 'Name', 'Code/Role', 'Institution', 'Status', 'Details'];
    const rows = [
      ...tournament.teams.map(t => ['Team', `"${t.name}"`, t.code, `"${t.institutionName}"`, t.status, `"${t.speakers.map(s => s.name).join(', ')}"`]),
      ...tournament.judges.map(j => ['Judge', `"${j.name}"`, j.isChairAccredited ? 'Accredited Chair' : 'Panelist', `"${j.institutionName}"`, j.status, `Rating: ${j.rating}`])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tournament.slug}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Registration & Venue Operations
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-time Check-In Status Desk</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Participants, Adjudicators & Venue Hub
          </h2>
          <p className="text-xs text-slate-500">
            Manage team rosters, individual debater speaker allocations, judge conflict declarations, and room capacities.
          </p>
        </div>

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
              Teams ({tournament.teams.length})
            </button>
            <button
              onClick={() => setActiveTab('JUDGES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'JUDGES'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Judges ({tournament.judges.length})
            </button>
            <button
              onClick={() => setActiveTab('ROOMS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ROOMS'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rooms ({tournament.rooms.length})
            </button>
          </div>

          <button
            onClick={handleExportRoster}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition flex items-center gap-1.5"
            title="Download full registration roster"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Roster</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          />
        </div>

        {activeTab !== 'ROOMS' && (
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white text-slate-700 text-xs font-medium rounded-xl border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="REGISTERED">Registered (Pending Check-In)</option>
              <option value="LATE">Late</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        )}
      </div>

      {/* Teams Tab */}
      {activeTab === 'TEAMS' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Team Name & Code</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Debaters (Speakers 1-3)</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Check-In Status</th>
                  <th className="py-3 px-4 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{team.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{team.code}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{team.institutionName}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {team.speakers.map((spk, idx) => (
                          <span key={spk.id} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            {idx + 1}. {spk.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {team.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {team.status === 'CHECKED_IN' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Checked In
                        </span>
                      ) : team.status === 'LATE' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <Clock className="h-3 w-3 text-amber-600" /> Late
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Registered
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onUpdateCheckIn('TEAM', team.id, team.status === 'CHECKED_IN' ? 'REGISTERED' : 'CHECKED_IN')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                          team.status === 'CHECKED_IN'
                            ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {team.status === 'CHECKED_IN' ? 'Mark Pending' : 'Check In'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Judges Tab */}
      {activeTab === 'JUDGES' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Adjudicator Name</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Rating & Experience</th>
                  <th className="py-3 px-4">Chair Certification</th>
                  <th className="py-3 px-4">Declared Conflicts</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredJudges.map((judge) => (
                  <tr key={judge.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{judge.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{judge.institutionName}</td>
                    
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                          {judge.rating} / 10
                        </span>
                        <span className="text-[10px] text-slate-500">{judge.experienceLevel}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {judge.isChairAccredited ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <Award className="h-3 w-3 text-amber-600" /> Chair Accredited
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Panel Adjudicator</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {judge.conflicts && judge.conflicts.length > 0 ? (
                        <span className="text-[11px] text-rose-600 font-medium">{judge.conflicts.map(c => c.targetName).join(', ')}</span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None declared</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {judge.status === 'CHECKED_IN' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Registered
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onUpdateCheckIn('JUDGE', judge.id, judge.status === 'CHECKED_IN' ? 'REGISTERED' : 'CHECKED_IN')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                          judge.status === 'CHECKED_IN'
                            ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {judge.status === 'CHECKED_IN' ? 'Mark Pending' : 'Check In'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === 'ROOMS' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Room Name</th>
                  <th className="py-3 px-4">Building / Hall</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Accessibility</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tournament.rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{room.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{room.building}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{room.capacity} seats</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {room.isAccessible ? (
                        <span className="text-emerald-700 font-medium">Wheelchair Accessible</span>
                      ) : (
                        <span>Standard Access</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Active
                      </span>
                    </td>
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
