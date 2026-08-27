import React, { useState, useEffect } from 'react';
import { NavigationHeader } from './components/NavigationHeader';
import { TournamentDashboard } from './components/TournamentDashboard';
import { PairingStudio } from './components/TabRoom/PairingStudio';
import { JudgeAllocationStudio } from './components/TabRoom/JudgeAllocationStudio';
import { BallotMonitor } from './components/TabRoom/BallotMonitor';
import { StandingsView } from './components/StandingsTab/StandingsView';
import { BreakStudio } from './components/StandingsTab/BreakStudio';
import { ParticipantManager } from './components/ParticipantHub/ParticipantManager';
import { MotionsManager } from './components/MotionsHub/MotionsManager';
import { AnnouncementsManager } from './components/Announcements/AnnouncementsManager';
import { AuditLogViewer } from './components/AuditLogs/AuditLogViewer';
import { JudgeBallotForm } from './components/DigitalBallot/JudgeBallotForm';
import { PublicTournamentView } from './components/PublicPortal/PublicTournamentView';
import { HealthDiagnosisModal } from './components/HealthDiagnosisModal';
import { CreateTournamentModal } from './components/TournamentWizard/CreateTournamentModal';
import { createInitialSeedTournament } from './data/seedTournament';
import { 
  recalculateTournamentStandings, 
  evaluateTournamentHealth, 
  calculateBreakAdvancement,
  generatePairings,
  allocateJudgesToDebates
} from './lib/tournamentEngine';
import { Tournament, UserRole, TournamentHealth, BreakQualifier, Ballot, CheckInStatus } from './types/competition';

