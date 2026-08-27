// VectOS Competition - Authentic Seed Data for EAUDC 2026 & Debate Circuit (Rwanda / East Africa)

import {
  Tournament,
  Institution,
  Team,
  Judge,
  Room,
  Round,
  Motion,
  Announcement,
  AuditLogEntry
} from '../types/competition';

export const SEED_INSTITUTIONS: Institution[] = [
  { id: 'inst-ur', name: 'University of Rwanda', shortCode: 'UR', city: 'Kigali', country: 'Rwanda' },
  { id: 'inst-cmua', name: 'Carnegie Mellon University Africa', shortCode: 'CMU-A', city: 'Kigali', country: 'Rwanda' },
  { id: 'inst-mak', name: 'Makerere University', shortCode: 'MAK', city: 'Kampala', country: 'Uganda' },
  { id: 'inst-strath', name: 'Strathmore University', shortCode: 'STR', city: 'Nairobi', country: 'Kenya' },
  { id: 'inst-udsm', name: 'University of Dar es Salaam', shortCode: 'UDSM', city: 'Dar es Salaam', country: 'Tanzania' },
  { id: 'inst-alu', name: 'African Leadership University', shortCode: 'ALU', city: 'Kigali', country: 'Rwanda' },
  { id: 'inst-kepler', name: 'Kepler College', shortCode: 'KEP', city: 'Kigali', country: 'Rwanda' },
  { id: 'inst-cuea', name: 'Catholic University of Eastern Africa', shortCode: 'CUEA', city: 'Nairobi', country: 'Kenya' },
  { id: 'inst-ashesi', name: 'Ashesi University', shortCode: 'ASH', city: 'Berekuso', country: 'Ghana' },
  { id: 'inst-mku', name: 'Mount Kenya University Rwanda', shortCode: 'MKU', city: 'Kigali', country: 'Rwanda' }
];

export const SEED_ROOMS: Room[] = [
  { id: 'room-1', name: 'Auditorium Alpha', building: 'Kigali Convention Hub', capacity: 120, isAvailable: true, isAccessible: true },
  { id: 'room-2', name: 'Hall B (Kagera)', building: 'Kigali Convention Hub', capacity: 60, isAvailable: true, isAccessible: true },
  { id: 'room-3', name: 'Hall C (Nyabarongo)', building: 'Kigali Convention Hub', capacity: 50, isAvailable: true, isAccessible: true },
  { id: 'room-4', name: 'Seminar Room 101', building: 'Academic Block A', capacity: 40, isAvailable: true, isAccessible: true },
  { id: 'room-5', name: 'Seminar Room 102', building: 'Academic Block A', capacity: 40, isAvailable: true, isAccessible: true },
  { id: 'room-6', name: 'Seminar Room 103', building: 'Academic Block A', capacity: 40, isAvailable: true, isAccessible: true },
  { id: 'room-7', name: 'Seminar Room 201', building: 'Academic Block B', capacity: 45, isAvailable: true, isAccessible: true },
  { id: 'room-8', name: 'Seminar Room 202', building: 'Academic Block B', capacity: 45, isAvailable: true, isAccessible: true },
  { id: 'room-9', name: 'Moot Court 1', building: 'Faculty of Law', capacity: 80, isAvailable: true, isAccessible: true },
  { id: 'room-10', name: 'Moot Court 2', building: 'Faculty of Law', capacity: 80, isAvailable: true, isAccessible: true },
  { id: 'room-11', name: 'Innovation Lab 1', building: 'Technology Center', capacity: 35, isAvailable: true, isAccessible: true },
  { id: 'room-12', name: 'Innovation Lab 2', building: 'Technology Center', capacity: 35, isAvailable: true, isAccessible: true },
  { id: 'room-13', name: 'Executive Suite 301', building: 'Main Tower', capacity: 30, isAvailable: true, isAccessible: true },
  { id: 'room-14', name: 'Executive Suite 302', building: 'Main Tower', capacity: 30, isAvailable: true, isAccessible: true },
  { id: 'room-15', name: 'Conference Room 4A', building: 'Main Tower', capacity: 50, isAvailable: true, isAccessible: true },
  { id: 'room-16', name: 'Conference Room 4B', building: 'Main Tower', capacity: 50, isAvailable: true, isAccessible: true }
];

