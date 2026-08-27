import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createInitialSeedTournament } from './src/data/seedTournament';
import {
  generatePairings,
  allocateJudgesToDebates,
  recalculateTournamentStandings,
  calculateBreakAdvancement,
  evaluateTournamentHealth
} from './src/lib/tournamentEngine';
import { Tournament, Round, Team, Judge, Ballot, AuditLogEntry, Announcement } from './src/types/competition';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory multi-tenant state storage initialized with authentic EAUDC 2026 tournament
const tournamentsStore: Map<string, Tournament> = new Map();
const initialSeed = createInitialSeedTournament();
tournamentsStore.set(initialSeed.id, initialSeed);

// Helper to log audit entries
function logAuditEvent(
  tournament: Tournament,
  actorName: string,
  actorRole: any,
  action: string,
  entityType: any,
  entityId: string,
  details: { oldValue?: string; newValue?: string; reason?: string; severity?: 'INFO' | 'WARNING' | 'CRITICAL' }
) {
  const auditEntry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tournamentId: tournament.id,
    actorName,
    actorRole,
    action,
    entityType,
    entityId,
    oldValue: details.oldValue,
    newValue: details.newValue,
    reason: details.reason,
    timestamp: new Date().toISOString(),
    severity: details.severity || 'INFO'
  };
  tournament.auditLogs.unshift(auditEntry);
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// List Tournaments
app.get('/api/tournaments', (req, res) => {
  const list = Array.from(tournamentsStore.values()).map(t => ({
    id: t.id,
    name: t.name,
    organizationName: t.organizationName,
    format: t.format,
    venue: t.venue,
    city: t.city,
    country: t.country,
    startDate: t.startDate,
    endDate: t.endDate,
    status: t.status,
    currentRoundNumber: t.currentRoundNumber,
    teamsCount: t.teams.length,
    judgesCount: t.judges.length,
    roundsCount: t.rounds.length
  }));
  res.json({ tournaments: list });
});

// Get Single Tournament with calculated standings and health
app.get('/api/tournaments/:id', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found' });
  }

  // Recalculate standings and health dynamically
  const { updatedTeams, speakerStandings } = recalculateTournamentStandings(tournament);
  tournament.teams = updatedTeams;
  const health = evaluateTournamentHealth(tournament);
  const breakAdvancement = calculateBreakAdvancement(tournament.teams, tournament.settings.breakSize || 8);

  res.json({
    tournament,
    speakerStandings,
    health,
    breakAdvancement
  });
});

// Create New Tournament
app.post('/api/tournaments', (req, res) => {
  const payload = req.body;
  const newId = `tourn-${Date.now()}`;
  
  const created: Tournament = {
    id: newId,
    organizationId: payload.organizationId || 'org-aspire',
    organizationName: payload.organizationName || 'Debate Association',
    name: payload.name || 'Untitled Championship',
    slug: (payload.name || 'championship').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: payload.description || 'Championship event managed by VectOS.',
    format: payload.format || 'WSDC',
    venue: payload.venue || 'Main Convention Center',
    city: payload.city || 'Kigali',
    country: payload.country || 'Rwanda',
    startDate: payload.startDate || new Date().toISOString().split('T')[0],
    endDate: payload.endDate || new Date().toISOString().split('T')[0],
    status: 'DRAFT',
    currentRoundNumber: 1,
    settings: {
      format: payload.format || 'WSDC',
      teamSize: payload.format === 'BP' ? 2 : 3,
      speakersPerTeam: payload.format === 'BP' ? 2 : 3,
      hasReplySpeech: payload.format === 'WSDC',
      minSpeakerScore: 60,
      maxSpeakerScore: 80,
      minReplyScore: 30,
      maxReplyScore: 40,
      prelimRoundsCount: payload.prelimRoundsCount || 5,
      breakSize: payload.breakSize || 8,
      sideBalanceEnforced: true,
      allowSelfJudgeConflict: false,
      preventSameInstitutionMatch: true,
      preventRepeatMatchups: true,
      isPublicResults: true,
      isPublicDraw: true,
      isPublicStandings: true,
      motionPrepTimeMinutes: 15,
      ...payload.settings
    },
    teams: payload.teams || [],
    judges: payload.judges || [],
    rooms: payload.rooms || initialSeed.rooms,
    rounds: [
      {
        id: `round-1`,
        tournamentId: newId,
        roundNumber: 1,
        name: 'Round 1 (Preliminary)',
        type: 'PRELIMINARY',
        status: 'DRAFT',
        motionReleased: false,
        drawReleased: false,
        resultsReleased: false,
        ballotsCount: 0,
        submittedBallotsCount: 0,
        debates: []
      }
    ],
    motions: payload.motions || [],
    announcements: [
      {
        id: `ann-${Date.now()}`,
        tournamentId: newId,
        title: 'Tournament Setup Initialized',
        content: 'Welcome to the tournament. Registration and participant allocation are open.',
        priority: 'NORMAL',
        targetAudience: 'ALL',
        createdAt: new Date().toISOString(),
        authorName: 'Tournament Director'
      }
    ],
    institutions: initialSeed.institutions,
    auditLogs: [],
    contactEmail: payload.contactEmail || 'admin@vectos.io'
  };

  logAuditEvent(created, 'Tournament Director', 'TOURNAMENT_DIRECTOR', 'CREATED_TOURNAMENT', 'ROUND', newId, {
    newValue: `Created tournament: ${created.name} (${created.format})`
  });

  tournamentsStore.set(newId, created);
  res.status(201).json({ tournament: created });
});