export default function App() {
  const [tournament, setTournament] = useState<Tournament>(() => createInitialSeedTournament());
  const [currentRole, setCurrentRole] = useState<UserRole>('TOURNAMENT_DIRECTOR');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isHealthModalOpen, setIsHealthModalOpen] = useState<boolean>(false);
  const [isNewTournModalOpen, setIsNewTournModalOpen] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Derived state calculations
  const { updatedTeams, speakerStandings } = recalculateTournamentStandings(tournament);
  const health: TournamentHealth = evaluateTournamentHealth(tournament);
  const breakAdvancement: BreakQualifier[] = calculateBreakAdvancement(tournament.teams, tournament.settings.breakSize || 8);

  // Fetch from server on load if running with server
  useEffect(() => {
    fetchTournament();
  }, []);

  const fetchTournament = async () => {
    try {
      const res = await fetch(`/api/tournaments/${tournament.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tournament) {
          setTournament(data.tournament);
        }
      }
    } catch (err) {
      // In standalone client preview mode, local state continues smoothly
    }
  };

  // Helper to log audit event
  const logAudit = (action: string, entityType: any, entityId: string, details: any) => {
    const newEntry = {
      id: `audit-${Date.now()}`,
      tournamentId: tournament.id,
      actorName: currentRole === 'TOURNAMENT_DIRECTOR' ? 'Tournament Director' : currentRole === 'TAB_DIRECTOR' ? 'Tab Director' : currentRole === 'ADJ_CORE' ? 'Adjudication Core' : 'Staff',
      actorRole: currentRole,
      action,
      entityType,
      entityId,
      oldValue: details.oldValue,
      newValue: details.newValue,
      reason: details.reason,
      timestamp: new Date().toISOString(),
      severity: details.severity || 'INFO'
    };
    return [newEntry, ...tournament.auditLogs];
  };

  // 1. Generate Draw
  const handleGenerateDraw = async (roundNumber: number) => {
    setIsActionLoading(true);
    try {
      const targetRound = tournament.rounds.find(r => r.roundNumber === roundNumber);
      if (!targetRound) return;

      const previousRounds = tournament.rounds.filter(r => r.roundNumber < targetRound.roundNumber);
      const { debates, warnings } = generatePairings(tournament.teams, tournament.rooms, previousRounds, targetRound.roundNumber);

      const motion = tournament.motions.find(m => m.assignedRoundNumber === targetRound.roundNumber);
      if (motion) {
        targetRound.motion = motion;
        debates.forEach(d => { d.motion = motion; });
      }

      const updatedRounds = tournament.rounds.map(r => {
        if (r.roundNumber === roundNumber) {
          return {
            ...r,
            debates,
            status: 'PREPARING' as any,
            ballotsCount: debates.length
          };
        }
        return r;
      });

      const updatedLogs = logAudit('GENERATED_ROUND_PAIRINGS', 'DRAW', targetRound.id, {
        newValue: `Generated ${debates.length} debates with Swiss power-pairing for ${targetRound.name}.`,
        reason: warnings.length > 0 ? warnings.join('; ') : 'Standard Swiss bracket pairing'
      });

      setTournament(prev => ({
        ...prev,
        rounds: updatedRounds,
        auditLogs: updatedLogs
      }));

      // Sync with server API
      await fetch(`/api/tournaments/${tournament.id}/pairings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundNumber, actorName: 'Tab Director', actorRole: currentRole })
      }).catch(() => {});

    } finally {
      setIsActionLoading(false);
    }
  };

  // 2. Auto-Allocate Judges
  const handleAllocateJudges = async (roundNumber: number) => {
    setIsActionLoading(true);
    try {
      const targetRound = tournament.rounds.find(r => r.roundNumber === roundNumber);
      if (!targetRound || !targetRound.debates || targetRound.debates.length === 0) return;

      const previousRounds = tournament.rounds.filter(r => r.roundNumber < targetRound.roundNumber);
      const { allocatedDebates, qualityReport } = allocateJudgesToDebates(targetRound.debates, tournament.judges, previousRounds);

      const updatedRounds = tournament.rounds.map(r => {
        if (r.roundNumber === roundNumber) {
          return {
            ...r,
            debates: allocatedDebates,
            status: 'READY' as any
          };
        }
        return r;
      });

      const updatedLogs = logAudit('ALLOCATED_PANEL_JUDGES', 'JUDGE_ALLOCATION', targetRound.id, {
        newValue: `Allocated judges for ${allocatedDebates.length} debates. (${qualityReport.optimalCount} optimal, ${qualityReport.exceptionCount} with notices).`,
        reason: qualityReport.exceptions.join('; ')
      });

      setTournament(prev => ({
        ...prev,
        rounds: updatedRounds,
        auditLogs: updatedLogs
      }));

      // Sync with server API
      await fetch(`/api/tournaments/${tournament.id}/judge-allocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundNumber, actorName: 'Adjudication Core', actorRole: currentRole })
      }).catch(() => {});

    } finally {
      setIsActionLoading(false);
    }
  };

  // 3. Toggle Release Draw
  const handleToggleReleaseDraw = async (roundNumber: number, current: boolean) => {
    setIsActionLoading(true);
    try {
      const updatedRounds = tournament.rounds.map(r => {
        if (r.roundNumber === roundNumber) {
          return { ...r, drawReleased: !current };
        }
        return r;
      });

      const updatedLogs = logAudit('TOGGLED_DRAW_PUBLICATION', 'DRAW', `round-${roundNumber}`, {
        oldValue: `Published: ${current}`,
        newValue: `Published: ${!current}`
      });

      setTournament(prev => ({ ...prev, rounds: updatedRounds, auditLogs: updatedLogs }));

      await fetch(`/api/tournaments/${tournament.id}/rounds/${roundNumber}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawReleased: !current, actorName: 'Tab Director', actorRole: currentRole })
      }).catch(() => {});
    } finally {
      setIsActionLoading(false);
    }
  };

  // 4. Toggle Release Motion
  const handleToggleReleaseMotion = async (roundNumber: number, current: boolean) => {
    setIsActionLoading(true);
    try {
      const updatedRounds = tournament.rounds.map(r => {
        if (r.roundNumber === roundNumber) {
          return {
            ...r,
            motionReleased: !current,
            motion: r.motion ? { ...r.motion, isReleased: !current } : undefined
          };
        }
        return r;
      });

      const updatedMotions = tournament.motions.map(m => {
        if (m.assignedRoundNumber === roundNumber) {
          return { ...m, isReleased: !current };
        }
        return m;
      });

      const updatedLogs = logAudit('TOGGLED_MOTION_EMBARGO', 'ROUND', `round-${roundNumber}`, {
        oldValue: `Released: ${current}`,
        newValue: `Released: ${!current}`
      });

      setTournament(prev => ({
        ...prev,
        rounds: updatedRounds,
        motions: updatedMotions,
        auditLogs: updatedLogs
      }));

      await fetch(`/api/tournaments/${tournament.id}/rounds/${roundNumber}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motionReleased: !current, actorName: 'Adjudication Core', actorRole: currentRole })
      }).catch(() => {});
    } finally {
      setIsActionLoading(false);
    }
  };

  // 5. Submit Ballot
  const handleSubmitBallot = async (debateId: string, ballot: Ballot) => {
    setIsActionLoading(true);
    try {
      let updatedDebateMatch: any = null;

      const updatedRounds = tournament.rounds.map(r => {
        const matchIdx = r.debates.findIndex(d => d.id === debateId);
        if (matchIdx >= 0) {
          const match = r.debates[matchIdx];
          const bIdx = match.ballots.findIndex(b => b.id === ballot.id || b.judgeId === ballot.judgeId);
          const newBallots = [...match.ballots];
          if (bIdx >= 0) newBallots[bIdx] = ballot;
          else newBallots.push(ballot);

          updatedDebateMatch = {
            ...match,
            ballots: newBallots,
            status: 'BALLOTS_SUBMITTED' as any,
            winnerTeamId: ballot.winnerTeamId
          };

          const newDebates = [...r.debates];
          newDebates[matchIdx] = updatedDebateMatch;
          return {
            ...r,
            debates: newDebates,
            submittedBallotsCount: newDebates.filter(d => d.ballots.some(b => b.status === 'SUBMITTED' || b.status === 'VERIFIED')).length
          };
        }
        return r;
      });

      const updatedLogs = logAudit('SUBMITTED_DIGITAL_BALLOT', 'BALLOT', ballot.id, {
        newValue: `Ballot submitted for ${debateId}. Winner: ${ballot.winnerSide} (Gov: ${ballot.totalPropScore}, Opp: ${ballot.totalOppScore})`
      });

      setTournament(prev => ({
        ...prev,
        rounds: updatedRounds,
        auditLogs: updatedLogs
      }));

      await fetch(`/api/tournaments/${tournament.id}/ballots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debateId, ballot, actorName: 'Adjudicator / Tab Entry', actorRole: currentRole })
      }).catch(() => {});
    } finally {
      setIsActionLoading(false);
    }
  };

  // 6. Tab Score Correction
  const handleCorrectBallot = async (ballotId: string, field: string, oldValue: any, newValue: any, reason: string) => {
    setIsActionLoading(true);
    try {
      const updatedRounds = tournament.rounds.map(r => {
        return {
          ...r,
          debates: r.debates.map(d => {
            const bIdx = d.ballots.findIndex(b => b.id === ballotId);
            if (bIdx >= 0) {
              const b = d.ballots[bIdx];
              const updatedB: Ballot = {
                ...b,
                status: 'CORRECTED',
                corrections: [
                  ...(b.corrections || []),
                  {
                    id: `corr-${Date.now()}`,
                    field,
                    oldValue,
                    newValue,
                    reason,
                    correctedBy: 'Tab Director',
                    timestamp: new Date().toISOString()
                  }
                ]
              };
              const newBallots = [...d.ballots];
              newBallots[bIdx] = updatedB;
              return { ...d, ballots: newBallots };
            }
            return d;
          })
        };
      });

      const updatedLogs = logAudit('CORRECTED_BALLOT_SCORE', 'BALLOT', ballotId, {
        oldValue: `${field}: ${oldValue}`,
        newValue: `${field}: ${newValue}`,
        reason,
        severity: 'WARNING'
      });

      setTournament(prev => ({
        ...prev,
        rounds: updatedRounds,
        auditLogs: updatedLogs
      }));

      await fetch(`/api/tournaments/${tournament.id}/ballot-corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ballotId, field, oldValue, newValue, reason, actorName: 'Tab Director' })
      }).catch(() => {});
    } finally {
      setIsActionLoading(false);
    }
  };

  // 7. Check-In Toggle
  const handleUpdateCheckIn = async (targetType: 'TEAM' | 'JUDGE', targetId: string, status: CheckInStatus) => {
    if (targetType === 'TEAM') {
      const updatedTeams = tournament.teams.map(t => t.id === targetId ? { ...t, status } : t);
      const updatedLogs = logAudit('UPDATED_TEAM_CHECKIN', 'REGISTRATION', targetId, {
        newValue: `Team ${targetId} status updated to ${status}`
      });
      setTournament(prev => ({ ...prev, teams: updatedTeams, auditLogs: updatedLogs }));
    } else {
      const updatedJudges = tournament.judges.map(j => j.id === targetId ? { ...j, status } : j);
      const updatedLogs = logAudit('UPDATED_JUDGE_CHECKIN', 'REGISTRATION', targetId, {
        newValue: `Judge ${targetId} status updated to ${status}`
      });
      setTournament(prev => ({ ...prev, judges: updatedJudges, auditLogs: updatedLogs }));
    }

    await fetch(`/api/tournaments/${tournament.id}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType, targetId, status, actorName: 'Registration Officer' })
    }).catch(() => {});
  };

  // 8. Post Announcement
  const handlePostAnnouncement = async (title: string, content: string, priority: 'NORMAL' | 'HIGH' | 'URGENT', targetAudience: string) => {
    setIsActionLoading(true);
    try {
      const newAnn = {
        id: `ann-${Date.now()}`,
        tournamentId: tournament.id,
        title,
        content,
        priority,
        targetAudience: targetAudience as any,
        createdAt: new Date().toISOString(),
        authorName: currentRole === 'TOURNAMENT_DIRECTOR' ? 'Tournament Director' : 'Tab Director'
      };

      const updatedLogs = logAudit('PUBLISHED_ANNOUNCEMENT', 'ROUND', newAnn.id, {
        newValue: `Announcement: "${title}" broadcast to ${targetAudience}`
      });

      setTournament(prev => ({
        ...prev,
        announcements: [newAnn, ...prev.announcements],
        auditLogs: updatedLogs
      }));

      await fetch(`/api/tournaments/${tournament.id}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, priority, targetAudience, authorName: 'Tournament Director' })
      }).catch(() => {});
    } finally {
      setIsActionLoading(false);
    }
  };

  // 9. Reset Demo Seed
  const handleResetSeed = async () => {
    setIsResetting(true);
    try {
      const fresh = createInitialSeedTournament();
      setTournament(fresh);
      await fetch('/api/tournaments/reset-seed', { method: 'POST' }).catch(() => {});
    } finally {
      setIsResetting(false);
    }
  };

  // 10. Create New Tournament
  const handleCreateTournament = async (data: any) => {
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const payload = await res.json();
        setTournament(payload.tournament);
        setIsNewTournModalOpen(false);
        setActiveTab('dashboard');
      }
    } catch (err) {
      // Fallback local create
      setIsNewTournModalOpen(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Universal Top Navigation & Role Switcher */}
      <NavigationHeader
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        tournament={tournament}
        health={health}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
        onOpenNewTournamentModal={() => setIsNewTournModalOpen(true)}
        onResetSeed={handleResetSeed}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        isResetting={isResetting}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Role-Based Rendering */}
        {currentRole === 'JUDGE' ? (
          <JudgeBallotForm
            tournament={tournament}
            onSubmitBallot={handleSubmitBallot}
            isActionLoading={isActionLoading}
          />
        ) : currentRole === 'PUBLIC_VIEWER' ? (
          <PublicTournamentView
            tournament={tournament}
            speakerStandings={speakerStandings}
            breakAdvancement={breakAdvancement}
          />
        ) : (
          /* Staff Views */
          <div>
            {activeTab === 'dashboard' && (
              <TournamentDashboard
                tournament={tournament}
                health={health}
                onNavigateTab={(t) => setActiveTab(t)}
                onGenerateDraw={handleGenerateDraw}
                onAllocateJudges={handleAllocateJudges}
                onToggleReleaseDraw={handleToggleReleaseDraw}
                onToggleReleaseMotion={handleToggleReleaseMotion}
                isActionLoading={isActionLoading}
              />
            )}

            {activeTab === 'pairings' && (
              <PairingStudio
                tournament={tournament}
                onGenerateDraw={handleGenerateDraw}
                onToggleReleaseDraw={handleToggleReleaseDraw}
                isActionLoading={isActionLoading}
              />
            )}

            {activeTab === 'judges' && (
              <JudgeAllocationStudio
                tournament={tournament}
                onAllocateJudges={handleAllocateJudges}
                isActionLoading={isActionLoading}
              />
            )}

            {activeTab === 'ballots' && (
              <BallotMonitor
                tournament={tournament}
                onSubmitBallot={handleSubmitBallot}
                onCorrectBallot={handleCorrectBallot}
                isActionLoading={isActionLoading}
              />
            )}

            {activeTab === 'standings' && (
              <StandingsView
                tournament={tournament}
                speakerStandings={speakerStandings}
              />
            )}

            {activeTab === 'break' && (
              <BreakStudio
                tournament={tournament}
                breakAdvancement={breakAdvancement}
              />
            )}

            {activeTab === 'participants' && (
              <ParticipantManager
                tournament={tournament}
                onUpdateCheckIn={handleUpdateCheckIn}
              />
            )}

            {activeTab === 'motions' && (
              <MotionsManager
                tournament={tournament}
                onToggleReleaseMotion={handleToggleReleaseMotion}
                isActionLoading={isActionLoading}
              />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsManager
                tournament={tournament}
                onPostAnnouncement={handlePostAnnouncement}
                isActionLoading={isActionLoading}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLogViewer
                tournament={tournament}
              />
            )}
          </div>
        )}

      </main>

      {/* Health Diagnostics Modal */}
      <HealthDiagnosisModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        health={health}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setCurrentRole('TOURNAMENT_DIRECTOR');
        }}
      />

      {/* Create New Tournament Modal */}
      <CreateTournamentModal
        isOpen={isNewTournModalOpen}
        onClose={() => setIsNewTournModalOpen(false)}
        onCreateTournament={handleCreateTournament}
        isActionLoading={isActionLoading}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p className="font-medium">VectOS Competition Engine • Clean Operational Tournament Infrastructure</p>
      </footer>

    </div>
  );
}
