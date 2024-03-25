import React, { useEffect, useState } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { DataItem, StatGroup } from './Interfaces/DataInterfaces';
import AllTeamData from './Sections/AllTeamData.tsx';
import SingleSeason from './Sections/SingleSeason.tsx';

const App = () => {
  const parsedQuery = queryString.parse(window.location.search.replace("?", ""));
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updated, setUpdated] = useState<number>(Date.now());

  const reidarsTeamId: string = "996011578";
  const dataPaths: string[] = [
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
    '2024'
  ];

  const [masterData, setMasterData] = useState<DataItem[]>([])
  const [statGroups, setStatGroups] = useState<StatGroup[]>([]);
  const [activeView, setActiveView] = useState<string>("home");

  const getMasterData = async () => {
    const tempData: DataItem[] = [];

    dataPaths.forEach(function (year) {
      let yearData: DataItem = JSON.parse("[]");

      try {
        //axios.get(`data/season${year}.json`)
        axios.get(`https://reidarshockey.com/data/season${year}.json`)
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
      const tempStatGroups: StatGroup[] = [];

      masterData.forEach(function (year) {
        year.StatGroups.forEach(function (group) {
          tempStatGroups.push(group);
        });
      });

      setStatGroups(tempStatGroups);
      setIsLoading(false);
    }
  }, [updated]);

  useEffect(() => {
    switch (parsedQuery.view) {
      case "season":
        setActiveView("season");
        break;
      default:
        setActiveView("home");
    }
  }, [parsedQuery]);

  return (
    <div>
      {!isLoading && masterData.length > 0 && (
        <>
          {activeView !== "home" && (
            <a
              href="#"
              onClick={(e) => HandleBackButtonClick(e)}
              className="link reidars-backbutton">
              &lsaquo; Takaisin
            </a>
          )}
          {activeView === "home" && (
            <AllTeamData
              Data={masterData}
              TeamId={reidarsTeamId}
            />
          )}
          {activeView === "season" && (
            <SingleSeason
              Data={masterData}
              Filename={parsedQuery.year}
              StatGroupId={parsedQuery.seasonid}
              TeamId={reidarsTeamId} />
          )}
          {activeView !== "home" && (
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