export const SEED_MOTIONS: Motion[] = [
  {
    id: 'motion-1',
    text: 'This House would establish a single African Central Bank and unified digital currency for the AfCFTA region.',
    infoSlide: 'The African Continental Free Trade Area (AfCFTA) represents a single market of 1.3 billion people. Various pilot settlement systems (such as PAPSS) have been introduced to settle cross-border trade in local currencies.',
    category: 'AFRICAN_AFFAIRS',
    sourceOrAuthor: 'Chief Adjudication Panel (EAUDC 2026)',
    difficulty: 'STANDARD',
    assignedRoundNumber: 1,
    isReleased: true,
    releasedAt: '2026-08-25T09:00:00Z'
  },
  {
    id: 'motion-2',
    text: 'This House believes that developing nations should prioritize investment in state-owned AI infrastructure over international cloud service subsidies.',
    infoSlide: 'Sovereign AI initiatives involve governments funding domestic computing clusters, data centers, and localized foundational models.',
    category: 'SCIENCE_TECH',
    sourceOrAuthor: 'Adjudication Core',
    difficulty: 'STANDARD',
    assignedRoundNumber: 2,
    isReleased: true,
    releasedAt: '2026-08-25T11:30:00Z'
  },
  {
    id: 'motion-3',
    text: 'This House supports mandatory climate loss-and-damage restitution levied directly on multinational fossil fuel extraction firms operating in the Global South.',
    infoSlide: 'Under proposed international environmental justice frameworks, direct corporate accountability mechanisms would bypass sovereign government negotiations.',
    category: 'ECONOMICS',
    sourceOrAuthor: 'Chief Adjudication Panel',
    difficulty: 'CHALLENGING',
    assignedRoundNumber: 3,
    isReleased: true,
    releasedAt: '2026-08-25T14:30:00Z'
  },
  {
    id: 'motion-4',
    text: 'This House would condition international development loans on the eradication of intellectual property barriers for essential biomedical patents.',
    infoSlide: 'During global health emergencies and persistent regional epidemics, technology transfer mandates often clash with pharmaceutical patent protections.',
    category: 'INTERNATIONAL_RELATIONS',
    sourceOrAuthor: 'DCA Team (Rwanda / Kenya)',
    difficulty: 'STANDARD',
    assignedRoundNumber: 4,
    isReleased: true,
    releasedAt: '2026-08-26T09:15:00Z'
  },
  {
    id: 'motion-5',
    text: 'This House regrets the dominance of meritocratic testing frameworks in university admissions across Sub-Saharan Africa.',
    infoSlide: 'Meritocratic examinations assess standardized performance but have been scrutinized for amplifying socio-economic disparities between urban and rural secondary schools.',
    category: 'EDUCATION',
    sourceOrAuthor: 'Chief Adjudication Panel',
    difficulty: 'STANDARD',
    assignedRoundNumber: 5,
    isReleased: false
  },
  {
    id: 'motion-6',
    text: 'This House, as the African Union, would impose direct economic sanctions on member states that unconstitutionally amend presidential term limits.',
    category: 'AFRICAN_AFFAIRS',
    sourceOrAuthor: 'Adjudication Core',
    difficulty: 'CHALLENGING',
    assignedRoundNumber: 6,
    isReleased: false
  }
];

