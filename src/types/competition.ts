// VectOS Competition - Core Type Definitions & Multi-Format Competition Models

export type CompetitionFormatType = 
  | 'WSDC' // World Schools Debating Championship (3v3 + reply)
  | 'BP'   // British Parliamentary (4 teams of 2)
  | 'AP'   // Asian Parliamentary (3v3)
  | 'AUSD' // Australs
  | 'MUN'  // Model UN
  | 'QUIZ' // Quiz / Trivia Bowl
  | 'CHESS'; // Swiss Chess

export type TournamentStatus = 
  | 'DRAFT'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'CHECK_IN'
  | 'IN_PROGRESS'
  | 'ELIMINATIONS'
  | 'COMPLETED'
  | 'ARCHIVED';

export type RoundType = 
  | 'PRELIMINARY'
  | 'OCTOFINALS'
  | 'QUARTERFINALS'
  | 'SEMIFINALS'
  | 'GRAND_FINAL';

export type RoundStatus = 
  | 'DRAFT'
  | 'PREPARING'
  | 'READY'
  | 'RELEASED'
  | 'IN_PROGRESS'
  | 'AWAITING_BALLOTS'
  | 'COMPLETED';

export type ParticipantStatus = 
  | 'REGISTERED'
  | 'CHECKED_IN'
  | 'LATE'
  | 'WITHDRAWN'
  | 'ABSENT'
  | 'DISQUALIFIED';

export type CheckInStatus = ParticipantStatus;

export interface BreakQualifier {
  rank: number;
  seed: number;
  teamId: string;
  teamName: string;
  institutionName: string;
  wins: number;
  losses: number;
  totalSpeakerScore: number;
  isQualified: boolean;
  overrideApplied?: boolean;
}

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'TOURNAMENT_DIRECTOR'
  | 'TAB_DIRECTOR'
  | 'ADJ_CORE'
  | 'REGISTRATION_STAFF'
  | 'JUDGE'
  | 'COACH'
  | 'DEBATER'
  | 'PUBLIC_VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;
  institutionName?: string;
  organizationId?: string;
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  country: string;
  logoUrl?: string;
  subscriptionPlan: 'FREE' | 'PER_TOURNAMENT' | 'ORGANIZATION_PRO' | 'ENTERPRISE';
  tournamentsCount: number;
}

export interface TournamentSettings {
  format: CompetitionFormatType;
  teamSize: number;
  speakersPerTeam: number;
  hasReplySpeech: boolean;
  minSpeakerScore: number;
  maxSpeakerScore: number;
  minReplyScore: number;
  maxReplyScore: number;
  prelimRoundsCount: number;
  breakSize: 4 | 8 | 16 | 32;
  sideBalanceEnforced: boolean;
  allowSelfJudgeConflict: boolean;
  preventSameInstitutionMatch: boolean;
  preventRepeatMatchups: boolean;
  isPublicResults: boolean;
  isPublicDraw: boolean;
  isPublicStandings: boolean;
  motionPrepTimeMinutes: number;
}

export interface Institution {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  country: string;
  logoUrl?: string;
}

export interface Speaker {
  id: string;
  name: string;
  teamId: string;
  institutionId: string;
  speakingOrderPreference?: number;
  category: 'OPEN' | 'NOVICE' | 'ESL' | 'HIGH_SCHOOL';
  email?: string;
  totalPoints?: number;
  averageScore?: number;
  roundsCount?: number;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  institutionId: string;
  institutionName: string;
  speakers: Speaker[];
  status: ParticipantStatus;
  category: 'OPEN' | 'NOVICE' | 'ESL' | 'HIGH_SCHOOL';
  coachName?: string;
  contactEmail?: string;
  // Stats
  wins: number;
  losses: number;
  totalSpeakerScore: number;
  netMargin: number;
  govCount: number;
  oppCount: number;
  rank?: number;
  eliminated?: boolean;
}

export interface JudgeConflict {
  id: string;
  judgeId: string;
  targetType: 'INSTITUTION' | 'TEAM' | 'PERSON';
  targetId: string;
  targetName: string;
  conflictType: 'INSTITUTIONAL' | 'COACHING' | 'PERSONAL' | 'PREVIOUS_MATCH' | 'EXPLICIT_BLOCK';
  description?: string;
}