// Generate Pairings for Round
app.post('/api/tournaments/:id/pairings', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const { roundNumber, actorName = 'Tab Director', actorRole = 'TAB_DIRECTOR' } = req.body;
  const targetRound = tournament.rounds.find(r => r.roundNumber === Number(roundNumber));
  
  if (!targetRound) return res.status(404).json({ error: 'Round not found' });

  const previousRounds = tournament.rounds.filter(r => r.roundNumber < targetRound.roundNumber);
  const { debates, warnings } = generatePairings(tournament.teams, tournament.rooms, previousRounds, targetRound.roundNumber);

  // Assign motion if available
  const motion = tournament.motions.find(m => m.assignedRoundNumber === targetRound.roundNumber);
  if (motion) {
    targetRound.motion = motion;
    debates.forEach(d => { d.motion = motion; });
  }

  targetRound.debates = debates;
  targetRound.status = 'PREPARING';
  targetRound.ballotsCount = debates.length;

  logAuditEvent(tournament, actorName, actorRole, 'GENERATED_ROUND_PAIRINGS', 'DRAW', targetRound.id, {
    newValue: `Generated ${debates.length} debates with Swiss power-pairing for ${targetRound.name}.`,
    reason: warnings.length > 0 ? warnings.join('; ') : 'Standard draw generation'
  });

  res.json({ round: targetRound, warnings });
});

// Auto-Allocate Judges to Round
app.post('/api/tournaments/:id/judge-allocations', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const { roundNumber, actorName = 'Adjudication Core', actorRole = 'ADJ_CORE' } = req.body;
  const targetRound = tournament.rounds.find(r => r.roundNumber === Number(roundNumber));
  
  if (!targetRound || !targetRound.debates || targetRound.debates.length === 0) {
    return res.status(400).json({ error: 'No active debates found to allocate judges to.' });
  }

  const previousRounds = tournament.rounds.filter(r => r.roundNumber < targetRound.roundNumber);
  const { allocatedDebates, qualityReport } = allocateJudgesToDebates(targetRound.debates, tournament.judges, previousRounds);

  // Create initial empty pending ballots for each assigned chair
  allocatedDebates.forEach(debate => {
    if (debate.chairJudge && (!debate.ballots || debate.ballots.length === 0)) {
      debate.ballots = [
        {
          id: `ballot-${debate.id}-${debate.chairJudge.id}`,
          debateId: debate.id,
          roundId: targetRound.id,
          roundNumber: targetRound.roundNumber,
          judgeId: debate.chairJudge.id,
          judgeName: debate.chairJudge.name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: debate.governmentTeam.speakers.map((s, idx) => ({
            speakerId: s.id,
            speakerName: s.name,
            role: (idx === 0 ? 'PROP_1' : idx === 1 ? 'PROP_2' : 'PROP_3') as any,
            score: 75
          })),
          oppScores: debate.oppositionTeam.speakers.map((s, idx) => ({
            speakerId: s.id,
            speakerName: s.name,
            role: (idx === 0 ? 'OPP_1' : idx === 1 ? 'OPP_2' : 'OPP_3') as any,
            score: 75
          })),
          totalPropScore: 225,
          totalOppScore: 225,
          feedback: ''
        }
      ];
    }
  });

  targetRound.debates = allocatedDebates;
  targetRound.status = 'READY';

  logAuditEvent(tournament, actorName, actorRole, 'ALLOCATED_PANEL_JUDGES', 'JUDGE_ALLOCATION', targetRound.id, {
    newValue: `Allocated judges for ${allocatedDebates.length} debates. (${qualityReport.optimalCount} optimal, ${qualityReport.exceptionCount} with notices).`,
    reason: qualityReport.exceptions.join('; ')
  });

  res.json({ round: targetRound, qualityReport });
});

