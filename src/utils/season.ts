import type {
  SeasonData,
  SeasonGame,
  SeasonStandingTeam,
  SeasonTopScorer,
} from '../types/season'

export interface SeasonValidationResult {
  seasonKey: string
  valid: boolean
  errors: string[]
}

export interface TeamTotals {
  games: number
  wins: number
  ties: number
  otWins: number
  otLosses: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export interface TeamStatGroupBreakdown {
  seasonKey: string
  statGroupId: string
  statGroupName: string
  year: number | null
  totals: TeamTotals
}

export interface TeamTotalsSummary {
  teamId: string
  teamAbbreviation: string
  seasonsMatched: number
  rowsMatched: number
  totals: TeamTotals
  byStatGroup: TeamStatGroupBreakdown[]
}

export interface TeamStatGroupDetail {
  seasonKey: string
  statGroupId: string
  statGroupName: string
  levelId: string
  areaId: string | null
  totals: TeamTotals
  standingRow: SeasonStandingTeam
  standings: SeasonStandingTeam[]
  topTeam: SeasonStandingTeam | null
  games: SeasonGame[]
  topScorers: SeasonTopScorer[]
}

interface SeasonDataset {
  seasonKey: string
  data: SeasonData
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

function asNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function gameDateSortableValue(gameDate: string): number {
  const value = gameDate.trim()
  const dotted = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value)
  if (dotted) {
    const day = Number(dotted[1])
    const month = Number(dotted[2])
    const year = Number(dotted[3])
    return year * 10000 + month * 100 + day
  }

  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? timestamp : Number.POSITIVE_INFINITY
}

function gameDateYear(gameDate: string): number | null {
  const value = gameDate.trim()
  const dotted = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value)
  if (dotted) {
    return Number(dotted[3])
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.getUTCFullYear()
}

function gameStatGroupId(game: SeasonGame): string {
  return game.StatGroupID || game.SerieID || ''
}

function gameBelongsToStatGroup(game: SeasonGame, statGroupId: string): boolean {
  return gameStatGroupId(game) === statGroupId
}

function teamWins(team: SeasonStandingTeam): number {
  return asNumber(team.Wins ?? team.Won)
}

function teamTies(team: SeasonStandingTeam): number {
  return asNumber(team.Ties ?? team.Draw)
}

function teamOtWins(team: SeasonStandingTeam): number {
  return asNumber(team.OtWins ?? team.WonOvertime)
}

function teamOtLosses(team: SeasonStandingTeam): number {
  return asNumber(team.OtLooses ?? team.LostOvertime)
}

function teamLosses(team: SeasonStandingTeam): number {
  return asNumber(team.Looses ?? team.Lost)
}

function teamAbbreviation(team: SeasonStandingTeam): string {
  return team.TeamAbbreviation ?? team.TeamAbbrv ?? ''
}

function teamRanking(team: SeasonStandingTeam): number {
  return asNumber(team.Ranking)
}

function sortStandingTeams(teams: SeasonStandingTeam[]): SeasonStandingTeam[] {
  const sorted = [...teams].sort((a, b) => {
    const aRank = teamRanking(a)
    const bRank = teamRanking(b)

    if (aRank > 0 && bRank > 0) {
      return aRank - bRank
    }

    if (aRank > 0) {
      return -1
    }

    if (bRank > 0) {
      return 1
    }

    const pointDiff = asNumber(b.Points) - asNumber(a.Points)
    if (pointDiff !== 0) {
      return pointDiff
    }

    const goalDiff = asNumber(b.GoalDiff) - asNumber(a.GoalDiff)
    if (goalDiff !== 0) {
      return goalDiff
    }

    return teamAbbreviation(a).localeCompare(teamAbbreviation(b))
  })

  return sorted
}

function isStaffPlayer(roleName?: string, roleId?: number): boolean {
  if (roleId === 100) {
    return true
  }

  if (!roleName) {
    return false
  }

  return roleName.toLowerCase().includes('toimihenkil')
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toUpperCase()
}

function splitSurnameFirstName(fullName: string): { firstName: string; lastName: string } {
  const value = fullName.trim()
  if (!value) {
    return { firstName: '', lastName: '' }
  }

  const parts = value.split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' }
  }

