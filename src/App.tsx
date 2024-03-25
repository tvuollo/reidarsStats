import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataItem, StatGroup } from './Interfaces/DataInterfaces';
import AllTeamData from './Sections/AllTeamData.tsx';

const App = () => {
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
  const [totalStartDate, setTotalStartDate] = useState<string>("");
  const [totalEndDate, setTotalEndDate] = useState<string>("");

  const getMasterData = async () => {
    const tempData: DataItem[] = [];

    dataPaths.forEach(function (year) {
      let yearData: DataItem = JSON.parse("[]");

      try {
        axios.get(`data/season${year}.json`)
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
      setTotalStartDate(masterData[0].Games[0].GameDate);

      const lastSeasonGames = masterData[masterData.length-1].Games;
      setTotalEndDate(lastSeasonGames[lastSeasonGames.length - 1].GameDate);

      setIsLoading(false);
    }
  }, [updated]);

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
          {isLoading && <p>Loading...</p>}
          {!isLoading && masterData.length > 0 && (
            <AllTeamData Data={masterData} TeamId={reidarsTeamId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
