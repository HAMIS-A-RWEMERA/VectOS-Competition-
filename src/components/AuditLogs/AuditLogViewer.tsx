import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  User, 
  Clock,
  Download
} from 'lucide-react';
import { Tournament, AuditLogEntry } from '../../types/competition';

interface AuditLogViewerProps {
  tournament: Tournament;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  tournament
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredLogs = (tournament.auditLogs || []).filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.newValue && log.newValue.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleExportAuditLogs = () => {
    const headers = ['Timestamp', 'Actor Name', 'Role', 'Action', 'Entity', 'Severity', 'Old Value', 'New Value', 'Reason / Justification'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      `"${l.actorName}"`,
      l.actorRole,
      l.action,
      l.entityType,
      l.severity,
      `"${l.oldValue || ''}"`,
      `"${l.newValue || ''}"`,
      `"${l.reason || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tournament.slug}_audit_trail.csv`);
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
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
              Immutable Governance Trail
            </span>
            <span className="text-xs text-slate-500 font-mono">Zero Silent Modifications Policy</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Tournament Audit Logs & Change History
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive, cryptographically verifiable log of all draw generations, judge allocations, ballot entries, and Tab score overrides.
          </p>
        </div>

        <button
          onClick={handleExportAuditLogs}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Audit Trail CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actions, actors, reasons..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white text-slate-700 text-xs font-medium rounded-xl border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning (Overrides)</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-32">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details & Changes</th>
                <th className="py-3 px-4">Justification Reason</th>
                <th className="py-3 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{log.actorName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.actorRole}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-900">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4">
                      {log.newValue && (
                        <div className="text-slate-900 font-medium">{log.newValue}</div>
                      )}
                      {log.oldValue && (
                        <div className="text-[11px] text-slate-400 font-mono line-through">
                          Prev: {log.oldValue}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {log.reason ? (
                        <span className="italic text-amber-800 font-medium">{log.reason}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
