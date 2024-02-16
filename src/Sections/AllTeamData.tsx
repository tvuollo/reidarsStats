import React, { useEffect, useState } from 'react';
import { SeasonData, Team } from '../Interfaces/DataInterfaces';

interface AllTeamDataProps {
    Data: SeasonData[];
}

interface TeamDataItem {
    Games: number;
    GoalsAgainst: number;
    GoalsFor: number;
    Looses: number;
    PenaltyMinutes: number;
    Ties: number;
    Wins: number;
    Year: string;
}

const AllTeamData = ({ Data }: AllTeamDataProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [timePeriodString, setTimePeriodString] = useState<string>("");
    const [seasons, setSeasons] = useState<TeamDataItem[]>([]);
    const [reidars, setReidars] = useState<TeamDataItem>();

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            // Get time period
            const firstGameDate = Data[0].Games[0].GameDate;
            const lastGameList = Data[Data.length - 1].Games;
            const lastGameDate = lastGameList[lastGameList.length - 1].GameDate;
            setTimePeriodString(`${firstGameDate} - ${lastGameDate}`);

            // Iterate data from standings
            let tempReidars: TeamDataItem = {
                Games: 0,
                Wins: 0,
                Ties: 0,
                Looses: 0,
                GoalsFor: 0,
                GoalsAgainst: 0,
                PenaltyMinutes: 0,
                Year: "Yhteensä"
            };
            Data.forEach((season) => {
                season.Standings.forEach((standing) => {
                    standing.Teams.forEach((item) => {
                        if (item.TeamAbbreviation === "Reidars" && item.Games !== "0") {
                            tempReidars.Games = tempReidars.Games + Number(item.Games);
                            tempReidars.GoalsAgainst = tempReidars.GoalsAgainst + Number(item.GoalsAgainst);
                            tempReidars.GoalsFor = tempReidars.GoalsFor + Number(item.GoalsFor);
                            tempReidars.Looses = tempReidars.Looses + Number(item.Looses);
                            tempReidars.PenaltyMinutes = tempReidars.PenaltyMinutes + Number(item.PenaltyMinutes);
                            tempReidars.Ties = tempReidars.Ties + Number(item.Ties);
                            tempReidars.Wins = tempReidars.Wins + Number(item.Wins);

                            const newSeason: TeamDataItem = {
                                Games: Number(item.Games),
                                Wins: Number(item.Wins),
                                Ties: Number(item.Ties),
                                Looses: Number(item.Looses),
                                GoalsFor: Number(item.GoalsFor),
                                GoalsAgainst: Number(item.GoalsAgainst),
                                PenaltyMinutes: Number(item.PenaltyMinutes),
                                Year: season.SeasonString
                            };

                            const tempSeasons = seasons;
                            tempSeasons.push(newSeason);

                            setSeasons(tempSeasons);
                        }
                    });
                });
            });
            setReidars(tempReidars);
        }
    }, [isInitialized]);

    return (
        <div>
            <div className="article__header">
                <div className="articleheader">
                    <h1 className="articletitle">
                        Reidars Hockey Team
                    </h1>
                    <p><small>Data aikaväliltä: {timePeriodString}</small></p>
                </div>
            </div>
            <div className="article__content">
                <div className="articlebody">
                    <table style={{ width: 800 }}>
                        <thead>
                            <th>Vuosi</th>
                            <th>Pelit</th>
                            <th>Voitot</th>
                            <th>Tasapelit</th>
                            <th>Tappiot</th>
                            <th>Tehdyt maalit</th>
                            <th>Päästetyt maalit</th>
                            <th>Rangaistusminuutit</th>
                        </thead>
                        <tbody>
                            {seasons.map((item, index) => (
                                <tr key={encodeURI(item.Year + "-" + index)}>
                                    <td>{item.Year}</td>
                                    <td>{item.Games}</td>
                                    <td>{item.Wins}</td>
                                    <td>{item.Ties}</td>
                                    <td>{item.Looses}</td>
                                    <td>{item.GoalsFor}</td>
                                    <td>{item.GoalsAgainst}</td>
                                    <td>{item.PenaltyMinutes}</td>
                                </tr>
                            ))}
                            <tr></tr>
                            {reidars !== undefined && (
                                <tr>
                                    <td>{reidars.Year}</td>
                                    <td>{reidars.Games}</td>
                                    <td>{reidars.Wins}</td>
                                    <td>{reidars.Ties}</td>
                                    <td>{reidars.Looses}</td>
                                    <td>{reidars.GoalsFor}</td>
                                    <td>{reidars.GoalsAgainst}</td>
                                    <td>{reidars.PenaltyMinutes}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllTeamData;