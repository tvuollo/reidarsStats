import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataItem } from '../Interfaces/TeamSeasonInterfaces';
import { Player, SingleGameSummary } from '../Interfaces/SingleGameSummary';
import { PlayerItem, PlayerSeasonStats, PlayerCareer } from '../Interfaces/PlayerStats';

interface AllPlayerDataProps {
    Data: DataItem[];
    TeamId: string;
}

const AllPlayerData = ({ Data, TeamId }: AllPlayerDataProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isDataHandled, setIsDataHandled] = useState<boolean>(false);
    const [players, setPlayers] = useState<PlayerCareer[] | null>(null);

    const HandlePlayers = (existingPlayers: PlayerCareer[], players: Player[]) => {
        let tempPlayers = existingPlayers;

        players.forEach(function (playerForeached) {
            const matchedPlayer = tempPlayers.find(item => item.Player.Id === playerForeached.PersonID);
            if (matchedPlayer) {
                var foundIndex = tempPlayers.findIndex(x => x.Player.Id == matchedPlayer.Player.Id);
                tempPlayers[foundIndex] = {
                    Player: matchedPlayer.Player,
                    SeasonStats: matchedPlayer.SeasonStats,
                    TotalStats: {
                        Assists: matchedPlayer.TotalStats.Assists + playerForeached.Assists,
                        Games: matchedPlayer.TotalStats.Games+1,
                        GA: matchedPlayer.TotalStats.GA,
                        Goals: matchedPlayer.TotalStats.Goals + playerForeached.Goals,
                        PenMin: matchedPlayer.TotalStats.PenMin + playerForeached.PenMin,
                        Points: matchedPlayer.TotalStats.Points + playerForeached.Points,
                        Season: ""
                    }
                };
            }
            else {
                const newPlayer: PlayerCareer = {
                    Player: {
                        Captain: playerForeached.Captain,
                        FirstName: playerForeached.FirstName,
                        Id: playerForeached.PersonID,
                        JerseyNr: playerForeached.JerseyNr,
                        LastName: playerForeached.LastName,
                        RoleAbbrv_EN: playerForeached.RoleAbbrv_EN
                    },
                    SeasonStats: [],
                    TotalStats: {
                        Assists: playerForeached.Assists,
                        Games: 1,
                        GA: Number(playerForeached.GA),
                        Goals: playerForeached.Goals,
                        PenMin: playerForeached.PenMin,
                        Points: playerForeached.Points,
                        Season: ""
                    }
                };

                tempPlayers.push(newPlayer);
            }
        });

        return tempPlayers;
    };

    const HandleData = async () => {
        let tempPlayers: PlayerCareer[] = [];

        try {
            let tempSummaryData: SingleGameSummary[];
            await axios.get(`data/SingleGameSummaries.json`)
                .then(res => tempSummaryData = res.data)
                .then(function () {
                    tempSummaryData.forEach(function (summary) {
                        if (summary.AwayTeamGameRoster.Players.length > 0) {
                            if (summary.AwayTeamGameRoster.Players[0].TeamID === TeamId) {
                                tempPlayers = HandlePlayers(tempPlayers, summary.AwayTeamGameRoster.Players);
                            }
                            else {
                                tempPlayers = HandlePlayers(tempPlayers, summary.HomeTeamGameRoster.Players);
                            }
                        }
                    });
                })
                .catch(err => console.log(err));
        }
        catch (error) {
            console.log("Axios error");
            if (!axios.isCancel(error)) {
                // TODO error handling & error message
            }
        };

        tempPlayers = tempPlayers.sort((a, b) => Number(b.TotalStats.Games) - Number(a.TotalStats.Games));

        setPlayers(tempPlayers);
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

    return (
        <>
            <div className="article__header">
                <div className="articleheader">
                    <h1 className="articletitle">Reidars pelaajatilastot</h1>
                </div>
            </div>
            <div className="article__content">
                <div className="articlebody">
                    {isDataHandled && players !== null && (
                    <div className="reidars-table-wrapper">
                    <table className="reidars-datatable">
                        <thead>
                            <tr>
                                <th className="reidars-datatable-td-left">#</th>
                                <th />
                                <th className="reidars-datatable-td-left">Pelaaja</th>
                                <th>GP</th>
                                <th>G</th>
                                <th>A</th>
                                <th>PTS</th>
                                <th>PIM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => (
                                <tr key={player.Player.Id}>
                                    <th className="reidars-datatable-td-left">{player.Player.JerseyNr}</th>
                                    <td className="reidars-datatable-td-left">{player.Player.Captain}</td> 
                                    <td className="reidars-datatable-td-left">{player.Player.FirstName} {player.Player.LastName}</td>
                                    <td>{player.TotalStats.Games}</td>
                                    <td>{player.TotalStats.Goals}</td>
                                    <td>{player.TotalStats.Assists}</td>
                                    <td>{player.TotalStats.Points}</td>
                                    <td>{player.TotalStats.PenMin}</td>
                                </tr>
                            ))}
                            </tbody>
                            </table>
                            </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AllPlayerData;