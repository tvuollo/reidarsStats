export interface SingleGameRosters {
    PlayerRoles: PlayerRole[]
    StaffRoles: StaffRole[]
    HomeTeamSerieRoster: HomeTeamSerieRoster
    AwayTeamSerieRoster: AwayTeamSerieRoster
    HomeTeamGameRoster: HomeTeamGameRoster
    AwayTeamGameRoster: AwayTeamGameRoster
}

export default SingleGameRosters;

export interface PlayerRole {
    RoleID: string
    RoleName: string
    RoleAbbrv: string
    RoleCategory: string
    RosterType: string
}

export interface StaffRole {
    RoleID: string
    RoleName: string
    RoleAbbrv: string
    RoleCategory: string
    RosterType: string
}

export interface HomeTeamSerieRoster {
    Players: Player[]
    Staff: any[]
}

export interface Player {
    UniqueID: string
    SerieID: string
    TeamID: string
    PlayerID: string
    RoleID: string
    JerseyNr: string
    NotInRoster: string
    Injured: string
    Captain: string
    Height: string
    Weight: string
    Hand: any
    Rookie?: string
    SeasonID: any
    SubSerieID: string
    SerieAssociationID: string
    SerieAssociationName: string
    JoinToTeam: string
    LeftFromTeam: string
    RoleName: string
    RoleAbbrv: string
    RoleName_EN: string
    RoleAbbrv_EN: string
    LastName: string
    FirstName: string
    DateOfBirth: string
    LinkID: string
    LastNameForm: string
}

export interface AwayTeamSerieRoster {
    Players: Player2[]
    Staff: any[]
}

export interface Player2 {
    UniqueID: string
    SerieID: string
    TeamID: string
    PlayerID: string
    RoleID: string
    JerseyNr: string
    NotInRoster: string
    Injured: string
    Captain: string
    Height: string
    Weight: string
    Hand: any
    Rookie: string
    SeasonID: any
    SubSerieID: string
    SerieAssociationID: string
    SerieAssociationName: string
    JoinToTeam: string
    LeftFromTeam: string
    RoleName: string
    RoleAbbrv: string
    RoleName_EN: string
    RoleAbbrv_EN: string
    LastName: string
    FirstName: string
    DateOfBirth: string
    LinkID: string
    LastNameForm: string
}

export interface HomeTeamGameRoster {
    Players: Player3[]
    Staff: any[]
}

export interface Player3 {
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
    LinkID: string
    LastNameForm: string
}

export interface AwayTeamGameRoster {
    Players: Player4[]
    Staff: any[]
}

export interface Player4 {
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
    LinkID: string
    LastNameForm: string
}
