import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Layers, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';
import { CompetitionFormatType } from '../../types/competition';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTournament: (data: any) => void;
  isActionLoading: boolean;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  onCreateTournament,
  isActionLoading
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('Rwanda National Schools Debate Championship 2026');
  const [orgName, setOrgName] = useState<string>('Aspire Debate Rwanda');
  const [format, setFormat] = useState<CompetitionFormatType>('WSDC');
  const [venue, setVenue] = useState<string>('Kigali Convention Centre');
  const [city, setCity] = useState<string>('Kigali');
  const [country, setCountry] = useState<string>('Rwanda');
  const [prelimCount, setPrelimCount] = useState<number>(5);
  const [breakSize, setBreakSize] = useState<number>(8);
  const [description, setDescription] = useState<string>('The premier national championship bringing together top schools across Rwanda.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTournament({
      name,
      organizationName: orgName,
      format,
      venue,
      city,
      country,
      description,
      prelimRoundsCount: prelimCount,
      breakSize
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Tournament Provisioning Wizard</span>
            <h2 className="text-lg font-bold text-slate-900">Create New Tournament</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tournament Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs placeholder-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hosting Organization:</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Competition Format:</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              >
                <option value="WSDC">WSDC (World Schools - 3v3)</option>
                <option value="BP">BP (British Parliamentary - 4 teams)</option>
                <option value="AP">AP (Asian Parliamentary - 3v3)</option>
                <option value="POLICY">Policy Debate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Venue:</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country:</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preliminary Rounds:</label>
              <select
                value={prelimCount}
                onChange={(e) => setPrelimCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              >
                <option value={4}>4 Preliminary Rounds</option>
                <option value={5}>5 Preliminary Rounds</option>
                <option value={6}>6 Preliminary Rounds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Break Elimination Size:</label>
              <select
                value={breakSize}
                onChange={(e) => setBreakSize(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs"
              >
                <option value={4}>Top 4 (Semifinals)</option>
                <option value={8}>Top 8 (Quarterfinals)</option>
                <option value={16}>Top 16 (Octofinals)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs placeholder-slate-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isActionLoading}
              className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Initialize Tournament</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
