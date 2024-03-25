import React, { useEffect, useState } from 'react';
import { DataItem } from '../Interfaces/DataInterfaces';
import { RootObject } from '../Interfaces/DataInterfaces';

interface SingleSeasonProps {
    Data: DataItem[];
    Filename: string | (string | null)[] | null;
    StatGroupId: string | (string | null)[] | null;
    TeamId: string;
}

const SingleSeason = ({ Data, Filename, StatGroupId, TeamId }: SingleSeasonProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isDataHandled, setIsDataHandled] = useState<boolean>(false);
    const [seasonData, setSeasonData] = useState<RootObject | null>(null);
    const [seasonName, setSeasonName] = useState<string>("");
    const [seasonStartDate, setSeasonStartDate] = useState<string>("");
    const [seasonEndDate, setSeasonEndDate] = useState<string>("");
    const [seasonFileYear, setSeasonFileYear] = useState<number>(0);

    const HandleData = () => {
        const rootData = Data
            .filter(season => season.FileName === Filename)[0];

        const seasonTempData: RootObject = {
            AssociationTeams: [],
            ContactPersons: [],
            Games: [],
            Players: rootData.Players,
            Standings: [],
            StatGroups: [],
            TopScorers: rootData.TopScorers,
            StandingsEnabled: 1,
            TopScorersEnabled: 1
        }

        seasonTempData.Games = rootData.Games
            .filter(games => games.StatGroupID === StatGroupId);
        seasonTempData.Standings = rootData.Standings
            .filter(standing => standing.StatGroupID === StatGroupId);
        seasonTempData.StatGroups = rootData.StatGroups
            .filter(StatGroups => StatGroups.StatGroupID === StatGroupId);

        const startDateArray = seasonTempData.Games[0].GameDate.split('.');

        if (seasonTempData.Standings[0].Teams[0].Ranking === "0") {
            seasonTempData.Standings[0].Teams = seasonTempData.Standings[0].Teams.sort((b, a) => Number(a.Points) - Number(b.Points));
        }

        setSeasonData(seasonTempData);
        setSeasonName(seasonTempData.StatGroups[0].StatGroupName + " " + startDateArray[2]);
        setSeasonStartDate(seasonTempData.Games[0].GameDate);
        setSeasonEndDate(seasonTempData.Games[seasonTempData.Games.length - 1].GameDate);
        setIsDataHandled(true);
    };

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized && !isDataHandled) {
            if (Filename != null) {
                const tempFileYear: string = Filename.toString();
                setSeasonFileYear(Number(tempFileYear));
            }

            HandleData();
        }
    }, [isInitialized]);

    if (!isDataHandled) {
        return <p>Loading...</p>
    }

    return (
        <>
            <div className="article__header">
                <div className="articleheader">
                    <h1 className="articletitle">
                        {seasonName}
                    </h1>
                    <p>
                        <small>{seasonStartDate} - {seasonEndDate}</small>
                    </p>
                </div>
            </div>
            <div className="article__content">
                <div className="articlebody">
                    <h3 className="archiveitem__title">Ottelut</h3>
                    <div className="reidars-table-wrapper">
                        <table className="reidars-datatable">
                            <thead>
                                <tr>
                                    <th>Päivämäärä</th>
                                    <th></th>
                                    <th className="reidars-datatable-td-center">Tulos</th>
                                    <th></th>
                                    {seasonFileYear > 2015 &&
                                        <th>Linkit</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {seasonData?.Games.map((game) => (
                                    <tr key={game.GameID}>
                                        <td className="reidars-datatable-td-left">{game.GameDate}</td>
                                        <td className="reidars-datatable-td-right">{game.AwayTeamAbbreviation}</td>
                                        <td className="reidars-datatable-td-center">{game.AwayGoals}{" - "}{game.HomeGoals}</td>
                                        <td className="reidars-datatable-td-left">{game.HomeTeamAbbreviation}</td>
                                        {seasonFileYear > 2015 &&
                                            <td>
                                                <a href={`https://tulospalvelu.leijonat.fi/game/?season=${Filename}&gameid=${game.GameID}&lang=fi&statgroupid=${game.StatGroupID}`} target="_blank">Linkki tulospalveluun &rsaquo;</a>
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="archiveitem__title">Sarjataulukko</h3>
                    <div className="reidars-table-wrapper">
                        <table className="reidars-datatable">
                            <thead>
                                <tr>
                                    <th>Sijoitus</th>
                                    <th className="reidars-datatable-td-left">Joukkue</th>
                                    <th>Pisteet</th>
                                    <th>W</th>
                                    <th>T</th>
                                    <th>L</th>
                                    <th>GF</th>
                                    <th>GA</th>
                                    <th>GDIFF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seasonData?.Standings[0].Teams.map((team, index) => (
                                    <tr key={team.TeamID}>
                                        <th>{team.Ranking !== "0" ? team.Ranking : index+1}</th>
                                        <td className="reidars-datatable-td-left">{team.TeamAbbreviation}</td>
                                        <td><strong>{team.Points}</strong></td>
                                        <td>{team.Wins}</td>
                                        <td>{team.Ties}</td>
                                        <td>{team.Looses}</td>
                                        <td>{team.GoalsFor}</td>
                                        <td>{team.GoalsAgainst}</td>
                                        <td>{team.GoalDiff}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="reidars-table-legend">
                        <span className="reidars-table-legend-span">GP: Pelejä pelattu</span>
                        <span className="reidars-table-legend-span">W: Voitot</span>
                        <span className="reidars-table-legend-span">T: Tasapelit</span>
                        <span className="reidars-table-legend-span">L: Tappiot</span>
                        <span className="reidars-table-legend-span">GF: Tehdyt maalit</span>
                        <span className="reidars-table-legend-span">GA: Päästetyt maalit</span>
                        <span className="reidars-table-legend-span">GDIFF: Maaliero</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default SingleSeason;