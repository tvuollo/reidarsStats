export interface TeamSeasonStats {
    EndDate: string;
    Filename: string;
    Games: number;
    GoalsAgainst: number;
    GoalsFor: number;
    Looses: number;
    PenaltyMinutes?: number;
    Standing: number;
    StartDate: string;
    StartDateTimeStamp: number;
    StatGroupId?: string;
    StatGroupName?: string;
    Ties: number;
    Wins: number;
}

export default TeamSeasonStats;