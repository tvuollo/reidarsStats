import React, { useEffect, useState } from 'react';
import { DataItem, StatGroup } from '../Interfaces/DataInterfaces';
import TeamSeasonStats from '../Interfaces/TeamSeasonStats';
import { start } from 'repl';

interface AllTeamDataProps {
    Data: DataItem[];
    StatGroups: StatGroup[];
    TeamId: string;
}

const AllTeamData = ({Data, StatGroups, TeamId}: AllTeamDataProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [updated, setIsUpdated] = useState<number>(Date.now());
    const [isDataHandled, setIsDataHandled] = useState<boolean>(false);
    const [seasons, setSeasons] = useState<TeamSeasonStats[]>([]);
    const [totals, setTotals] = useState<TeamSeasonStats>();
    const [totalStartDate, setTotalStartDate] = useState<string>("");
    const [totalEndDate, setTotalEndDate] = useState<string>("");

    const HandleData = () => {
        const tempSeasons: TeamSeasonStats[] = [];
        const totalSeasons: TeamSeasonStats = {
            Games: 0,
            GoalsAgainst: 0,
            GoalsFor: 0,
            Looses: 0,
            Ties: 0,
            Wins: 0
        };
        setTotalStartDate(Data[0].Games[0].GameDate);
        
        Data.forEach(function (dataItem, index) {
            if (index === (Data.length-1)) {
                setTotalEndDate(dataItem.Games[dataItem.Games.length-1].GameDate);
            }

            dataItem.Standings.forEach(function (standing) {
                standing.Teams.forEach(function (team) {
                    if (team.TeamID === TeamId) {
                        if (Number(team.Games) > 0) {
                            const tempSeason: TeamSeasonStats = {
                                EndDate: "endDate",
                                Games: Number(team.Games),
                                GoalsAgainst: Number(team.GoalsAgainst),
                                GoalsFor: Number(team.GoalsFor),
                                Looses: Number(team.Looses),
                                StartDate: "startDate",
                                StatGroupId: team.StatGroupID,
                                StatGroupName: dataItem.FileName + " - " + team.StatGroupID,
                                Ties: Number(team.Ties),
                                Wins: Number(team.Wins)
                            };

                            tempSeasons.push(tempSeason);

                            totalSeasons.Games = totalSeasons.Games + Number(team.Games);
                            totalSeasons.GoalsAgainst = totalSeasons.GoalsAgainst + Number(team.GoalsAgainst);
                            totalSeasons.GoalsFor = totalSeasons.GoalsFor + Number(team.GoalsFor);
                            totalSeasons.Looses = totalSeasons.Looses + Number(team.Looses);
                            totalSeasons.Ties = totalSeasons.Ties + Number(team.Ties);
                            totalSeasons.Wins = totalSeasons.Wins + Number(team.Wins);                            
                        }
                    }
                });
            });
        });

        setSeasons(tempSeasons);
        setTotals(totalSeasons);
        setIsDataHandled(true);
    };

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized && !isDataHandled) {
            HandleData();            
        }
    }, [isInitialized]);

    if (!isDataHandled) {
        return <p>Loading...</p>
    } 

    return (
        <div>
            <div className="article__header">
                <div className="articleheader">
                    <h1 className="articletitle">
                        Reidars Hockey Team
                    </h1>
                    <p>
                        <small>Data aikaväliltä: {totalStartDate} - {totalEndDate}</small>
                    </p>
                </div>
            </div>
            <div className="article__content">
                <div className="articlebody">
                    <table className="reidars-datatable">
                        <thead>
                            <tr>
                                <th>Kausi</th>
                                <th>GP</th>
                                <th>W</th>
                                <th>T</th>
                                <th>L</th>
                                <th>GF</th>
                                <th>GA</th>
                                <th>W %</th>
                                <th>GF AVG</th>
                                <th>GA AVG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seasons.map((season) => (
                                <tr key={season.StatGroupName}>
                                    <th>{season.StatGroupName}<br />{season.StartDate} - {season.EndDate}</th>
                                    <td>{season.Games}</td>
                                    <td>{season.Wins}</td>
                                    <td>{season.Ties}</td>
                                    <td>{season.Looses}</td>
                                    <td>{season.GoalsFor}</td>
                                    <td>{season.GoalsAgainst}</td>
                                    <td>{((season.Wins + season.Ties/2) / season.Games * 100).toFixed(2)}%</td>
                                    <td>{(season.GoalsFor / season.Games).toFixed(2)}</td>
                                    <td>{(season.GoalsAgainst / season.Games).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {totals !== undefined && (
                        <tfoot>
                                <tr>
                                    <th>Yhteensä</th>
                                    <td>{totals.Games}</td>
                                    <td>{totals.Wins}</td>
                                    <td>{totals.Ties}</td>
                                    <td>{totals.Looses}</td>
                                    <td>{totals.GoalsFor}</td>
                                    <td>{totals.GoalsAgainst}</td>
                                    <td>{((totals.Wins + totals.Ties/2) / totals.Games * 100).toFixed(2)}%</td>
                                    <td>{(totals.GoalsFor / totals.Games).toFixed(2)}</td>
                                    <td>{(totals.GoalsAgainst / totals.Games).toFixed(2)}</td>
                                </tr>  
                        </tfoot>
                            )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllTeamData;