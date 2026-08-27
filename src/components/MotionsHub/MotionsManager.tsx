import React, { useState } from 'react';
import { 
  BookOpen, 
  Lock, 
  Unlock, 
  Share2, 
  Tag, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Tournament, Motion } from '../../types/competition';

interface MotionsManagerProps {
  tournament: Tournament;
  onToggleReleaseMotion: (roundNumber: number, current: boolean) => void;
  isActionLoading: boolean;
}

export const MotionsManager: React.FC<MotionsManagerProps> = ({
  tournament,
  onToggleReleaseMotion,
  isActionLoading
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Geopolitics & Governance', 'Economy & Trade', 'Education & Society', 'Technology & AI', 'Environment & Resources'];

  const filteredMotions = tournament.motions.filter(m => {
    return selectedCategory === 'ALL' || m.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Adjudication Core Motion Vault
            </span>
            <span className="text-xs text-slate-500 font-mono">Confidential Motion Bank & Info Slides</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Tournament Motion Vault & Release Controls
          </h2>
          <p className="text-xs text-slate-500">
            Secure embargoed motions, contextual info slides, and synchronize live motion announcements to all teams.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Motions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMotions.map((motion) => {
          const isAssigned = !!motion.assignedRoundNumber;
          return (
            <div
              key={motion.id}
              className={`bg-white border rounded-xl p-5 space-y-4 shadow-xs transition ${
                motion.isReleased
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {isAssigned ? `Round ${motion.assignedRoundNumber}` : 'Reserve Bank'}
                  </span>
                  <span className="text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {motion.category}
                  </span>
                </div>

                {motion.isReleased ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    <Unlock className="h-3 w-3 text-emerald-600" /> Released to Debaters
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <Lock className="h-3 w-3 text-amber-600" /> Embargoed (Confidential)
                  </span>
                )}
              </div>

              {/* Motion Text */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                  {motion.text}
                </h4>
              </div>

              {/* Info Slide if present */}
              {motion.infoSlide && (
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Context / Info Slide:</span>
                  <p className="text-slate-700 leading-relaxed italic">{motion.infoSlide}</p>
                </div>
              )}

              {/* Release Toggle for Assigned Rounds */}
              {isAssigned && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Prep Time: <strong className="text-slate-700">{motion.prepTimeMinutes || 15} mins</strong>
                  </span>

                  <button
                    onClick={() => onToggleReleaseMotion(motion.assignedRoundNumber!, motion.isReleased)}
                    disabled={isActionLoading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      motion.isReleased
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 shadow-xs'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {motion.isReleased ? (
                      <>
                        <Lock className="h-3.5 w-3.5 text-amber-700" />
                        <span>Embargo Motion</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3.5 w-3.5" />
                        <span>Release Motion Now</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
