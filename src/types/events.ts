export interface EventLanguage {
  Langname: string
  Flag: string
  FlagPath: string
}

export interface EventGameTeam {
  Name: string
  Goals: number
  Image: string
  Id: number
}

export interface EventGameInfo {
  Id: number
  StatGroupName: string
  LevelName: string
  LevelID: string
  StartDate: string
  StartTime: string
  GameTime: number
  Arena: string
  RinkLatitude: string
  RinkLongitude: string
  LiveURL: string
  LiveFeedSource: string
  OnlyStreamStorage: string
  Spectators: number
  HomeTeam: EventGameTeam
  AwayTeam: EventGameTeam
  GameStatus: number
  FinishedType: number
  GameRules: string
  Lang: EventLanguage[]
}

export interface EventGameLog {
  Type: string
  TeamId: number
  Period: number
  GameTime: number
  Name?: string
  Jersey?: number
  PlayerLinkID?: number | string
  ScorerLinkID?: number | string
  Ass1LinkID?: number | string
  Ass2LinkID?: number | string
  SufferLinkID?: number | string
  Key?: string
  Plus?: string
  Minus?: string
  HomeTeamGoals?: number
  AwayTeamGoals?: number
  GoalType?: string
  GoalSpecialTypeFI?: string
  GoalSpecialTypeEN?: string
  ScorerJersey?: number
  ScorerName?: string
  FirstAssistJersey?: number
  FirstAssistName?: string
  SecondAssistJersey?: number
  SecondAssistName?: string
  PenaltyMinutes?: string
  PenaltyMinutesNumber?: string
  PenaltyReasonsFI?: string
  PenaltyReasonsEN?: string
  PenaltyReasonsAbbreviation?: string
  PenaltyFaultCodes?: number
  PenaltyLField?: string
  SuffererJersey?: number
  SuffererNames?: string
  GoalkeeperJersey?: number
  GoalkeeperName?: string
  PreviousGoalkeeperJersey?: number
  PreviousGoalkeeperName?: string
  PreviousPlayerLinkID?: string
}

export interface EventReferee {
  RefereeName: string
  RefereeRole: string
}

export interface EventPeriodGoals {
  Goals: string
}

export interface EventPeriodPowerPlayGoals {
  PPGoals: string
}

export interface EventPeriodPowerPlayMinutes {
  PPMins: string
}

export interface EventPeriodPenaltyMinutes {
  PenMins: string
}

export interface EventPeriodShortHandedGoals {
  SHGoals: string
}

export interface EventPeriodSaves {
  Saves: string
}

export interface EventPeriodSummary {
  PlayedPeriods: string
  PeriodGoals: EventPeriodGoals[]
  PeriodPPGoals: EventPeriodPowerPlayGoals[]
  PeriodPPMins: EventPeriodPowerPlayMinutes[]
  PeriodPenMins: EventPeriodPenaltyMinutes[]
  PeriodSHGoals: EventPeriodShortHandedGoals[]
  PeriodSaves: EventPeriodSaves[]
}

export interface EventGoalkeeperOut {
  Time: string
}

export interface EventGoalkeeperSave {
  Saves: string
}

export interface EventTeamGoalkeeper {
  PlayerLinkID: string
  GkJersey: number
  GkName: string
  GkChanges: unknown[]
  GkOut: EventGoalkeeperOut[]
  GkSaves: EventGoalkeeperSave[]
}

export interface EventGoalkeeperSummary {
  TeamName: string
  TeamGoalkeepers: EventTeamGoalkeeper[]
}

export interface EventWinningShot {
  [key: string]: unknown
}

export interface EventGameRecord {
  GamesUpdate: EventGameInfo[]
  GameLogsUpdate: EventGameLog[]
  WinningShots: EventWinningShot[]
  Referees: EventReferee[]
  PeriodSummary: EventPeriodSummary
  GoalkeeperSummary: EventGoalkeeperSummary[]
}