  return {
    lastName: parts[0],
    firstName: parts.slice(1).join(' '),
  }
}

function scorerDisplayNameParts(scorer: SeasonTopScorer): { firstName: string; lastName: string } {
  if (scorer.FirstName && scorer.LastName) {
    return { firstName: scorer.FirstName, lastName: scorer.LastName }
  }

  const source = scorer.Name || scorer.LastName || scorer.FirstName
  return splitSurnameFirstName(source ?? '')
}

function scorerIdentityName(scorer: SeasonTopScorer): string {
  const names = scorerDisplayNameParts(scorer)
  return normalizeName(`${names.lastName} ${names.firstName}`)
}

function playerIdentityName(name?: string, firstName?: string, lastName?: string): string {
  if (firstName || lastName) {
    return normalizeName(`${lastName ?? ''} ${firstName ?? ''}`)
  }

  return normalizeName(name ?? '')
}

function mergeScorerRows(current: SeasonTopScorer, incoming: SeasonTopScorer): SeasonTopScorer {
  const currentNames = scorerDisplayNameParts(current)
  const incomingNames = scorerDisplayNameParts(incoming)

  return {
    ...current,
    ...incoming,
    PersonID: current.PersonID || incoming.PersonID,
    PlayerID: current.PlayerID ?? incoming.PlayerID,
    FirstName: currentNames.firstName || incomingNames.firstName,
    LastName: currentNames.lastName || incomingNames.lastName,
    Name:
      current.Name ||
      incoming.Name ||
      `${currentNames.lastName} ${currentNames.firstName}`.trim() ||
      `${incomingNames.lastName} ${incomingNames.firstName}`.trim(),
    Goals: Math.max(current.Goals, incoming.Goals),
    Assists: Math.max(current.Assists, incoming.Assists),
    Points: Math.max(current.Points, incoming.Points),
  }
}

function deduplicateScorers(rows: SeasonTopScorer[]): SeasonTopScorer[] {
  const byKey = new Map<string, SeasonTopScorer>()
  const usedKeysByName = new Map<string, string>()

  for (const scorer of rows) {
    const idKey = scorer.PlayerID ? `player:${scorer.PlayerID}` : ''
    const nameKey = `name:${scorerIdentityName(scorer)}`
    const key = (idKey && byKey.has(idKey) ? idKey : '') || usedKeysByName.get(nameKey) || idKey || nameKey

    const existing = byKey.get(key)
    const merged = existing ? mergeScorerRows(existing, scorer) : mergeScorerRows(scorer, scorer)
    byKey.set(key, merged)

    if (idKey) {
      byKey.set(idKey, merged)
      usedKeysByName.set(nameKey, idKey)
    } else {
      usedKeysByName.set(nameKey, key)
    }
  }

  return [...new Set(byKey.values())]
}

function emptyTotals(): TeamTotals {
  return {
    games: 0,
    wins: 0,
    ties: 0,
    otWins: 0,
    otLosses: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  }
}

function totalsFromTeam(team: SeasonStandingTeam): TeamTotals {
  return {
    games: asNumber(team.Games),
    wins: teamWins(team),
    ties: teamTies(team),
    otWins: teamOtWins(team),
    otLosses: teamOtLosses(team),
    losses: teamLosses(team),
    goalsFor: asNumber(team.GoalsFor),
    goalsAgainst: asNumber(team.GoalsAgainst),
    goalDiff: asNumber(team.GoalDiff),
    points: asNumber(team.Points),
  }
}

export function getSeasonKeyFromPath(filePath: string): string {
  const parts = filePath.split('/')
  const filename = parts[parts.length - 1] ?? filePath
  return filename.replace('.json', '')
}

