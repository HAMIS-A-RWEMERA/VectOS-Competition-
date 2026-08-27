// VectOS Competition - Core Tournament Engine & Algorithms
// Deterministic pairing, side balancing, judge conflict matrix, ballot calculation, and break resolution

import {
  Tournament,
  Team,
  Judge,
  Room,
  Round,
  DebateMatch,
  Ballot,
  JudgeConflict,
  TournamentHealth,
  BreakQualification,
  BreakQualifier,
  AuditLogEntry
} from '../types/competition';

/**
 * Validates whether two teams have already debated in previous preliminary rounds
 */
export function haveTeamsDebated(teamAId: string, teamBId: string, previousRounds: Round[]): boolean {
  for (const round of previousRounds) {
    if (round.debates) {
      for (const match of round.debates) {
        if (
          (match.governmentTeam.id === teamAId && match.oppositionTeam.id === teamBId) ||
          (match.governmentTeam.id === teamBId && match.oppositionTeam.id === teamAId)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Checks for hard conflicts between a judge and two debate teams
 */
export function checkJudgeConflicts(
  judge: Judge,
  govTeam: Team,
  oppTeam: Team,
  previousRounds: Round[]
): { hasConflict: boolean; reasons: string[]; isHardConflict: boolean } {
  const reasons: string[] = [];
  let isHard = false;

  // 1. Institutional Conflict
  if (judge.institutionId === govTeam.institutionId) {
    reasons.push(`Institutional conflict with Gov (${govTeam.name} - ${govTeam.institutionName})`);
    isHard = true;
  }
  if (judge.institutionId === oppTeam.institutionId) {
    reasons.push(`Institutional conflict with Opp (${oppTeam.name} - ${oppTeam.institutionName})`);
    isHard = true;
  }

  // 2. Declared Conflicts
  if (judge.conflicts && judge.conflicts.length > 0) {
    for (const conflict of judge.conflicts) {
      if (conflict.targetType === 'TEAM') {
        if (conflict.targetId === govTeam.id) {
          reasons.push(`Declared ${conflict.conflictType.toLowerCase()} conflict with ${govTeam.name}`);
          isHard = true;
        }
        if (conflict.targetId === oppTeam.id) {
          reasons.push(`Declared ${conflict.conflictType.toLowerCase()} conflict with ${oppTeam.name}`);
          isHard = true;
        }
      } else if (conflict.targetType === 'INSTITUTION') {
        if (conflict.targetId === govTeam.institutionId) {
          reasons.push(`Declared conflict with institution ${govTeam.institutionName}`);
          isHard = true;
        }
        if (conflict.targetId === oppTeam.institutionId) {
          reasons.push(`Declared conflict with institution ${oppTeam.institutionName}`);
          isHard = true;
        }
      }
    }
  }

  // 3. Soft Conflict: Previous exposure (has judged either team in recent rounds)
  let timesJudgedGov = 0;
  let timesJudgedOpp = 0;
  for (const round of previousRounds) {
    if (round.debates) {
      for (const d of round.debates) {
        const allMatchJudges = [d.chairJudge, ...(d.panelistJudges || []), ...(d.traineeJudges || [])].filter(Boolean);
        const judgedThis = allMatchJudges.some(j => j.id === judge.id);
        if (judgedThis) {
          if (d.governmentTeam.id === govTeam.id || d.oppositionTeam.id === govTeam.id) {
            timesJudgedGov++;
          }
          if (d.governmentTeam.id === oppTeam.id || d.oppositionTeam.id === oppTeam.id) {
            timesJudgedOpp++;
          }
        }
      }
    }
  }

  if (timesJudgedGov > 0) {
    reasons.push(`Previously judged ${govTeam.name} (${timesJudgedGov} time${timesJudgedGov > 1 ? 's' : ''})`);
  }
  if (timesJudgedOpp > 0) {
    reasons.push(`Previously judged ${oppTeam.name} (${timesJudgedOpp} time${timesJudgedOpp > 1 ? 's' : ''})`);
  }

  return {
    hasConflict: reasons.length > 0,
    reasons,
    isHardConflict: isHard
  };
}

/**
 * Generates Swiss-system power-matched preliminary pairings with side balancing and conflict avoidance
 */
export function generatePairings(
  teams: Team[],
  rooms: Room[],
  previousRounds: Round[],
  roundNumber: number
): { debates: DebateMatch[]; warnings: string[] } {
  const warnings: string[] = [];
  
  // Filter active, checked-in teams
  const activeTeams = teams.filter(t => t.status === 'CHECKED_IN' || t.status === 'REGISTERED');
  
  if (activeTeams.length < 2) {
    warnings.push('At least 2 active teams are required to generate pairings.');
    return { debates: [], warnings };
  }

  // Sort teams into power brackets: Primary by Wins descending, Secondary by Total Speaker Score descending
  const sortedTeams = [...activeTeams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.totalSpeakerScore - a.totalSpeakerScore;
  });

  const availableRooms = rooms.filter(r => r.isAvailable);
  const debates: DebateMatch[] = [];
  const usedTeamIds = new Set<string>();

  // Group teams into win brackets (e.g. 3-0 bracket, 2-1 bracket, etc.)
  const winBrackets = new Map<number, Team[]>();
  for (const team of sortedTeams) {
    const list = winBrackets.get(team.wins) || [];
    list.push(team);
    winBrackets.set(team.wins, list);
  }

  // Sort bracket keys descending
  const sortedBracketKeys = Array.from(winBrackets.keys()).sort((a, b) => b - a);
  let pullDownTeams: Team[] = [];

  for (const winScore of sortedBracketKeys) {
    const bracketTeams = [...pullDownTeams, ...(winBrackets.get(winScore) || [])];
    pullDownTeams = [];

    // Pair within bracket
    let unassigned = [...bracketTeams];

    while (unassigned.length >= 2) {
      const teamA = unassigned.shift()!;
      let bestPartnerIndex = -1;
      let bestPenalty = Infinity;

      for (let i = 0; i < unassigned.length; i++) {
        const candidate = unassigned[i];
        let penalty = 0;

        // Check previous match
        if (haveTeamsDebated(teamA.id, candidate.id, previousRounds)) {
          penalty += 1000;
        }

        // Check same institution
        if (teamA.institutionId === candidate.institutionId) {
          penalty += 500;
        }

        // Check speaker point proximity
        penalty += Math.abs(teamA.totalSpeakerScore - candidate.totalSpeakerScore);

        if (penalty < bestPenalty) {
          bestPenalty = penalty;
          bestPartnerIndex = i;
        }
      }

      if (bestPartnerIndex === -1) {
        bestPartnerIndex = 0;
      }

      const teamB = unassigned.splice(bestPartnerIndex, 1)[0];

      // Side Allocation: Who needs Proposition (Government) more?
      // Net Side Balance = govCount - oppCount.
      // The team with lower govCount (fewer previous Govs) gets Gov.
      let govTeam = teamA;
      let oppTeam = teamB;

      const balanceA = (teamA.govCount || 0) - (teamA.oppCount || 0);
      const balanceB = (teamB.govCount || 0) - (teamB.oppCount || 0);

      if (balanceA > balanceB) {
        // Team A had more govs than team B -> Team B gets Gov
        govTeam = teamB;
        oppTeam = teamA;
      } else if (balanceA < balanceB) {
        govTeam = teamA;
        oppTeam = teamB;
      } else {
        // Random / alternating based on round
        if ((roundNumber + debates.length) % 2 === 1) {
          govTeam = teamB;
          oppTeam = teamA;
        }
      }

      // Check conflict warning
      const matchWarnings: string[] = [];
      if (haveTeamsDebated(govTeam.id, oppTeam.id, previousRounds)) {
        matchWarnings.push(`Repeat matchup: Debated in a previous round`);
      }
      if (govTeam.institutionId === oppTeam.institutionId) {
        matchWarnings.push(`Same institution match: ${govTeam.institutionName}`);
      }

      const roomIndex = debates.length;
      const assignedRoom: Room = availableRooms[roomIndex % availableRooms.length] || {
        id: `room-fallback-${debates.length + 1}`,
        name: `Room ${debates.length + 1}`,
        building: 'Main Pavilion',
        capacity: 30,
        isAvailable: true,
        isAccessible: true
      };

      const matchId = `match-r${roundNumber}-${debates.length + 1}`;
      debates.push({
        id: matchId,
        roundId: `round-${roundNumber}`,
        roundNumber,
        room: assignedRoom,
        governmentTeam: govTeam,
        oppositionTeam: oppTeam,
        // Empty judge initially to be allocated by Judge Allocation Engine
        chairJudge: null as unknown as Judge,
        panelistJudges: [],
        traineeJudges: [],
        ballots: [],
        status: 'SCHEDULED',
        hasWarning: matchWarnings.length > 0,
        warningReasons: matchWarnings
      });

      usedTeamIds.add(govTeam.id);
      usedTeamIds.add(oppTeam.id);
    }

    // If 1 team remains in bracket, pull down to next bracket
    if (unassigned.length === 1) {
      pullDownTeams.push(unassigned[0]);
    }
  }

  // If 1 odd team remains at the very end
  if (pullDownTeams.length > 0) {
    warnings.push(`Odd number of teams: Team ${pullDownTeams[0].name} has a bye or requires an unallocated swing team.`);
  }

  return { debates, warnings };
}

/**
 * Allocates chairs, panelists, and trainees to debate matches avoiding institutional and personal conflicts
 */
export function allocateJudgesToDebates(
  debates: DebateMatch[],
  judges: Judge[],
  previousRounds: Round[]
): { allocatedDebates: DebateMatch[]; qualityReport: { optimalCount: number; exceptionCount: number; exceptions: string[] } } {
  const exceptions: string[] = [];
  let optimalCount = 0;
  let exceptionCount = 0;

  // Filter available and checked-in judges
  const availableJudges = judges.filter(j => j.status === 'CHECKED_IN' || j.status === 'REGISTERED');
  
  // Sort judges by rating descending to place highest rated chairs on highest bracket debates
  const sortedJudges = [...availableJudges].sort((a, b) => {
    if (b.isChairAccredited !== a.isChairAccredited) return b.isChairAccredited ? 1 : -1;
    return b.rating - a.rating;
  });

  const assignedJudgeIds = new Set<string>();

  const allocatedDebates = debates.map((debate, debateIdx) => {
    const gov = debate.governmentTeam;
    const opp = debate.oppositionTeam;

    // Find best Chair Judge
    let assignedChair: Judge | null = null;

    // 1. First pass: High-ranked chair with NO hard or soft conflicts
    for (const judge of sortedJudges) {
      if (assignedJudgeIds.has(judge.id)) continue;
      const conflict = checkJudgeConflicts(judge, gov, opp, previousRounds);
      if (!conflict.hasConflict && (judge.isChairAccredited || judge.rating >= 7)) {
        assignedChair = judge;
        break;
      }
    }

    // 2. Second pass: Chair with no HARD conflicts (may have previous round soft match)
    if (!assignedChair) {
      for (const judge of sortedJudges) {
        if (assignedJudgeIds.has(judge.id)) continue;
        const conflict = checkJudgeConflicts(judge, gov, opp, previousRounds);
        if (!conflict.isHardConflict) {
          assignedChair = judge;
          break;
        }
      }
    }

    // 3. Fallback pass: Any available judge
    if (!assignedChair) {
      for (const judge of sortedJudges) {
        if (assignedJudgeIds.has(judge.id)) continue;
        assignedChair = judge;
        break;
      }
    }

    if (assignedChair) {
      assignedJudgeIds.add(assignedChair.id);
      const conflict = checkJudgeConflicts(assignedChair, gov, opp, previousRounds);
      if (conflict.hasConflict) {
        exceptionCount++;
        exceptions.push(`Debate #${debateIdx + 1} (${gov.code} vs ${opp.code}): Chair ${assignedChair.name} has notice - ${conflict.reasons.join(', ')}`);
      } else {
        optimalCount++;
      }
    } else {
      exceptionCount++;
      exceptions.push(`Debate #${debateIdx + 1} (${gov.code} vs ${opp.code}): No available judge in pool`);
    }

    return {
      ...debate,
      chairJudge: assignedChair as Judge,
      panelistJudges: [],
      traineeJudges: []
    };
  });

  return {
    allocatedDebates,
    qualityReport: {
      optimalCount,
      exceptionCount,
      exceptions
    }
  };
}

/**
 * Calculates updated team and speaker standings from all completed round ballots
 */
export function recalculateTournamentStandings(tournament: Tournament): {
  updatedTeams: Team[];
  speakerStandings: {
    rank: number;
    speakerId: string;
    speakerName: string;
    teamName: string;
    institutionName: string;
    category: string;
    totalScore: number;
    averageScore: number;
    roundsCount: number;
  }[];
} {
  const teamStats = new Map<string, {
    wins: number;
    losses: number;
    totalSpeakerScore: number;
    govCount: number;
    oppCount: number;
    netMargin: number;
  }>();

  const speakerMap = new Map<string, {
    speakerId: string;
    speakerName: string;
    teamName: string;
    institutionName: string;
    category: string;
    scores: number[];
  }>();

  // Initialize teams
  for (const team of tournament.teams) {
    teamStats.set(team.id, {
      wins: 0,
      losses: 0,
      totalSpeakerScore: 0,
      govCount: 0,
      oppCount: 0,
      netMargin: 0
    });

    for (const speaker of team.speakers) {
      speakerMap.set(speaker.id, {
        speakerId: speaker.id,
        speakerName: speaker.name,
        teamName: team.name,
        institutionName: team.institutionName,
        category: speaker.category || 'OPEN',
        scores: []
      });
    }
  }

  // Iterate completed rounds and submitted ballots
  for (const round of tournament.rounds) {
    if (round.type !== 'PRELIMINARY') continue; // Break calculations are based on Prelim rounds

    for (const debate of round.debates) {
      const verifiedBallot = debate.ballots.find(b => b.status === 'VERIFIED' || b.status === 'SUBMITTED');
      const govStat = teamStats.get(debate.governmentTeam.id);
      const oppStat = teamStats.get(debate.oppositionTeam.id);

      if (govStat) govStat.govCount += 1;
      if (oppStat) oppStat.oppCount += 1;

      if (verifiedBallot) {
        const govTotal = verifiedBallot.totalPropScore;
        const oppTotal = verifiedBallot.totalOppScore;
        const margin = govTotal - oppTotal;

        if (govStat) {
          govStat.totalSpeakerScore += govTotal;
          govStat.netMargin += margin;
          if (verifiedBallot.winnerSide === 'GOVERNMENT') {
            govStat.wins += 1;
          } else if (verifiedBallot.winnerSide === 'OPPOSITION') {
            govStat.losses += 1;
          }
        }

        if (oppStat) {
          oppStat.totalSpeakerScore += oppTotal;
          oppStat.netMargin -= margin;
          if (verifiedBallot.winnerSide === 'OPPOSITION') {
            oppStat.wins += 1;
          } else if (verifiedBallot.winnerSide === 'GOVERNMENT') {
            oppStat.losses += 1;
          }
        }

        // Speaker Scores
        for (const scoreEntry of verifiedBallot.propScores) {
          const spk = speakerMap.get(scoreEntry.speakerId);
          if (spk) spk.scores.push(scoreEntry.score);
        }
        for (const scoreEntry of verifiedBallot.oppScores) {
          const spk = speakerMap.get(scoreEntry.speakerId);
          if (spk) spk.scores.push(scoreEntry.score);
        }
      }
    }
  }

  // Map back to teams and calculate team ranks
  const updatedTeams: Team[] = tournament.teams.map(team => {
    const stat = teamStats.get(team.id) || { wins: 0, losses: 0, totalSpeakerScore: 0, govCount: 0, oppCount: 0, netMargin: 0 };
    return {
      ...team,
      wins: stat.wins,
      losses: stat.losses,
      totalSpeakerScore: Number(stat.totalSpeakerScore.toFixed(1)),
      netMargin: Number(stat.netMargin.toFixed(1)),
      govCount: stat.govCount,
      oppCount: stat.oppCount
    };
  });

  // Sort teams: 1) Wins Descending, 2) Total Speaker Points Descending, 3) Net Margin Descending
  updatedTeams.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.totalSpeakerScore !== a.totalSpeakerScore) return b.totalSpeakerScore - a.totalSpeakerScore;
    return b.netMargin - a.netMargin;
  });

  // Assign ranks
  updatedTeams.forEach((team, idx) => {
    team.rank = idx + 1;
  });

  // Compute speaker rankings
  const speakerStandings = Array.from(speakerMap.values()).map(s => {
    const totalScore = s.scores.reduce((sum, val) => sum + val, 0);
    const averageScore = s.scores.length > 0 ? totalScore / s.scores.length : 0;
    return {
      rank: 0,
      speakerId: s.speakerId,
      speakerName: s.speakerName,
      teamName: s.teamName,
      institutionName: s.institutionName,
      category: s.category,
      totalScore: Number(totalScore.toFixed(1)),
      averageScore: Number(averageScore.toFixed(2)),
      roundsCount: s.scores.length
    };
  });

  // Sort speakers: Average Score Descending, Total Score Descending
  speakerStandings.sort((a, b) => {
    if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
    return b.totalScore - a.totalScore;
  });

  speakerStandings.forEach((spk, idx) => {
    spk.rank = idx + 1;
  });

  return { updatedTeams, speakerStandings };
}

/**
 * Calculates Top N break qualifications and constructs standard elimination brackets (1 vs 16, 2 vs 15, etc.)
 */
export function calculateBreakAdvancement(
  teams: Team[],
  breakSize: number = 8,
  institutionalCap: number = 0
): BreakQualifier[] {
  // Sort teams by rank / wins & points
  const sorted = [...teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.totalSpeakerScore !== a.totalSpeakerScore) return b.totalSpeakerScore - a.totalSpeakerScore;
    return b.netMargin - a.netMargin;
  });

  const institutionCounts = new Map<string, number>();
  const qualifiedList: BreakQualifier[] = [];

  let seed = 1;
  for (let i = 0; i < sorted.length; i++) {
    const team = sorted[i];
    const instCount = institutionCounts.get(team.institutionId) || 0;
    let qualifies = false;

    if (qualifiedList.filter(q => q.isQualified).length < breakSize) {
      if (institutionalCap > 0 && instCount >= institutionalCap) {
        qualifies = false;
      } else {
        qualifies = true;
        institutionCounts.set(team.institutionId, instCount + 1);
      }
    }

    qualifiedList.push({
      rank: i + 1,
      seed: qualifies ? seed++ : i + 1,
      teamId: team.id,
      teamName: team.name,
      institutionName: team.institutionName,
      wins: team.wins,
      losses: team.losses,
      totalSpeakerScore: team.totalSpeakerScore,
      isQualified: qualifies
    });
  }

  return qualifiedList;
}