// Update Round Status & Release Toggles
app.post('/api/tournaments/:id/rounds/:roundNumber/status', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const { status, drawReleased, motionReleased, resultsReleased, actorName = 'Tab Director', actorRole = 'TAB_DIRECTOR' } = req.body;
  const targetRound = tournament.rounds.find(r => r.roundNumber === Number(req.params.roundNumber));

  if (!targetRound) return res.status(404).json({ error: 'Round not found' });

  const oldStatus = targetRound.status;
  if (status !== undefined) targetRound.status = status;
  if (drawReleased !== undefined) targetRound.drawReleased = drawReleased;
  if (motionReleased !== undefined) {
    targetRound.motionReleased = motionReleased;
    if (targetRound.motion) targetRound.motion.isReleased = motionReleased;
  }
  if (resultsReleased !== undefined) targetRound.resultsReleased = resultsReleased;

  logAuditEvent(tournament, actorName, actorRole, 'UPDATED_ROUND_LIFECYCLE', 'ROUND', targetRound.id, {
    oldValue: `Status: ${oldStatus}`,
    newValue: `Status: ${targetRound.status}, DrawPublic: ${targetRound.drawReleased}, MotionPublic: ${targetRound.motionReleased}`
  });

  res.json({ round: targetRound });
});

// Submit / Save Digital Ballot (from Judge or Tab Entry)
app.post('/api/tournaments/:id/ballots', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const { debateId, ballot, actorName = 'Judge', actorRole = 'JUDGE' } = req.body;

  let foundMatch: any = null;
  let targetRound: Round | null = null;

  for (const round of tournament.rounds) {
    const match = round.debates.find(d => d.id === debateId);
    if (match) {
      foundMatch = match;
      targetRound = round;
      break;
    }
  }

  if (!foundMatch || !targetRound) {
    return res.status(404).json({ error: 'Debate match not found' });
  }

  // Calculate totals
  const totalProp = (ballot.propScores || []).reduce((acc: number, item: any) => acc + Number(item.score || 0), 0);
  const totalOpp = (ballot.oppScores || []).reduce((acc: number, item: any) => acc + Number(item.score || 0), 0);

  const updatedBallot: Ballot = {
    ...ballot,
    totalPropScore: Number(totalProp.toFixed(1)),
    totalOppScore: Number(totalOpp.toFixed(1)),
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString()
  };

  // Replace or add in match ballots
  const existingIdx = foundMatch.ballots.findIndex((b: Ballot) => b.id === updatedBallot.id || b.judgeId === updatedBallot.judgeId);
  if (existingIdx >= 0) {
    foundMatch.ballots[existingIdx] = updatedBallot;
  } else {
    foundMatch.ballots.push(updatedBallot);
  }

  foundMatch.status = 'BALLOTS_SUBMITTED';
  foundMatch.winnerTeamId = updatedBallot.winnerTeamId;

  // Update round submitted ballot counts
  targetRound.submittedBallotsCount = targetRound.debates.filter(d => d.ballots.some(b => b.status === 'SUBMITTED' || b.status === 'VERIFIED')).length;

  logAuditEvent(tournament, actorName, actorRole, 'SUBMITTED_DIGITAL_BALLOT', 'BALLOT', updatedBallot.id, {
    newValue: `Ballot submitted by ${actorName}. Winner: ${updatedBallot.winnerSide} (Gov: ${totalProp} pts, Opp: ${totalOpp} pts)`
  });

  res.json({ match: foundMatch, ballot: updatedBallot });
});

