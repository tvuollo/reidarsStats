export interface RootObject {
    Players: Player[];
    ContactPersons: ContactPerson[];
    StatGroups: StatGroup[];
    Games: Game[];
    Standings: Standing[];
    TopScorers: TopScorer[];
    AssociationTeams: any[];
    StandingsEnabled: number;
    TopScorersEnabled: number;
}

export interface TopScorer {
    StatGroupID?: string;
    PlayerID?: string;
    HomeGoals?: string;
    AwayGoals?: string;
    HomeAssists?: string;
    AwayAssists?: string;
    PersonID: string;
    LastName: string;
    FirstName: string;
    Goals: number;
    Assists: number;
    Points: number;
}

export interface Standing {
    StatGroupID: string;
    StatGroupName: string;
    PointRules: string;
    LevelID: string;
    WinPoints: string;
    Teams: Team[];
}

export interface Team {
    UniqueID: string;
    TeamID: string;
    StatGroupID: string;
    Games: string;
    Wins: string;
    OtWins: string;
    Ties: string;
    OtLooses: string;
    Looses: string;
    GoalsFor: string;
    GoalsAgainst: string;
    GoalDiff: string;
    PenaltyMinutes?: any;
    Points: string;
    Ranking: string;
    SeasonID?: any;
    PointsPerGame: string;
    TeamAbbreviation: string;
}

export interface Game {
    GameID: string;
    GameDate: string;
    GameStatus: string;
    FinishedType: string;
    HomeTeamID: string;
    AwayTeamID: string;
    HomeGoals: string;
    AwayGoals: string;
    StatGroupID: string;
    LevelID: string;
    HomeTeamAbbreviation: string;
    AwayTeamAbbreviation: string;
    ResultEnabled: number;
    ReportEnabled: number;
}

export interface StatGroup {
    StatGroupID: string;
    StatGroupName: string;
    LevelID: string;
    AreaID: string;
}

export interface ContactPerson {
    LastName: string;
    FirstName: string;
    RoleName: string;
}

export interface Player {
    PersonID: string;
    DateOfBirth: string;
    LastName: string;
    FirstName: string;
    JerseyNr: string;
    RoleName: string;
    RoleID: number;
    PlayerAge: number;
}

export interface DataItem extends RootObject {
    FileName: string;
}