export function createInitialSeedTournament(): Tournament {
  // Generate 16 balanced teams representing top East African institutions
  const rawTeamData = [
    { name: 'UR Kigali Titans', inst: SEED_INSTITUTIONS[0], code: 'UR-A', cat: 'OPEN', wins: 3, points: 684.5, s1: 'Jean-Paul Mugisha', s2: 'Aline Uwase', s3: 'Kevin Habimana' },
    { name: 'CMU Africa Alpha', inst: SEED_INSTITUTIONS[1], code: 'CMU-A', cat: 'OPEN', wins: 3, points: 681.0, s1: 'Tariq Nsubuga', s2: 'Blessing Okafor', s3: 'Farai Moyo' },
    { name: 'Makerere Guild A', inst: SEED_INSTITUTIONS[2], code: 'MAK-A', cat: 'OPEN', wins: 3, points: 679.5, s1: 'Emmanuel Kigozi', s2: 'Priscilla Namubiru', s3: 'Jonathan Alinda' },
    { name: 'Strathmore Gladiators', inst: SEED_INSTITUTIONS[3], code: 'STR-A', cat: 'OPEN', wins: 2, points: 676.0, s1: 'Wanjiku Mwangi', s2: 'Brian Kipchumba', s3: 'Samantha Ochieng' },
    { name: 'UDSM Mlimani Stars', inst: SEED_INSTITUTIONS[4], code: 'UDSM-A', cat: 'OPEN', wins: 2, points: 672.5, s1: 'Baraka Mwakio', s2: 'Neema Lyimo', s3: 'Hamisi Juma' },
    { name: 'ALU Innovators', inst: SEED_INSTITUTIONS[5], code: 'ALU-A', cat: 'OPEN', wins: 2, points: 670.0, s1: 'David Adebayo', s2: 'Zainab Touré', s3: 'Kofi Mensah' },
    { name: 'Kepler Champions', inst: SEED_INSTITUTIONS[6], code: 'KEP-A', cat: 'OPEN', wins: 2, points: 668.0, s1: 'Grace Mukamana', s2: 'Patrick Ndayisaba', s3: 'Diane Umutoni' },
    { name: 'CUEA Advocates', inst: SEED_INSTITUTIONS[7], code: 'CUEA-A', cat: 'OPEN', wins: 2, points: 665.5, s1: 'Dennis Mutua', s2: 'Faith Chebet', s3: 'Victor Ombati' },
    { name: 'Ashesi Pioneers', inst: SEED_INSTITUTIONS[8], code: 'ASH-A', cat: 'OPEN', wins: 2, points: 663.0, s1: 'Akosua Boakye', s2: 'Kwame Osei', s3: 'Esi Annan' },
    { name: 'UR Huye Scholars', inst: SEED_INSTITUTIONS[0], code: 'UR-B', cat: 'NOVICE', wins: 1, points: 659.0, s1: 'Eric Nshimiyimana', s2: 'Chantal Ishimwe', s3: 'Cedric Bizimana' },
    { name: 'MKU Kigali Vanguard', inst: SEED_INSTITUTIONS[9], code: 'MKU-A', cat: 'NOVICE', wins: 1, points: 654.0, s1: 'Moses Wafula', s2: 'Brenda Nyambura', s3: 'Geoffrey Otieno' },
    { name: 'Makerere Law Society', inst: SEED_INSTITUTIONS[2], code: 'MAK-B', cat: 'OPEN', wins: 1, points: 652.5, s1: 'Ronald Ssempijja', s2: 'Doreen Nalwanga', s3: 'Ivan Tumusiime' },
    { name: 'Strathmore Apex', inst: SEED_INSTITUTIONS[3], code: 'STR-B', cat: 'NOVICE', wins: 1, points: 649.0, s1: 'Stacy Wambui', s2: 'Collins Bett', s3: 'Ashley Nduta' },
    { name: 'ALU Eagles', inst: SEED_INSTITUTIONS[5], code: 'ALU-B', cat: 'NOVICE', wins: 1, points: 646.0, s1: 'Aboubakar Diallo', s2: 'Miriam Nyong\'o', s3: 'Thabo Ndlovu' },
    { name: 'UDSM Hillside', inst: SEED_INSTITUTIONS[4], code: 'UDSM-B', cat: 'NOVICE', wins: 0, points: 641.5, s1: 'Rashid Mtambo', s2: 'Asha Mbowe', s3: 'Salim Mkapa' },
    { name: 'CUEA Veritas', inst: SEED_INSTITUTIONS[7], code: 'CUEA-B', cat: 'NOVICE', wins: 0, points: 638.0, s1: 'George Wanyonyi', s2: 'Mercy Achieng', s3: 'Festus Kiptoo' }
  ];

  const teams: Team[] = rawTeamData.map((t, idx) => {
    const teamId = `team-${idx + 1}`;
    const speakers = [
      { id: `spk-${teamId}-1`, name: t.s1, teamId, institutionId: t.inst.id, category: t.cat as any, averageScore: Number((t.points / 9).toFixed(1)), totalPoints: Number((t.points / 3).toFixed(1)), roundsCount: 3 },
      { id: `spk-${teamId}-2`, name: t.s2, teamId, institutionId: t.inst.id, category: t.cat as any, averageScore: Number((t.points / 9).toFixed(1)), totalPoints: Number((t.points / 3).toFixed(1)), roundsCount: 3 },
      { id: `spk-${teamId}-3`, name: t.s3, teamId, institutionId: t.inst.id, category: t.cat as any, averageScore: Number((t.points / 9).toFixed(1)), totalPoints: Number((t.points / 3).toFixed(1)), roundsCount: 3 }
    ];

    return {
      id: teamId,
      name: t.name,
      code: t.code,
      institutionId: t.inst.id,
      institutionName: t.inst.name,
      speakers,
      status: 'CHECKED_IN',
      category: t.cat as any,
      wins: t.wins,
      losses: 3 - t.wins,
      totalSpeakerScore: t.points,
      netMargin: (t.wins - 1.5) * 12.4,
      govCount: idx % 2 === 0 ? 2 : 1,
      oppCount: idx % 2 === 0 ? 1 : 2,
      rank: idx + 1
    };
  });

  // Judges Pool with certified chairs, ratings, and realistic institutional conflicts
  const judges: Judge[] = [
    {
      id: 'judge-1',
      name: 'Dr. Jean-Claude Gasana',
      institutionId: 'inst-ur',
      institutionName: 'University of Rwanda',
      rating: 9.5,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'gasana.jc@ur.ac.rw',
      experienceLevel: 'CHIEF_ADJ',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-1', judgeId: 'judge-1', targetType: 'INSTITUTION', targetId: 'inst-ur', targetName: 'University of Rwanda', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-2',
      name: 'Brenda Kwamboka',
      institutionId: 'inst-strath',
      institutionName: 'Strathmore University',
      rating: 9.2,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'bkwamboka@strathmore.edu',
      experienceLevel: 'SENIOR',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-2', judgeId: 'judge-2', targetType: 'INSTITUTION', targetId: 'inst-strath', targetName: 'Strathmore University', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-3',
      name: 'Titus Muhereza',
      institutionId: 'inst-mak',
      institutionName: 'Makerere University',
      rating: 8.8,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'titus.m@mak.ac.ug',
      experienceLevel: 'SENIOR',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-3', judgeId: 'judge-3', targetType: 'INSTITUTION', targetId: 'inst-mak', targetName: 'Makerere University', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-4',
      name: 'Amina Selemani',
      institutionId: 'inst-udsm',
      institutionName: 'University of Dar es Salaam',
      rating: 8.5,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'amina.selemani@udsm.ac.tz',
      experienceLevel: 'EXPERIENCED',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-4', judgeId: 'judge-4', targetType: 'INSTITUTION', targetId: 'inst-udsm', targetName: 'University of Dar es Salaam', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-5',
      name: 'Fikru Wolde',
      institutionId: 'inst-cmua',
      institutionName: 'Carnegie Mellon University Africa',
      rating: 8.4,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'fwolde@andrew.cmu.edu',
      experienceLevel: 'EXPERIENCED',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-5', judgeId: 'judge-5', targetType: 'INSTITUTION', targetId: 'inst-cmua', targetName: 'Carnegie Mellon University Africa', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-6',
      name: 'Christelle Umurerwa',
      institutionId: 'inst-alu',
      institutionName: 'African Leadership University',
      rating: 8.0,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'cumurerwa@alueducation.com',
      experienceLevel: 'EXPERIENCED',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-6', judgeId: 'judge-6', targetType: 'INSTITUTION', targetId: 'inst-alu', targetName: 'African Leadership University', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-7',
      name: 'Peter Gitau',
      institutionId: 'inst-cuea',
      institutionName: 'Catholic University of Eastern Africa',
      rating: 7.8,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'pgitau@cuea.edu',
      experienceLevel: 'EXPERIENCED',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-7', judgeId: 'judge-7', targetType: 'INSTITUTION', targetId: 'inst-cuea', targetName: 'Catholic University of Eastern Africa', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-8',
      name: 'Kofi Asare',
      institutionId: 'inst-ashesi',
      institutionName: 'Ashesi University',
      rating: 7.9,
      isChairAccredited: true,
      status: 'CHECKED_IN',
      email: 'kasare@ashesi.edu.gh',
      experienceLevel: 'EXPERIENCED',
      roundsJudged: 3,
      conflicts: [
        { id: 'conf-8', judgeId: 'judge-8', targetType: 'INSTITUTION', targetId: 'inst-ashesi', targetName: 'Ashesi University', conflictType: 'INSTITUTIONAL' }
      ]
    },
    {
      id: 'judge-9',
      name: 'Sandrine Kayitesi',
      institutionId: 'inst-kepler',
      institutionName: 'Kepler College',
      rating: 7.2,
      isChairAccredited: false,
      status: 'CHECKED_IN',
      email: 'skayitesi@kepler.org',
      experienceLevel: 'TRAINEE',
      roundsJudged: 2,
      conflicts: []
    },
    {
      id: 'judge-10',
      name: 'Eric Nkurunziza',
      institutionId: 'inst-mku',
      institutionName: 'Mount Kenya University Rwanda',
      rating: 7.1,
      isChairAccredited: false,
      status: 'CHECKED_IN',
      email: 'eric.n@mku.ac.ke',
      experienceLevel: 'TRAINEE',
      roundsJudged: 2,
      conflicts: []
    }
  ];

  // Helper to create Round 4 debates
  // Round 4 is the live active round in progress!
  const round4Debates: any[] = [
    {
      id: 'match-r4-1',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[0],
      governmentTeam: teams[0], // UR Titans (3-0)
      oppositionTeam: teams[1], // CMU Alpha (3-0)
      chairJudge: judges[1], // Brenda Kwamboka (Strathmore)
      panelistJudges: [],
      traineeJudges: [judges[8]],
      motion: SEED_MOTIONS[3],
      status: 'IN_PROGRESS',
      ballots: [
        {
          id: 'ballot-r4-1',
          debateId: 'match-r4-1',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[1].id,
          judgeName: judges[1].name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: [
            { speakerId: teams[0].speakers[0].id, speakerName: teams[0].speakers[0].name, role: 'PROP_1', score: 76 },
            { speakerId: teams[0].speakers[1].id, speakerName: teams[0].speakers[1].name, role: 'PROP_2', score: 75 },
            { speakerId: teams[0].speakers[2].id, speakerName: teams[0].speakers[2].name, role: 'PROP_3', score: 77 },
            { speakerId: teams[0].speakers[0].id, speakerName: teams[0].speakers[0].name, role: 'PROP_REPLY', score: 38 }
          ],
          oppScores: [
            { speakerId: teams[1].speakers[0].id, speakerName: teams[1].speakers[0].name, role: 'OPP_1', score: 75 },
            { speakerId: teams[1].speakers[1].id, speakerName: teams[1].speakers[1].name, role: 'OPP_2', score: 76 },
            { speakerId: teams[1].speakers[2].id, speakerName: teams[1].speakers[2].name, role: 'OPP_3', score: 76 },
            { speakerId: teams[1].speakers[1].id, speakerName: teams[1].speakers[1].name, role: 'OPP_REPLY', score: 37.5 }
          ],
          totalPropScore: 266,
          totalOppScore: 264.5,
          feedback: ''
        }
      ]
    },
    {
      id: 'match-r4-2',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[1],
      governmentTeam: teams[2], // Makerere Guild A (3-0)
      oppositionTeam: teams[3], // Strathmore Gladiators (2-1)
      chairJudge: judges[0], // Dr. Jean-Claude Gasana (UR)
      panelistJudges: [],
      traineeJudges: [],
      motion: SEED_MOTIONS[3],
      status: 'IN_PROGRESS',
      ballots: [
        {
          id: 'ballot-r4-2',
          debateId: 'match-r4-2',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[0].id,
          judgeName: judges[0].name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: [],
          oppScores: [],
          totalPropScore: 0,
          totalOppScore: 0
        }
      ]
    },
    {
      id: 'match-r4-3',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[2],
      governmentTeam: teams[4], // UDSM Mlimani Stars (2-1)
      oppositionTeam: teams[5], // ALU Innovators (2-1)
      chairJudge: judges[7], // Kofi Asare (Ashesi)
      panelistJudges: [],
      traineeJudges: [],
      motion: SEED_MOTIONS[3],
      status: 'BALLOTS_SUBMITTED',
      ballots: [
        {
          id: 'ballot-r4-3',
          debateId: 'match-r4-3',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[7].id,
          judgeName: judges[7].name,
          isChair: true,
          status: 'SUBMITTED',
          winnerSide: 'OPPOSITION',
          winnerTeamId: teams[5].id,
          propScores: [
            { speakerId: teams[4].speakers[0].id, speakerName: teams[4].speakers[0].name, role: 'PROP_1', score: 74 },
            { speakerId: teams[4].speakers[1].id, speakerName: teams[4].speakers[1].name, role: 'PROP_2', score: 75 },
            { speakerId: teams[4].speakers[2].id, speakerName: teams[4].speakers[2].name, role: 'PROP_3', score: 73 },
            { speakerId: teams[4].speakers[0].id, speakerName: teams[4].speakers[0].name, role: 'PROP_REPLY', score: 37 }
          ],
          oppScores: [
            { speakerId: teams[5].speakers[0].id, speakerName: teams[5].speakers[0].name, role: 'OPP_1', score: 76 },
            { speakerId: teams[5].speakers[1].id, speakerName: teams[5].speakers[1].name, role: 'OPP_2', score: 76 },
            { speakerId: teams[5].speakers[2].id, speakerName: teams[5].speakers[2].name, role: 'OPP_3', score: 75 },
            { speakerId: teams[5].speakers[0].id, speakerName: teams[5].speakers[0].name, role: 'OPP_REPLY', score: 38 }
          ],
          totalPropScore: 259,
          totalOppScore: 265,
          feedback: 'Opposition demonstrated clear comparative analysis on technological absorption capacity.',
          submittedAt: '2026-08-26T10:45:00Z'
        }
      ]
    },
    {
      id: 'match-r4-4',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[3],
      governmentTeam: teams[6], // Kepler Champions (2-1)
      oppositionTeam: teams[7], // CUEA Advocates (2-1)
      chairJudge: judges[4], // Fikru Wolde (CMU-A)
      panelistJudges: [],
      traineeJudges: [],
      motion: SEED_MOTIONS[3],
      status: 'IN_PROGRESS',
      ballots: [
        {
          id: 'ballot-r4-4',
          debateId: 'match-r4-4',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[4].id,
          judgeName: judges[4].name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: [],
          oppScores: [],
          totalPropScore: 0,
          totalOppScore: 0
        }
      ]
    },
    {
      id: 'match-r4-5',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[4],
      governmentTeam: teams[8], // Ashesi Pioneers (2-1)
      oppositionTeam: teams[9], // UR Huye (1-2)
      chairJudge: judges[2], // Titus Muhereza (Makerere)
      panelistJudges: [],
      traineeJudges: [],
      motion: SEED_MOTIONS[3],
      status: 'IN_PROGRESS',
      ballots: [
        {
          id: 'ballot-r4-5',
          debateId: 'match-r4-5',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[2].id,
          judgeName: judges[2].name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: [],
          oppScores: [],
          totalPropScore: 0,
          totalOppScore: 0
        }
      ]
    },
    {
      id: 'match-r4-6',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[5],
      governmentTeam: teams[10], // MKU Vanguard (1-2)
      oppositionTeam: teams[11], // Makerere Law (1-2)
      chairJudge: judges[5], // Christelle Umurerwa (ALU)
      panelistJudges: [],
      traineeJudges: [],
      motion: SEED_MOTIONS[3],
      status: 'IN_PROGRESS',
      ballots: [
        {
          id: 'ballot-r4-6',
          debateId: 'match-r4-6',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[5].id,
          judgeName: judges[5].name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: [],
          oppScores: [],
          totalPropScore: 0,
          totalOppScore: 0
        }
      ]
    },
    {
      id: 'match-r4-7',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[6],
      governmentTeam: teams[12], // Strathmore Apex (1-2)
      oppositionTeam: teams[13], // ALU Eagles (1-2)
      chairJudge: judges[3], // Amina Selemani (UDSM)
      panelistJudges: [],
      traineeJudges: [],
      motion: SEED_MOTIONS[3],
      status: 'IN_PROGRESS',
      ballots: [
        {
          id: 'ballot-r4-7',
          debateId: 'match-r4-7',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[3].id,
          judgeName: judges[3].name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: [],
          oppScores: [],
          totalPropScore: 0,
          totalOppScore: 0
        }
      ]
    },
    {
      id: 'match-r4-8',
      roundId: 'round-4',
      roundNumber: 4,
      room: SEED_ROOMS[7],
      governmentTeam: teams[14], // UDSM Hillside (0-3)
      oppositionTeam: teams[15], // CUEA Veritas (0-3)
      chairJudge: judges[6], // Peter Gitau (CUEA) -> Notice: Institutional clash exception
      panelistJudges: [],
      traineeJudges: [],
      motion: SEED_MOTIONS[3],
      status: 'IN_PROGRESS',
      hasWarning: true,
      warningReasons: ['Chair Peter Gitau has institutional affiliation with CUEA Veritas'],
      ballots: [
        {
          id: 'ballot-r4-8',
          debateId: 'match-r4-8',
          roundId: 'round-4',
          roundNumber: 4,
          judgeId: judges[6].id,
          judgeName: judges[6].name,
          isChair: true,
          status: 'PENDING',
          winnerSide: null,
          winnerTeamId: null,
          propScores: [],
          oppScores: [],
          totalPropScore: 0,
          totalOppScore: 0
        }
      ]
    }
  ];

  const rounds: Round[] = [
    {
      id: 'round-1',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 1,
      name: 'Round 1 (Preliminary)',
      type: 'PRELIMINARY',
      status: 'COMPLETED',
      motionId: 'motion-1',
      motion: SEED_MOTIONS[0],
      motionReleased: true,
      drawReleased: true,
      resultsReleased: true,
      startTime: '2026-08-25T09:00:00Z',
      endTime: '2026-08-25T11:00:00Z',
      ballotsCount: 8,
      submittedBallotsCount: 8,
      debates: []
    },
    {
      id: 'round-2',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 2,
      name: 'Round 2 (Preliminary)',
      type: 'PRELIMINARY',
      status: 'COMPLETED',
      motionId: 'motion-2',
      motion: SEED_MOTIONS[1],
      motionReleased: true,
      drawReleased: true,
      resultsReleased: true,
      startTime: '2026-08-25T11:30:00Z',
      endTime: '2026-08-25T13:30:00Z',
      ballotsCount: 8,
      submittedBallotsCount: 8,
      debates: []
    },
    {
      id: 'round-3',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 3,
      name: 'Round 3 (Preliminary)',
      type: 'PRELIMINARY',
      status: 'COMPLETED',
      motionId: 'motion-3',
      motion: SEED_MOTIONS[2],
      motionReleased: true,
      drawReleased: true,
      resultsReleased: true,
      startTime: '2026-08-25T14:30:00Z',
      endTime: '2026-08-25T16:30:00Z',
      ballotsCount: 8,
      submittedBallotsCount: 8,
      debates: []
    },
    {
      id: 'round-4',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 4,
      name: 'Round 4 (Preliminary)',
      type: 'PRELIMINARY',
      status: 'IN_PROGRESS',
      motionId: 'motion-4',
      motion: SEED_MOTIONS[3],
      motionReleased: true,
      drawReleased: true,
      resultsReleased: false,
      startTime: '2026-08-26T09:15:00Z',
      ballotsCount: 8,
      submittedBallotsCount: 1,
      debates: round4Debates
    },
    {
      id: 'round-5',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 5,
      name: 'Round 5 (Preliminary - Silent Round)',
      type: 'PRELIMINARY',
      status: 'DRAFT',
      motionId: 'motion-5',
      motion: SEED_MOTIONS[4],
      motionReleased: false,
      drawReleased: false,
      resultsReleased: false,
      ballotsCount: 8,
      submittedBallotsCount: 0,
      debates: []
    },
    {
      id: 'round-6',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 6,
      name: 'Quarterfinals (Break of 8)',
      type: 'QUARTERFINALS',
      status: 'DRAFT',
      motionReleased: false,
      drawReleased: false,
      resultsReleased: false,
      ballotsCount: 4,
      submittedBallotsCount: 0,
      debates: []
    },
    {
      id: 'round-7',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 7,
      name: 'Semifinals',
      type: 'SEMIFINALS',
      status: 'DRAFT',
      motionReleased: false,
      drawReleased: false,
      resultsReleased: false,
      ballotsCount: 2,
      submittedBallotsCount: 0,
      debates: []
    },
    {
      id: 'round-8',
      tournamentId: 'tourn-eaudc-2026',
      roundNumber: 8,
      name: 'Grand Final',
      type: 'GRAND_FINAL',
      status: 'DRAFT',
      motionReleased: false,
      drawReleased: false,
      resultsReleased: false,
      ballotsCount: 1,
      submittedBallotsCount: 0,
      debates: []
    }
  ];

  const announcements: Announcement[] = [
    {
      id: 'ann-1',
      tournamentId: 'tourn-eaudc-2026',
      title: 'Round 4 Draw & Motion Officially Released',
      content: 'Round 4 preliminary debates have commenced. Debaters and judges should report promptly to designated rooms. Prep time is 15 minutes.',
      priority: 'URGENT',
      targetAudience: 'ALL',
      createdAt: '2026-08-26T09:15:00Z',
      authorName: 'Tab Director'
    },
    {
      id: 'ann-2',
      tournamentId: 'tourn-eaudc-2026',
      title: 'Adjudication Briefing on WSDC Reply Scoring Norms',
      content: 'Please ensure reply speeches are strictly marked between 30 and 40 points, reflecting strategic comparative summary and framing.',
      priority: 'NORMAL',
      targetAudience: 'JUDGES',
      createdAt: '2026-08-25T08:30:00Z',
      authorName: 'Chief Adjudicator'
    },
    {
      id: 'ann-3',
      tournamentId: 'tourn-eaudc-2026',
      title: 'Welcome to Kigali — EAUDC 2026 Opening Protocol',
      content: 'Welcome all 32 participating delegations from across Rwanda, Kenya, Uganda, Tanzania, and Ghana to Kigali Convention Center.',
      priority: 'NORMAL',
      targetAudience: 'PUBLIC',
      createdAt: '2026-08-25T08:00:00Z',
      authorName: 'Tournament Director'
    }
  ];

  const auditLogs: AuditLogEntry[] = [
    {
      id: 'audit-1',
      tournamentId: 'tourn-eaudc-2026',
      actorName: 'Alice Mugisha (Tab Director)',
      actorRole: 'TAB_DIRECTOR',
      action: 'GENERATED_ROUND_PAIRINGS',
      entityType: 'DRAW',
      entityId: 'round-4',
      newValue: 'Generated 8 Swiss power-bracket pairings with side balancing',
      timestamp: '2026-08-26T09:05:12Z',
      severity: 'INFO'
    },
    {
      id: 'audit-2',
      tournamentId: 'tourn-eaudc-2026',
      actorName: 'Dr. Jean-Claude Gasana (Adj Core)',
      actorRole: 'ADJ_CORE',
      action: 'ALLOCATED_PANEL_JUDGES',
      entityType: 'JUDGE_ALLOCATION',
      entityId: 'round-4',
      newValue: 'Auto-allocated 8 accredited chairs; 1 institutional notice logged for Match 8',
      reason: 'Low pool of non-conflicted regional judges for CUEA Veritas match',
      timestamp: '2026-08-26T09:10:45Z',
      severity: 'WARNING'
    },
    {
      id: 'audit-3',
      tournamentId: 'tourn-eaudc-2026',
      actorName: 'Alice Mugisha (Tab Director)',
      actorRole: 'TAB_DIRECTOR',
      action: 'RELEASED_ROUND_DRAW',
      entityType: 'ROUND',
      entityId: 'round-4',
      newValue: 'Draw and Motion released publicly to portal and participant dashboard',
      timestamp: '2026-08-26T09:15:00Z',
      severity: 'INFO'
    },
    {
      id: 'audit-4',
      tournamentId: 'tourn-eaudc-2026',
      actorName: 'Kofi Asare (Chair Judge)',
      actorRole: 'JUDGE',
      action: 'SUBMITTED_DIGITAL_BALLOT',
      entityType: 'BALLOT',
      entityId: 'ballot-r4-3',
      newValue: 'Opposition Win (ALU Innovators: 265 pts, UDSM Mlimani: 259 pts)',
      timestamp: '2026-08-26T10:45:10Z',
      severity: 'INFO'
    }
  ];

  return {
    id: 'tourn-eaudc-2026',
    organizationId: 'org-aspire-rwanda',
    organizationName: 'Aspire Debate Rwanda / East African Circuit',
    name: 'EAUDC Kigali 2026 — East African Universities Debating Championship',
    slug: 'eaudc-kigali-2026',
    description: 'The premier championship uniting university debaters and adjudicators across East and Central Africa in Kigali, Rwanda.',
    format: 'WSDC',
    venue: 'Kigali Convention Hub & University of Rwanda Campus',
    city: 'Kigali',
    country: 'Rwanda',
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    status: 'IN_PROGRESS',
    currentRoundNumber: 4,
    settings: {
      format: 'WSDC',
      teamSize: 3,
      speakersPerTeam: 3,
      hasReplySpeech: true,
      minSpeakerScore: 60,
      maxSpeakerScore: 80,
      minReplyScore: 30,
      maxReplyScore: 40,
      prelimRoundsCount: 5,
      breakSize: 8,
      sideBalanceEnforced: true,
      allowSelfJudgeConflict: false,
      preventSameInstitutionMatch: true,
      preventRepeatMatchups: true,
      isPublicResults: true,
      isPublicDraw: true,
      isPublicStandings: true,
      motionPrepTimeMinutes: 15
    },
    teams,
    judges,
    rooms: SEED_ROOMS,
    rounds,
    motions: SEED_MOTIONS,
    announcements,
    institutions: SEED_INSTITUTIONS,
    auditLogs,
    contactEmail: 'tabulation@eaudc2026.org'
  };
}