export function validateSeasonData(data: unknown, seasonKey: string): SeasonValidationResult {
  const errors: string[] = []

  if (!isRecord(data)) {
    return { seasonKey, valid: false, errors: ['Root value is not an object'] }
  }

  const arrayKeys: Array<keyof SeasonData> = [
    'Players',
    'ContactPersons',
    'StatGroups',
    'Games',
    'Standings',
    'TopScorers',
    'AssociationTeams',
  ]

  for (const key of arrayKeys) {
    if (!isArray(data[key])) {
      errors.push(`${key} is missing or not an array`)
    }
  }

  if (typeof data.StandingsEnabled !== 'number') {
    errors.push('StandingsEnabled is missing or not a number')
  }

  if (typeof data.TopScorersEnabled !== 'number') {
    errors.push('TopScorersEnabled is missing or not a number')
  }

  if (isArray(data.Standings)) {
    data.Standings.forEach((standing, index) => {
      if (!isRecord(standing)) {
        errors.push(`Standings[${index}] is not an object`)
        return
      }

      if (!isArray(standing.Teams)) {
        errors.push(`Standings[${index}].Teams is missing or not an array`)
      }
    })
  }

  return {
    seasonKey,
    valid: errors.length === 0,
    errors,
  }
}

export function calculateTeamTotalsAcrossSeasons(
  seasons: SeasonDataset[],
  teamId: string,
): TeamTotalsSummary {
  const globalTotals = emptyTotals()
  const byStatGroup: TeamStatGroupBreakdown[] = []
  const abbreviations = new Map<string, number>()
  const matchedSeasons = new Set<string>()

  for (const season of seasons) {
    for (const standing of season.data.Standings) {
      for (const team of standing.Teams) {
        if (team.TeamID !== teamId) {
          continue
        }

        matchedSeasons.add(season.seasonKey)
        const rowTotals = totalsFromTeam(team)

        byStatGroup.push({
          seasonKey: season.seasonKey,
          statGroupId: standing.StatGroupID,
          statGroupName: standing.StatGroupName,
          year: season.data.Games
            .filter((game) => gameBelongsToStatGroup(game, standing.StatGroupID))
            .sort((a, b) => gameDateSortableValue(a.GameDate) - gameDateSortableValue(b.GameDate))
            .map((game) => gameDateYear(game.GameDate))
            .find((year): year is number => year !== null) ?? null,
          totals: rowTotals,
        })

        globalTotals.games += rowTotals.games
        globalTotals.wins += rowTotals.wins
        globalTotals.ties += rowTotals.ties
        globalTotals.otWins += rowTotals.otWins
        globalTotals.otLosses += rowTotals.otLosses
        globalTotals.losses += rowTotals.losses
        globalTotals.goalsFor += rowTotals.goalsFor
        globalTotals.goalsAgainst += rowTotals.goalsAgainst
        globalTotals.goalDiff += rowTotals.goalDiff
        globalTotals.points += rowTotals.points

        const abbr = teamAbbreviation(team)
        if (abbr.length > 0) {
          abbreviations.set(abbr, (abbreviations.get(abbr) ?? 0) + 1)
        }
      }
    }
  }

  let mostCommonAbbreviation = ''
  let mostCommonCount = -1
  for (const [abbr, count] of abbreviations.entries()) {
    if (count > mostCommonCount) {
      mostCommonAbbreviation = abbr
      mostCommonCount = count
    }
  }

  byStatGroup.sort((a, b) => {
    const seasonCompare = a.seasonKey.localeCompare(b.seasonKey)
    if (seasonCompare !== 0) {
      return seasonCompare
    }

    return a.statGroupName.localeCompare(b.statGroupName)
  })

  return {
    teamId,
    teamAbbreviation: mostCommonAbbreviation,
    seasonsMatched: matchedSeasons.size,
    rowsMatched: byStatGroup.length,
    totals: globalTotals,
    byStatGroup,
  }
}