// Tab Director Score Correction with Required Audit Reason
app.post('/api/tournaments/:id/ballot-corrections', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const { ballotId, field, oldValue, newValue, reason, actorName = 'Tab Director' } = req.body;

  if (!reason || reason.trim().length === 0) {
    return res.status(400).json({ error: 'A valid justification reason is mandatory for Tab score corrections.' });
  }

  let foundBallot: Ballot | null = null;
  for (const round of tournament.rounds) {
    for (const debate of round.debates) {
      const b = debate.ballots.find(x => x.id === ballotId);
      if (b) {
        foundBallot = b;
        break;
      }
    }
  }

  if (!foundBallot) return res.status(404).json({ error: 'Ballot not found' });

  if (!foundBallot.corrections) foundBallot.corrections = [];
  foundBallot.corrections.push({
    id: `corr-${Date.now()}`,
    field,
    oldValue,
    newValue,
    reason,
    correctedBy: actorName,
    timestamp: new Date().toISOString()
  });

  foundBallot.status = 'CORRECTED';

  logAuditEvent(tournament, actorName, 'TAB_DIRECTOR', 'CORRECTED_BALLOT_SCORE', 'BALLOT', ballotId, {
    oldValue: `${field}: ${oldValue}`,
    newValue: `${field}: ${newValue}`,
    reason,
    severity: 'WARNING'
  });

  res.json({ ballot: foundBallot, message: 'Ballot corrected and audit log recorded.' });
});

// Participant Check-In Batch Update
app.post('/api/tournaments/:id/checkin', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const { targetType, targetId, status, actorName = 'Registration Officer' } = req.body;

  if (targetType === 'TEAM') {
    const team = tournament.teams.find(t => t.id === targetId);
    if (team) {
      const old = team.status;
      team.status = status;
      logAuditEvent(tournament, actorName, 'REGISTRATION_STAFF', 'UPDATED_TEAM_CHECKIN', 'REGISTRATION', targetId, {
        oldValue: old,
        newValue: status
      });
    }
  } else if (targetType === 'JUDGE') {
    const judge = tournament.judges.find(j => j.id === targetId);
    if (judge) {
      const old = judge.status;
      judge.status = status;
      logAuditEvent(tournament, actorName, 'REGISTRATION_STAFF', 'UPDATED_JUDGE_CHECKIN', 'REGISTRATION', targetId, {
        oldValue: old,
        newValue: status
      });
    }
  }

  res.json({ message: 'Check-in updated successfully', teams: tournament.teams, judges: tournament.judges });
});

// Post Announcement
app.post('/api/tournaments/:id/announcements', (req, res) => {
  const tournament = tournamentsStore.get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const { title, content, priority = 'NORMAL', targetAudience = 'ALL', authorName = 'Tournament Director' } = req.body;

  const announcement: Announcement = {
    id: `ann-${Date.now()}`,
    tournamentId: tournament.id,
    title,
    content,
    priority,
    targetAudience,
    createdAt: new Date().toISOString(),
    authorName
  };

  tournament.announcements.unshift(announcement);

  logAuditEvent(tournament, authorName, 'TOURNAMENT_DIRECTOR', 'PUBLISHED_ANNOUNCEMENT', 'ROUND', announcement.id, {
    newValue: `Announcement: "${title}" broadcast to ${targetAudience}`
  });

  res.status(201).json({ announcement });
});

// Reset / Seed Fresh Tournament
app.post('/api/tournaments/reset-seed', (req, res) => {
  const fresh = createInitialSeedTournament();
  tournamentsStore.set(fresh.id, fresh);
  res.json({ tournament: fresh, message: 'Tournament reset to EAUDC 2026 default seed state.' });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VectOS Competition server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
