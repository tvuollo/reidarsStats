export type NumericString = `${number}`
export type MaybeNumeric = number | NumericString
export type Nullable<T> = T | null

export interface SeasonPlayer {
  PersonID: string
  LastName: string
  FirstName: string
  Name?: string
  JerseyNr?: Nullable<string>
  Jersey?: string
  RoleName?: string
  RoleID?: number
  GameRole?: string
  TeamID?: string
  PlayerID?: string
}

export interface SeasonContactPerson {
  LastName: string
  FirstName: string
  RoleName: string
}

export interface SeasonStatGroup {
  StatGroupID: NumericString
  StatGroupName: string
  LevelID: NumericString
  AreaID: NumericString
  SerieID?: NumericString
}

export interface SeasonGame {
  GameID: NumericString
  GameDate: string
  GameStatus: Nullable<MaybeNumeric>
  GameStatusType?: string
  FinishedType: Nullable<NumericString>
  HomeTeamID: NumericString
  AwayTeamID: NumericString
  HomeTeamName?: string
  AwayTeamName?: string
  HomeGoals: NumericString
  AwayGoals: NumericString
  HomeTeamScore?: NumericString
  AwayTeamScore?: NumericString
  StatGroupID: NumericString
  LevelID: NumericString
  AreaID?: NumericString
  SerieID?: NumericString
  HomeTeamAbbreviation: string
  AwayTeamAbbreviation: string
  ResultEnabled: number
  ReportEnabled: number
}

export interface SeasonStandingTeam {
  UniqueID?: NumericString
  ID?: NumericString
  TeamID: NumericString
  StatGroupID: NumericString
  TeamName?: string
  Games: NumericString
  Wins?: NumericString
  Won?: NumericString
  OtWins?: NumericString
  WonOvertime?: NumericString
  Ties?: NumericString
  Draw?: NumericString
  OtLooses?: NumericString
  LostOvertime?: NumericString
  Looses?: NumericString
  Lost?: NumericString
  ConWon?: NumericString
  ConTied?: NumericString
  ConLost?: NumericString
  GoalsFor: NumericString
  GoalsAgainst: NumericString
  GoalDiff: NumericString
  PenaltyMinutes: Nullable<NumericString>
  PenaltyShotWon?: NumericString
  PenaltyShotLost?: NumericString
  PenaltyShotTotal?: NumericString
  Points: NumericString
  Ranking: NumericString
  SeasonID: Nullable<NumericString>
  Season?: string
  PointsPerGame?: NumericString
  PointsPerGames?: NumericString
  TeamAbbreviation?: string
  TeamAbbrv?: string
  AreaID?: NumericString
  AreaName?: string
  LevelID?: NumericString
  LevelName?: string
  SerieID?: NumericString
  SerieName?: string
  SubSerieID?: NumericString
}

export interface SeasonStandingGroup {
  StatGroupID: NumericString
  StatGroupName: string
  PointRules: string | number
  LevelID: NumericString
  WinPoints: NumericString
  Teams: SeasonStandingTeam[]
  StandingLines?: unknown[]
}

export interface SeasonTopScorer {
  StatGroupID?: NumericString
  SerieID?: NumericString
  PlayerID?: NumericString
  TeamID?: NumericString
  HomeGoals?: NumericString
  AwayGoals?: NumericString
  HomeAssists?: NumericString
  AwayAssists?: NumericString
  PersonID: string
  LastName: string
  FirstName: string
  Name?: string
  Goals: number
  Assists: number
  Points: number
}

export type SeasonAssociationTeam = Record<string, unknown>

export interface SeasonData {
  Players: SeasonPlayer[]
  ContactPersons: SeasonContactPerson[]
  StatGroups: SeasonStatGroup[]
  Games: SeasonGame[]
  Standings: SeasonStandingGroup[]
  TopScorers: SeasonTopScorer[]
  AssociationTeams: SeasonAssociationTeam[]
  StandingsEnabled: number
  TopScorersEnabled: number
}
