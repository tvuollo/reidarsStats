export interface PlayerItem {
    Captain: string;
    FirstName: string;
    Id: string;
    JerseyNr: string;
    LastName: string;
    RoleAbbrv_EN: string;
};

export interface PlayerSeasonStats {
    Season: string;
    Games: number;
    Assists: number;
    GA: number;
    Goals: number;
    PenMin: number;
    Points: number;
}

export interface PlayerCareer {
    Player: PlayerItem;
    SeasonStats: PlayerSeasonStats[];
    TotalStats: PlayerSeasonStats;
}