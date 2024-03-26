export interface SingleGameEvents {
  GamesUpdate: GamesUpdate[]
  GameLogsUpdate: GameLogsUpdate[]
  WinningShots: any[]
  Referees: Referee[]
  PeriodSummary: PeriodSummary
  GoalkeeperSummary: GoalkeeperSummary[]
}

export default SingleGameEvents;

export interface GamesUpdate {
  Id: number
  StatGroupName: string
  LevelName: string
  StartDate: string
  StartTime: string
  GameTime: number
  Arena: string
  LiveURL: string
  LiveFeedSource: string
  Spectators: number
  HomeTeam: HomeTeam
  AwayTeam: AwayTeam
  GameStatus: number
  FinishedType: number
  GameRules: string
  Lang: Lang[]
}

export interface HomeTeam {
  Name: string
  Goals: number
  Image: string
  Id: number
}

export interface AwayTeam {
  Name: string
  Goals: number
  Image: string
  Id: number
}

export interface Lang {
  Langname: string
  Flag: string
  FlagPath: string
}

export interface GameLogsUpdate {
  Type: string
  TeamId: number
  Period: number
  PlayerLinkID?: number
  GoalkeeperJersey?: number
  GoalkeeperName?: string
  PreviousGoalkeeperJersey?: number
  PreviousGoalkeeperName?: string
  GameTime: number
  ScorerLinkID?: number
  Ass1LinkID?: number
  Ass2LinkID?: number
  ScorerJersey?: number
  ScorerName?: string
  FirstAssistJersey?: number
  FirstAssistName?: string
  SecondAssistJersey?: number
  SecondAssistName?: string
  GoalType?: string
  GoalSpecialTypeFI?: string
  GoalSpecialTypeEN?: string
  Key?: string
  HomeTeamGoals?: number
  AwayTeamGoals?: number
  Plus?: string
  Minus?: string
  SufferLinkID?: number
  Jersey?: number
  Name?: string
  PenaltyMinutes?: string
  PenaltyMinutesNumber?: string
  SuffererJersey?: number
  SuffererNames?: string
  PenaltyReasonsFI?: string
  PenaltyReasonsEN?: string
  PenaltyFaultCodes?: number
  PenaltyLField?: string
  PenaltyReasonsAbbreviation?: string
}

export interface Referee {
  RefereeRole: string
  RefereeName: string
}

export interface PeriodSummary {
  PlayedPeriods: string
  PeriodGoals: PeriodGoal[]
  PeriodSaves: PeriodSfe[]
  PeriodPenMins: PeriodPenMin[]
  PeriodPPMins: PeriodPpmin[]
  PeriodPPGoals: PeriodPpgoal[]
  PeriodSHGoals: PeriodShgoal[]
}

export interface PeriodGoal {
  Goals: string
}

export interface PeriodSfe {
  Saves: string
}

export interface PeriodPenMin {
  PenMins: string
}

export interface PeriodPpmin {
  PPMins: string
}

export interface PeriodPpgoal {
  PPGoals: string
}

export interface PeriodShgoal {
  SHGoals: string
}

export interface GoalkeeperSummary {
  TeamName: string
  TeamGoalkeepers: TeamGoalkeeper[]
}

export interface TeamGoalkeeper {
  GkName: string
  GkJersey: number
  GkSaves: GkSfe[]
  GkChanges: any[]
  GkOut: any[]
}

export interface GkSfe {
  Saves: string
}
