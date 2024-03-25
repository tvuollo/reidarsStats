import React, { useEffect, useState } from 'react';
import { DataItem } from '../Interfaces/DataInterfaces';
import TeamSeasonStats from '../Interfaces/TeamSeasonStats';

interface SeasonMetaData {
    EndDate: string;
    Name: string;
    StartDate: string;
    StartDateTimeStamp: number;
}

interface AllTeamDataProps {
    Data: DataItem[];
    TeamId: string;
}

const AllTeamData = ({Data, TeamId}: AllTeamDataProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isDataHandled, setIsDataHandled] = useState<boolean>(false);
    const [seasons, setSeasons] = useState<TeamSeasonStats[]>([]);
    const [totals, setTotals] = useState<TeamSeasonStats>();
    const [totalStartDate, setTotalStartDate] = useState<string>("");
    const [totalEndDate, setTotalEndDate] = useState<string>("");

    const GetSeasonMetaData = (FileName: string, StatGroupId: string) => {
        const games = Data
            .filter(season => season.FileName === FileName)[0].Games
            .filter(game => game.StatGroupID === StatGroupId);
        const startDateArray = games[0].GameDate.split('.');

        const metaData: SeasonMetaData = {
            EndDate: games[games.length-1].GameDate,
            Name: Data
                .filter(season => season.FileName === FileName)[0].StatGroups
                .filter(statgroup => statgroup.StatGroupID === StatGroupId)[0].StatGroupName,
            StartDate: games[0].GameDate,
            StartDateTimeStamp: Number(startDateArray[2] + startDateArray[1] + startDateArray[0])
        };

        return metaData;
    };

    const HandleData = () => {
        let tempSeasons: TeamSeasonStats[] = [];
        const totalSeasons: TeamSeasonStats = {
            EndDate: "",
            Games: 0,
            GoalsAgainst: 0,
            GoalsFor: 0,
            Looses: 0,
            StartDate: "",
            StartDateTimeStamp: 0,
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
                            const seasonMetaData = GetSeasonMetaData(dataItem.FileName, team.StatGroupID);

                            const tempSeason: TeamSeasonStats = {
                                EndDate: seasonMetaData.EndDate,
                                Games: Number(team.Games),
                                GoalsAgainst: Number(team.GoalsAgainst),
                                GoalsFor: Number(team.GoalsFor),
                                Looses: Number(team.Looses),
                                StartDate: seasonMetaData.StartDate,
                                StartDateTimeStamp: seasonMetaData.StartDateTimeStamp,
                                StatGroupId: team.StatGroupID,
                                StatGroupName: seasonMetaData.Name,
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

        tempSeasons = tempSeasons.sort((a, b) => a.StartDateTimeStamp - b.StartDateTimeStamp);

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
                            {seasons.map((season, index) => (
                                <tr key={index + "-" + season.StatGroupName}>
                                    <th>{season.StartDate} - {season.EndDate}<br/>{season.StatGroupName}</th>
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
                    <p className="reidars-table-legend">
                        <span className="reidars-table-legend-span">GP: Pelejä pelattu</span>
                        <span className="reidars-table-legend-span">W: Voitot</span>
                        <span className="reidars-table-legend-span">T: Tasapelit</span>
                        <span className="reidars-table-legend-span">L: Tappiot</span>
                        <span className="reidars-table-legend-span">GF: Tehdyt maalit</span>
                        <span className="reidars-table-legend-span">GA: Päästetyt maalit</span>
                        <span className="reidars-table-legend-span">W %: Voittoprosentti</span>
                        <span className="reidars-table-legend-span">GF AVG: Tehdyt maalit per peli</span>
                        <span className="reidars-table-legend-span">GA AVG: Päästetyt maalit per peli</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AllTeamData;