import React, { useEffect, useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { DataItem } from './Interfaces/TeamSeasonInterfaces.tsx';
import AllPlayerData from './Sections/AllPlayerData.tsx';
import AllTeamData from './Sections/AllTeamData.tsx';
import SingleSeason from './Sections/SingleSeason.tsx';
import SingleGame from './Sections/SingleGame.tsx';
import DataView from './Sections/DataView.tsx';
import Home from './Sections/Home.tsx';

const App = () => {
  const parsedQuery = queryString.parse(window.location.search.replace("?", ""));
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updated, setUpdated] = useState<number>(Date.now());

  const reidarsTeamId: string = "996011578";
  const dataPaths: string[] = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025'
  ];

  const [masterData, setMasterData] = useState<DataItem[]>([])
  const [activeView, setActiveView] = useState<string>("home");

  const getMasterData = async () => {
    const tempData: DataItem[] = [];

    dataPaths.forEach(function (year) {
      let yearData: DataItem = JSON.parse("[]");

      try {
        axios.get(`data/season/season${year}.json`) 
          .then(res => yearData = res.data)
          .then(function () {
            yearData.FileName = year;
            tempData.push(yearData);
            setUpdated(Date.now());
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

    setMasterData(tempData);
  };

  const HandleBackButtonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault()
    window.history.back();
  };

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      getMasterData();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (masterData.length === dataPaths.length) {
      setIsLoading(false);
    }
  }, [updated]);

  useEffect(() => {
    switch (parsedQuery.view) {
      case "data":
        setActiveView("data");
        break;
      case "game":
        setActiveView("game");
        break;
      case "season":
        setActiveView("season");
        break;
      case "players":
        setActiveView("players");
        break;
      case "team":
        setActiveView("team");
        break;
      default:
        setActiveView("team");
    }
  }, [parsedQuery]);

  return (
    <div className="container reidars-stats-container">
      {isLoading && <p>Loading...</p>}
      {!isLoading && masterData.length > 0 && (
        <>
          {activeView !== "home" && activeView !== 'team' && parsedQuery.view !== null && (
            <a
              href="#"
              onClick={(e) => HandleBackButtonClick(e)}
              className="link reidars-backbutton">
              &lsaquo; Takaisin
            </a>
          )}

          {activeView === "home" && (
            <Home
              Data={masterData}
              TeamId={reidarsTeamId}
            />
          )}
          {activeView === "players" && (
            <AllPlayerData
              Data={masterData}
              TeamId={reidarsTeamId}
            />
          )}
          {activeView === "team" && (
            <AllTeamData
              Data={masterData}
              TeamId={reidarsTeamId}
            />
          )}
          {activeView === "game" && (
            <SingleGame
              Filename={parsedQuery.year}
              GameId={parsedQuery.gameid}
              StatGroupId={parsedQuery.seasonid}
              TeamId={reidarsTeamId}
            />
          )}
          {activeView === "season" && (
            <SingleSeason
              Data={masterData}
              Filename={parsedQuery.year}
              StatGroupId={parsedQuery.seasonid}
            />
          )}
          {/*
          {activeView === "data" && (
            <DataView
              Data={masterData}
            />
          )}                  
          */}    
          {activeView !== "home" && activeView !== 'team' && parsedQuery.view !== null && (
            <a
              href="#"
              onClick={(e) => HandleBackButtonClick(e)}
              className="link reidars-backbutton">
              &lsaquo; Takaisin
            </a>
          )}
        </>
      )}
    </div>
  );
}

export default App;