export function getTeamStatGroupDetail(
  seasons: SeasonDataset[],
  teamId: string,
  seasonKey: string,
  statGroupId: string,
): TeamStatGroupDetail | null {
  const season = seasons.find((item) => item.seasonKey === seasonKey)
  if (!season) {
    return null
  }

  const standing = season.data.Standings.find((item) => item.StatGroupID === statGroupId)
  const standingRow = standing?.Teams.find((team) => team.TeamID === teamId)
  if (!standing || !standingRow) {
    return null
  }

  const standings = sortStandingTeams(standing.Teams)
  const topTeam = standings[0] ?? null

  const totals = totalsFromTeam(standingRow)
  const games = season.data.Games.filter(
    (game) => gameBelongsToStatGroup(game, statGroupId) && (game.HomeTeamID === teamId || game.AwayTeamID === teamId),
  )
  const statGroup = season.data.StatGroups.find((item) => item.StatGroupID === statGroupId)
  const levelId = statGroup?.LevelID ?? standing.LevelID
  const areaId = statGroup?.AreaID ?? games.find((game) => typeof game.AreaID === 'string')?.AreaID ?? null

  const scorersFromData = season.data.TopScorers.filter((scorer) => {
    if (scorer.StatGroupID && scorer.StatGroupID !== statGroupId) {
      return false
    }

    return !scorer.TeamID || scorer.TeamID === teamId
  })

  const scorerMap = new Map<string, SeasonTopScorer>()
  const scorerPlayerIds = new Set<string>()
  const scorerNames = new Set<string>()
  for (const scorer of deduplicateScorers(scorersFromData)) {
    scorerMap.set(scorer.PersonID, scorer)
    if (scorer.PlayerID) {
      scorerPlayerIds.add(scorer.PlayerID)
    }
    scorerNames.add(scorerIdentityName(scorer))
  }

  const teamPlayers = season.data.Players.filter(
    (player) => player.TeamID === teamId && !isStaffPlayer(player.RoleName, player.RoleID),
  )

  for (const player of teamPlayers) {
    const playerName = playerIdentityName(player.Name, player.FirstName, player.LastName)
    if (
      scorerMap.has(player.PersonID) ||
      (player.PlayerID ? scorerPlayerIds.has(player.PlayerID) : false) ||
      scorerNames.has(playerName)
    ) {
      continue
    }

    const names =
      player.FirstName || player.LastName
        ? {
            firstName: player.FirstName ?? '',
            lastName: player.LastName ?? '',
          }
        : splitSurnameFirstName(player.Name ?? '')

    scorerMap.set(player.PersonID, {
      PersonID: player.PersonID,
      FirstName: names.firstName,
      LastName: names.lastName,
      Name: [names.firstName, names.lastName].filter(Boolean).join(' ').trim(),
      Goals: 0,
      Assists: 0,
      Points: 0,
    })
  }

  const allScorers = deduplicateScorers([...scorerMap.values()])
  const scorersWithPoints = allScorers
    .filter((scorer) => scorer.Points > 0 || scorer.Goals > 0 || scorer.Assists > 0)
    .sort((a, b) => b.Points - a.Points || b.Goals - a.Goals || b.Assists - a.Assists)

  const scorersWithoutPoints = allScorers
    .filter((scorer) => scorer.Points === 0 && scorer.Goals === 0 && scorer.Assists === 0)
    .sort((a, b) => {
      const aName = `${a.LastName} ${a.FirstName}`.trim()
      const bName = `${b.LastName} ${b.FirstName}`.trim()
      return aName.localeCompare(bName)
    })

  const topScorers = [...scorersWithPoints, ...scorersWithoutPoints]

  return {
    seasonKey,
    statGroupId,
    statGroupName: standing.StatGroupName,
    levelId,
    areaId,
    totals,
    standingRow,
    standings,
    topTeam,
    games,
    topScorers,
  }
}
