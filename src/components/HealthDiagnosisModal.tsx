import React from 'react';
import { X, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { TournamentHealth } from '../types/competition';

interface HealthDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: TournamentHealth;
  onNavigateTab: (tabId: string) => void;
}

export const HealthDiagnosisModal: React.FC<HealthDiagnosisModalProps> = ({
  isOpen,
  onClose,
  health,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-lg border ${
            health.status === 'GREEN'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : health.status === 'YELLOW'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {health.status === 'GREEN' ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tournament Health Diagnostics</h3>
            <p className="text-xs text-slate-500">{health.headline}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {health.issues.map((issue, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 ${
                issue.level === 'ERROR'
                  ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                  : issue.level === 'WARNING'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {issue.level === 'ERROR' ? (
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                ) : issue.level === 'WARNING' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                )}
                <span className="text-xs leading-relaxed">{issue.message}</span>
              </div>

              {issue.actionKey && (
                <button
                  onClick={() => {
                    onNavigateTab(issue.actionKey === 'tab_ballots' ? 'ballots' : issue.actionKey === 'tab_judges' ? 'judges' : 'motions');
                    onClose();
                  }}
                  className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-blue-900 hover:text-blue-950 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition"
                >
                  <span>{issue.actionLabel || 'Fix'}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