/**
 * Assesses overall tournament operational readiness and diagnostic health
 */
export function evaluateTournamentHealth(tournament: Tournament): TournamentHealth {
  const issues: { level: 'INFO' | 'WARNING' | 'ERROR'; message: string; actionLabel?: string; actionKey?: string }[] = [];

  const currentRound = tournament.rounds.find(r => r.roundNumber === tournament.currentRoundNumber) || tournament.rounds[0];

  if (!currentRound) {
    return {
      status: 'GREEN',
      headline: 'Tournament setup in progress',
      issues: [{ level: 'INFO', message: 'No active rounds created yet. Configure Round 1 to start.' }]
    };
  }

  // Check Missing Ballots
  if (currentRound.status === 'RELEASED' || currentRound.status === 'IN_PROGRESS' || currentRound.status === 'AWAITING_BALLOTS') {
    const totalDebates = currentRound.debates.length;
    const submittedCount = currentRound.debates.filter(d => d.ballots.some(b => b.status === 'SUBMITTED' || b.status === 'VERIFIED')).length;
    const missingCount = totalDebates - submittedCount;

    if (missingCount > 0) {
      issues.push({
        level: missingCount > 3 ? 'ERROR' : 'WARNING',
        message: `${missingCount} of ${totalDebates} ballots pending for ${currentRound.name}.`,
        actionLabel: 'Monitor Ballots',
        actionKey: 'tab_ballots'
      });
    }
  }

  // Check Unassigned Judges
  const unassignedJudgesMatch = currentRound.debates.filter(d => !d.chairJudge);
  if (unassignedJudgesMatch.length > 0) {
    issues.push({
      level: 'ERROR',
      message: `${unassignedJudgesMatch.length} debates in ${currentRound.name} have no chair judge assigned.`,
      actionLabel: 'Allocate Judges',
      actionKey: 'tab_judges'
    });
  }

  // Check Motion release
  if (currentRound.status === 'RELEASED' && !currentRound.motionReleased) {
    issues.push({
      level: 'WARNING',
      message: `Round is released to teams, but motion remains unreleased.`,
      actionLabel: 'Release Motion',
      actionKey: 'motions'
    });
  }

  // Determine overall status
  const hasError = issues.some(i => i.level === 'ERROR');
  const hasWarning = issues.some(i => i.level === 'WARNING');

  const status = hasError ? 'RED' : hasWarning ? 'YELLOW' : 'GREEN';
  const headline = hasError
    ? 'Immediate operational blockers detected'
    : hasWarning
    ? 'Round in progress with active items requiring attention'
    : 'Tournament operating smoothly — All systems verified';

  return {
    status,
    headline,
    issues
  };
}
