import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AwayTeam, HomeTeam, SingleGameEvents } from '../Interfaces/SingleGameEvents';
import { AwayTeamGameRoster, HomeTeamGameRoster, SingleGameSummary } from '../Interfaces/SingleGameSummary';

interface Opponent {
    Id: number;
    Name: string;
}

interface SingleGameProps {
    Filename: string | (string | null)[] | null;
    GameId: string | (string | null)[] | null;
    StatGroupId: string | (string | null)[] | null;
    TeamId: string | (string | null)[] | null;
}

const SingleGame = ({ Filename, GameId, StatGroupId, TeamId }: SingleGameProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [eventsData, setEventsData] = useState<SingleGameEvents | null>(null);
    const [summaryData, setSummaryData] = useState<AwayTeamGameRoster | HomeTeamGameRoster | null>(null);
    const [isEventsDataHandled, setIsEventsDataHandled] = useState<boolean>(false);
    const [isSummaryDataHandled, setIsSummaryDataHandled] = useState<boolean>(false);

    const HandleEventsData = async () => {
        try {
            let tempEventsData: SingleGameEvents[] | null = null;
            await axios.get(`data/events/events${Filename}.json`)
                .then(res => tempEventsData = res.data)
                .then(function () {
                    const matchedEvents = tempEventsData?.find(GameUpdates => GameUpdates.GamesUpdate[0].Id === Number(GameId));
                    if (matchedEvents !== undefined) {
                        setEventsData(matchedEvents);
                    }
                    else {
                        console.log('undefined');
                    }
                })
                .catch(err => console.log(err));
        }
        catch (error) {
            console.log("Axios error");
            if (!axios.isCancel(error)) {
                // TODO error handling & error message
            }
        };

        setIsEventsDataHandled(true);
    };

    const HandleSummaryData = async () => {
        try {
            let tempSummaryData: SingleGameSummary[];
            await axios.get(`data/summaries/summaries${Filename}.json`)
                .then(res => tempSummaryData = res.data)
                .then(function () {
                    const matchedSummary = tempSummaryData?.find(
                        summary => summary.AwayTeamGameRoster.Players.length > 0 &&
                            summary.AwayTeamGameRoster.Players[0].GameID === GameId);

                    if (matchedSummary !== undefined) {
                        if (matchedSummary.AwayTeamGameRoster.Players[0].TeamID === TeamId) {
                            setSummaryData(matchedSummary.AwayTeamGameRoster);
                        }
                        else {
                            setSummaryData(matchedSummary.HomeTeamGameRoster);
                        }
                    }
                })
                .catch(err => console.log(err));
        }
        catch (error) {
            console.log("Axios error");
            if (!axios.isCancel(error)) {
                // TODO error handling & error message
            }
        };

        setIsSummaryDataHandled(true);
    };

    const GetTeamNameById = (Id: number) => {
        if (eventsData?.GamesUpdate[0].AwayTeam.Id == Id) {
            return eventsData?.GamesUpdate[0].AwayTeam.Name;
        }
        else {
            return eventsData?.GamesUpdate[0].HomeTeam.Name;
        }
    };

    const GetEventType = (Type: string) => {
        // GK_start, Goal, Penalty
        switch (Type) {
            case "GK_start":
                return "Maalivahti aloittaa";
            case "Goal":
                return "Maali";
            case "Penalty":
                return "Rangaistus";
            default:
                return "";
        }
    };

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            HandleEventsData();
            HandleSummaryData();
        }
    }, [isInitialized]);

    if (!isEventsDataHandled || !isSummaryDataHandled) {
        return <p>Loading...</p>
    };

    return (
        <>
            <div className="article__header">
                <div className="articleheader">
                    <h1 className="articletitle">Pelin tiedot</h1>
                    <p>
                        <small>
                            {eventsData?.GamesUpdate[0].StatGroupName}
                            {" | "}
                            {eventsData?.GamesUpdate[0].StartDate}
                        </small>
                    </p>
                </div>
            </div>
            <div className="article__score">
                <div className="gameitem gameitem--report">
                    <p className="gameitem__header">
                        {eventsData?.GamesUpdate[0].Arena}
                        {" | "}
                        {eventsData?.GamesUpdate[0].StartDate}
                        {" | "}
                        {eventsData?.GamesUpdate[0].StartTime}
                    </p>
                    <div className="gameitem__score">
                        <div className="gamescore">
                            <span className="gamescore__team gamescore__team--home"></span>
                            <span className="gamescore__score">
                                {eventsData?.GamesUpdate[0].AwayTeam.Name}
                                {"  "}
                                {eventsData?.GamesUpdate[0].AwayTeam.Goals}
                                {"  -  "}
                                {eventsData?.GamesUpdate[0].HomeTeam.Goals}
                                {"  "}
                                {eventsData?.GamesUpdate[0].HomeTeam.Name}
                            </span>
                            <span className="gamescore__team gamescore__team--away"></span>
                        </div>
                    </div>
                    <p className="gameitem__scorers">Yleisöä: {eventsData?.GamesUpdate[0].Spectators}</p>
                </div>
            </div>
            <div className="article__content">
                <div className="articlebody">
                    <h3 className="archiveitem__title">Tapahtumat</h3>
                    <div className="reidars-table-wrapper">
                        <table className="reidars-datatable">
                            <thead>
                                <tr>
                                    <th />
                                    <th />
                                    <th />
                                    <th>{eventsData?.GamesUpdate[0].AwayTeam.Name}</th>
                                    <th>{eventsData?.GamesUpdate[0].HomeTeam.Name}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventsData?.GameLogsUpdate.map((event, index) => (
                                    <tr key={event.Key + "" + index}>
                                        <td className="reidars-datatable-td-left">{(event.GameTime / 60).toFixed(2)}</td>
                                        <td className="reidars-datatable-td-left">
                                            {GetEventType(event.Type)}<br />
                                            <small>{GetTeamNameById(event.TeamId)}</small>
                                        </td>
                                        <td className="reidars-datatable-td-left">
                                            {event.Type === "Goal" && (
                                                <>
                                                    {event.ScorerName}<br />
                                                    {event.FirstAssistName && (
                                                        <>
                                                            {"Syöttäjät: "}
                                                            {event.FirstAssistName}
                                                            {event.SecondAssistName !== undefined && event.SecondAssistName?.length > 2 && (
                                                                <>
                                                                    {", "}
                                                                    {event.SecondAssistName}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {event.Type === "Penalty" && (
                                                <>
                                                    {event.SuffererNames}<br />
                                                    {event.PenaltyMinutesNumber}{" minuuttia"}
                                                    {" | "}
                                                    {event.PenaltyReasonsFI}
                                                </>
                                            )}
                                            {event.Type === "GK_start" && (
                                                <>{event.GoalkeeperName}</>
                                            )}
                                        </td>
                                        <td>
                                            {event.Type === "Goal" &&
                                                event.AwayTeamGoals
                                            }
                                        </td>
                                        <td>
                                            {event.Type === "Goal" &&
                                                event.HomeTeamGoals
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="archiveitem__title">Tilastot</h3>
                    <div className="reidars-table-wrapper">
                        <table className="reidars-datatable">
                            <thead>
                                <tr>
                                    <th className="reidars-datatable-td-left">#</th>
                                    <th className="reidars-datatable-td-left">Nimi</th>
                                    <th>G</th>
                                    <th>A</th>
                                    <th>PTS</th>
                                    <th>PIM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryData?.Players.map((player) => (
                                    <tr key={player.UniqueID}>
                                        <td className="reidars-datatable-td-left">{player.JerseyNr}</td>
                                        <td className="reidars-datatable-td-left">{player.FirstName} {player.LastName}</td>
                                        <td>{player.Goals}</td>
                                        <td>{player.Assists}</td>
                                        <td>{player.Points}</td>
                                        <td>{player.PenMin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="archiveitem__title">Linkit</h3>
                    <a
                        className="reidars-external-link-button"
                        href={`https://tulospalvelu.leijonat.fi/game/?season=${Filename}&gameid=${GameId}`}
                        target="_blank"
                    >
                        Peli tulospalvelussa <strong>&raquo;</strong>
                    </a>
                </div>
            </div>
        </>
    );
};

export default SingleGame;