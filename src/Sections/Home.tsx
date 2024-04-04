import React, { useEffect, useState } from 'react';
import { DataItem } from '../Interfaces/TeamSeasonInterfaces';
import TeamSeasonStats from '../Interfaces/TeamSeasonStats';

interface HomeProps {
    Data: DataItem[];
    TeamId: string;
}

const Home = ({ Data, TeamId }: HomeProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isDataHandled, setIsDataHandled] = useState<boolean>(false);
    const [totalStartDate, setTotalStartDate] = useState<string>("");
    const [totalEndDate, setTotalEndDate] = useState<string>("");
    const [totals, setTotals] = useState<TeamSeasonStats>();

    const HandleData = () => {
        const totalSeasons: TeamSeasonStats = {
            EndDate: "",
            Filename: "",
            Games: 0,
            GoalsAgainst: 0,
            GoalsFor: 0,
            Looses: 0,
            Standing: 0,
            StartDate: "",
            StartDateTimeStamp: 0,
            Ties: 0,
            Wins: 0
        };

        setTotalStartDate(Data[0].Games[0].GameDate);

        Data.forEach(function (dataItem, index) {
            if (index === (Data.length - 1)) {
                setTotalEndDate(dataItem.Games[dataItem.Games.length - 1].GameDate);
            }

            dataItem.Standings.forEach(function (standing) {
                standing.Teams.forEach(function (team, index) {
                    if (team.TeamID === TeamId) {
                        if (Number(team.Games) > 0) {
                            totalSeasons.Games = totalSeasons.Games + Number(team.Games);
                            totalSeasons.GoalsAgainst = totalSeasons.GoalsAgainst + Number(team.GoalsAgainst);
                            totalSeasons.GoalsFor = totalSeasons.GoalsFor + Number(team.GoalsFor);
                            totalSeasons.Looses = totalSeasons.Looses + Number(team.Looses);
                            totalSeasons.Standing = totalSeasons.Standing + (index + 1);
                            totalSeasons.Ties = totalSeasons.Ties + Number(team.Ties);
                            totalSeasons.Wins = totalSeasons.Wins + Number(team.Wins);
                        }
                    }
                });
            });
        });

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

    return (
        <>
            <div className="article__header">
                <div className="articleheader">
                    <h1 className="articletitle">Reidars Tilastokeskus</h1>
                    <p>
                        <small>Tilastodata aikaväliltä: {totalStartDate} - {totalEndDate}{" | "}Sisältää vain harrastesarjan pelit</small>
                    </p>
                </div>
            </div>
            <div className="article__content">
                <div className="articlebody">
                    {totals !== undefined && (
                        <div className="reidars-home-totals">
                            <p className="reidars-home-total">
                                Pelejä<span className="reidars-home-total-number">{totals.Games}</span>
                            </p>
                            <p className="reidars-home-total">
                                Voittoja<span className="reidars-home-total-number">{totals.Wins}</span>
                            </p>
                            <p className="reidars-home-total">
                                Tasapelejä<span className="reidars-home-total-number">{totals.Ties}</span>
                            </p>
                            <p className="reidars-home-total">
                                Tappioita<span className="reidars-home-total-number">{totals.Looses}</span>
                            </p>
                        </div>
                    )}
                    <hr />
                    <div className="reidars-home-links">
                        <a
                            className="reidars-home-link"
                            href={`?view=team`}>
                            Joukkuetilastot &rsaquo;
                            <span className="reidars-home-link-text">Kaikki kaudet ja pelit</span>
                        </a>
                        <a
                            className="reidars-home-link"
                            href={`?view=players`}>
                            Pelaajatilastot &rsaquo;
                            <span className="reidars-home-link-text">Pelaajatilastot ja pelaajakortit</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;