export interface Judge {
  id: string;
  name: string;
  institutionId: string;
  institutionName: string;
  rating: number; // 1-10 scale
  isChairAccredited: boolean;
  status: ParticipantStatus;
  email: string;
  phone?: string;
  experienceLevel: 'TRAINEE' | 'EXPERIENCED' | 'SENIOR' | 'CHIEF_ADJ';
  conflicts: JudgeConflict[];
  roundsJudged: number;
  activeRoundId?: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  isAvailable: boolean;
  isAccessible: boolean;
  notes?: string;
}

export interface Motion {
  id: string;
  text: string;
  infoSlide?: string;
  category: 'ECONOMICS' | 'INTERNATIONAL_RELATIONS' | 'AFRICAN_AFFAIRS' | 'SCIENCE_TECH' | 'ETHICS_POLITICS' | 'EDUCATION';
  sourceOrAuthor?: string;
  difficulty: 'STANDARD' | 'CHALLENGING' | 'NOVICE_FRIENDLY';
  assignedRoundNumber?: number;
  isReleased: boolean;
  releasedAt?: string;
}

export type BallotStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'CORRECTED';

export interface SpeakerScoreEntry {
  speakerId: string;
  speakerName: string;
  role: 'PROP_1' | 'PROP_2' | 'PROP_3' | 'PROP_REPLY' | 'OPP_1' | 'OPP_2' | 'OPP_3' | 'OPP_REPLY';
  score: number;
}

export interface Ballot {
  id: string;
  debateId: string;
  roundId: string;
  roundNumber: number;
  judgeId: string;
  judgeName: string;
  isChair: boolean;
  status: BallotStatus;
  winnerSide: 'GOVERNMENT' | 'OPPOSITION' | null;
  winnerTeamId: string | null;
  propScores: SpeakerScoreEntry[];
  oppScores: SpeakerScoreEntry[];
  totalPropScore: number;
  totalOppScore: number;
  feedback?: string;
  submittedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  corrections?: BallotCorrection[];
}

export interface BallotCorrection {
  id: string;
  field: string;
  oldValue: string | number;
  newValue: string | number;
  reason: string;
  correctedBy: string;
  timestamp: string;
}

export interface DebateMatch {
  id: string;
  roundId: string;
  roundNumber: number;
  room: Room;
  governmentTeam: Team;
  oppositionTeam: Team;
  chairJudge: Judge;
  panelistJudges: Judge[];
  traineeJudges: Judge[];
  motion?: Motion;
  ballots: Ballot[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'BALLOTS_SUBMITTED' | 'CONFIRMED';
  winnerTeamId?: string;
  margin?: number;
  // Conflict warning flags
  hasWarning?: boolean;
  warningReasons?: string[];
}

export interface Round {
  id: string;
  tournamentId: string;
  roundNumber: number;
  name: string;
  type: RoundType;
  status: RoundStatus;
  motionId?: string;
  motion?: Motion;
  motionReleased: boolean;
  drawReleased: boolean;
  resultsReleased: boolean;
  debates: DebateMatch[];
  startTime?: string;
  endTime?: string;
  ballotsCount: number;
  submittedBallotsCount: number;
}

export interface BreakQualification {
  rank: number;
  team: Team;
  isQualified: boolean;
  overrideApplied?: boolean;
  overrideReason?: string;
  bracketPosition?: number;
}

export interface Announcement {
  id: string;
  tournamentId: string;
  title: string;
  content: string;
  priority: 'NORMAL' | 'URGENT' | 'CRITICAL';
  targetAudience: 'ALL' | 'JUDGES' | 'TEAMS' | 'PUBLIC';
  createdAt: string;
  authorName: string;
}

export interface AuditLogEntry {
  id: string;
  tournamentId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'DRAW' | 'JUDGE_ALLOCATION' | 'BALLOT' | 'ROUND' | 'BREAK' | 'REGISTRATION' | 'MOTION';
  entityId: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface TournamentHealth {
  status: 'GREEN' | 'YELLOW' | 'RED';
  headline: string;
  issues: {
    level: 'INFO' | 'WARNING' | 'ERROR';
    message: string;
    actionLabel?: string;
    actionKey?: string;
  }[];
}

export interface Tournament {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  slug: string;
  description: string;
  format: CompetitionFormatType;
  venue: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  currentRoundNumber: number;
  settings: TournamentSettings;
  teams: Team[];
  judges: Judge[];
  rooms: Room[];
  rounds: Round[];
  motions: Motion[];
  announcements: Announcement[];
  institutions: Institution[];
  auditLogs: AuditLogEntry[];
  contactEmail: string;
}
