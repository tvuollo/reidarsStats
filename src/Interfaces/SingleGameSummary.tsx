export interface SingleGameSummary {
    HomeTeamGameRoster: HomeTeamGameRoster
    AwayTeamGameRoster: AwayTeamGameRoster
}

export default SingleGameSummary;

export interface HomeTeamGameRoster {
    Players: Player[]
}

export interface Player {
    UniqueID: string
    GameID: string
    TeamID: string
    PersonID: string
    RoleID: string
    Modified: string
    ModifiedBy: any
    Line: string
    JerseyNr: string
    Captain: string
    Height: string
    Weight: string
    Hand: any
    RoleName: string
    RoleAbbrv: string
    RoleName_EN: string
    RoleAbbrv_EN: string
    LastName: string
    FirstName: string
    DateOfBirth: string
    Img: string
    Goals: number
    Assists: number
    Points: number
    PenMin: number
    PlusMinus: number
    Toi: number
    Shifts: number
    Shots: string
    WinFO: number
    LossFO: number
    GA: string
    Saves: any
    TimeOnIce: number
    Gag: string
    SavePerc: string
    LinkID: string
    Plus: number
    Minus: number
}

export interface AwayTeamGameRoster {
    Players: Player2[]
}

export interface Player2 {
    UniqueID: string
    GameID: string
    TeamID: string
    PersonID: string
    RoleID: string
    Modified: string
    ModifiedBy: any
    Line: string
    JerseyNr: string
    Captain: string
    Height: string
    Weight: string
    Hand: any
    RoleName: string
    RoleAbbrv: string
    RoleName_EN: string
    RoleAbbrv_EN: string
    LastName: string
    FirstName: string
    DateOfBirth: string
    Img: string
    Goals: number
    Assists: number
    Points: number
    PenMin: number
    PlusMinus: number
    Toi: number
    Shifts: number
    Shots: string
    WinFO: number
    LossFO: number
    GA: string
    Saves: any
    TimeOnIce: number
    Gag: string
    SavePerc: string
    LinkID: string
    Plus: number
    Minus: number
}
