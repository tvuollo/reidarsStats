export interface TeamSeasonStats {
    EndDate: string;
    Games: number;
    GoalsAgainst: number;
    GoalsFor: number;
    Looses: number;
    PenaltyMinutes?: number;
    StartDate: string;
    StatGroupId?: string;
    StatGroupName?: string;
    Ties: number;
    Wins: number;
}

export default TeamSeasonStats;