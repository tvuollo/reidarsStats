import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SingleGameEvents from '../Interfaces/SingleGameEvents';
import SingleGameRosters from '../Interfaces/SingleGameRosters';
import SingleGameSummary from '../Interfaces/SingleGameSummary';
import { DataItem } from '../Interfaces/TeamSeasonInterfaces';

interface GameListItem {
    GameId: string;
    Season: string;
}

interface DataViewProps {
    Data: DataItem[];
    TeamId: string;
}

// Events
// https://tulospalvelu.leijonat.fi/unsync/front1/statsapi/gamereports/2016/getgamereportdata.php?gameid=15561

// Rosters
// https://tulospalvelu.leijonat.fi/game/helpers/getRosters.php?season=2016&gameid=15561

// Summary
// https://tulospalvelu.leijonat.fi/game/helpers/getSummary.php?season=2016&gameid=15561

const DataView = ({ Data, TeamId }: DataViewProps) => {
    const [counter, setCounter] = useState<number>(0);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const [gamesList, setGamesList] = useState<GameListItem[]>([]);
    const [isGamesList, setIsGamesList] = useState<boolean>(false);

    const [gameEventsData, setGamesEventsData] = useState<SingleGameEvents[]>([]);
    const [isGameEventsDataFetched, setIsGamesEventsDataFetched] = useState<boolean>(false);
    const [gameRostersData, setGamesRostersData] = useState<SingleGameRosters[]>([]);
    const [isGameRostersDataFetched, setIsGamesRostersDataFetched] = useState<boolean>(false);
    const [gameSummaryData, setGamesSummaryData] = useState<SingleGameSummary[]>([]);
    const [isGameSummaryDataFetched, setIsGamesSummaryDataFetched] = useState<boolean>(false);

    const BuildGamesList = () => {
        let tempGamesList: GameListItem[] = [];

        Data.forEach(function (item) {
            item.Games.forEach(function (game) {
                const tempGame: GameListItem = {
                    GameId: game.GameID,
                    Season: item.FileName
                };
                tempGamesList.push(tempGame);
            });
        });

        setGamesList(tempGamesList);
        setIsGamesList(true);
    };

    const GetGamesEventsData = () => {
        const tempGameEvents: SingleGameEvents[] = [];

        gamesList.forEach(function (game) {
            const requestString = `https://tulospalvelu.leijonat.fi/unsync/front1/statsapi/gamereports/${game.Season}/getgamereportdata.php?gameid=${game.GameId}`;
            let gameData: SingleGameEvents;

            try {
                axios.get(requestString)
                    .then(res => gameData = res.data)
                    .then(function () {
                        tempGameEvents.push(gameData);
                    })
                    .catch(err => console.log(err));
            }
            catch (error) {
                console.log("Axios error");
                if (!axios.isCancel(error)) {
                    // TODO error handling & error message
                }
            };
        });

        setGamesEventsData(tempGameEvents);
        setIsGamesEventsDataFetched(true);
    };

    const GetGamesRostersData = () => {
        const tempGameRosters: SingleGameRosters[] = [];

        gamesList.forEach(function (game) {
            setTimeout(function () {
                setCounter(counter+1);

                const requestString = `https://tulospalvelu.leijonat.fi/game/helpers/getRosters.php?season=${game.Season}&gameid=${game.GameId}`;
                let gameData: SingleGameRosters;
    
                try {
                    axios.get(requestString)
                        .then(res => gameData = res.data)
                        .then(function () {
                            tempGameRosters.push(gameData);
                        })
                        .catch(err => console.log(err));
                }
                catch (error) {
                    console.log("Axios error");
                    if (!axios.isCancel(error)) {
                        // TODO error handling & error message
                    }
                };
            }, 1000);       
        });

        console.log(tempGameRosters);
        setGamesRostersData(tempGameRosters);
        setIsGamesRostersDataFetched(true);
    };

    const GetGamesSummaryData = () => {
        const tempGameSummaries: SingleGameSummary[] = [];

        gamesList.forEach(function (game) {
            setTimeout(function () {
                setCounter(counter+1);

                const requestString = `https://tulospalvelu.leijonat.fi/game/helpers/getSummary.php?season=${game.Season}&gameid=${game.GameId}`;
                let gameData: SingleGameSummary;
    
                try {
                    axios.get(requestString)
                        .then(res => gameData = res.data)
                        .then(function () {
                            tempGameSummaries.push(gameData);
                        })
                        .catch(err => console.log(err));
                }
                catch (error) {
                    console.log("Axios error");
                    if (!axios.isCancel(error)) {
                        // TODO error handling & error messages
                    }
                };
            }, 1000);       
        });

        console.log(tempGameSummaries);
        setGamesSummaryData(tempGameSummaries);
        setIsGamesSummaryDataFetched(true);
    };

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            BuildGamesList();
        }
    }, [isInitialized]);

    useEffect(() => {
        if (isGamesList && !isGameEventsDataFetched) {
            //GetGamesEventsData();
        }
        if (isGamesList && !isGameRostersDataFetched) {
            //GetGamesRostersData();
        }
        if (isGamesList && !isGameSummaryDataFetched) {
            //GetGamesSummaryData();
        }
    }, [isGamesList]);

    return (
        <div>
            {isGamesList && <p>games built</p>}
            <p>{counter}</p>
            {gamesList.length > 9999 && (
                <ul>
                    {gamesList.map((game, index) => (
                        <li key={Number(game.Season) + Number(game.GameId)}>{index + 1}: {game.GameId}</li>
                    ))}
                </ul>
            )}
            {isGameEventsDataFetched && gameEventsData.length > 0 && (
                <p>{JSON.stringify(gameEventsData)}</p>
            )}
            {isGameRostersDataFetched && gameRostersData.length > 0 && (
                <p>{JSON.stringify(gameRostersData)}</p>
            )}
            {isGameSummaryDataFetched && gameSummaryData.length > 0 && (
                <p>{JSON.stringify(gameSummaryData)}</p>
            )}
        </div>
    );
}

export default DataView;