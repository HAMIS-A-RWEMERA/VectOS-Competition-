import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Tournament, Announcement } from '../../types/competition';

interface AnnouncementsManagerProps {
  tournament: Tournament;
  onPostAnnouncement: (title: string, content: string, priority: 'NORMAL' | 'HIGH' | 'URGENT', targetAudience: string) => void;
  isActionLoading: boolean;
}

export const AnnouncementsManager: React.FC<AnnouncementsManagerProps> = ({
  tournament,
  onPostAnnouncement,
  isActionLoading
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [targetAudience, setTargetAudience] = useState<string>('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onPostAnnouncement(title, content, priority, targetAudience);
    setTitle('');
    setContent('');
    setPriority('NORMAL');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Live Broadcast Center
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-Time Tournament Notifications</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Announcements & Public Alerts
          </h2>
          <p className="text-xs text-slate-500">
            Publish official announcements, schedule adjustments, emergency notices, or roll-call alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Post Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-900" />
            <span>Broadcast New Announcement</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline / Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Round 4 Motion Released — Prep Commenced"
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs placeholder-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience:</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              >
                <option value="ALL">All Participants & Spectators</option>
                <option value="DEBATERS">Debaters Only</option>
                <option value="JUDGES">Adjudicators Only</option>
                <option value="STAFF">Tournament Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              >
                <option value="NORMAL">Normal Notice</option>
                <option value="HIGH">High Priority (Urgent)</option>
                <option value="URGENT">Critical Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Body:</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Details of the announcement..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs placeholder-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isActionLoading}
              className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>

        {/* Existing Announcements Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-900" />
            <span>Active Broadcasts ({tournament.announcements.length})</span>
          </h3>

          <div className="space-y-3">
            {tournament.announcements.map((ann) => (
              <div
                key={ann.id}
                className={`bg-white border rounded-xl p-5 space-y-2 shadow-xs ${
                  ann.priority === 'URGENT'
                    ? 'border-rose-200 bg-rose-50/20'
                    : ann.priority === 'HIGH'
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ann.priority === 'URGENT'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : ann.priority === 'HIGH'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {ann.priority}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Author: <strong className="text-slate-700">{ann.authorName}</strong></span>
                  <span>Target: <strong className="text-blue-900">{ann.targetAudience}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
