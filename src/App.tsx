import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { SeasonData } from './Interfaces/DataInterfaces';

import AllTeamData from './Sections/AllTeamData.tsx';

import './App.css';

const App = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updated, SetIsUpdated] = useState<number>(Date.now());
  const [data, setData] = useState<SeasonData[]>([]);

  const dataPaths: string[] = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

  function getSeasonString(DataPath: string) {
    return DataPath;
    return `${Number(DataPath)-1}-${DataPath}`;
  };

  const getSeason = async (SeasonPath: string) => {
    let seasonData: SeasonData = JSON.parse("[]");

    try {
      await axios.get(`data/season${SeasonPath}.json`)
        .then(res => seasonData = res.data)
        .catch(err => console.log(err));
    } catch (error) {
      console.log("Axios error");
      if (!axios.isCancel(error)) {
        // TODO error handling & error message
      }
    };

    if (seasonData !== JSON.parse("[]")) {
      let tempData = data;
      seasonData.SeasonString = getSeasonString(SeasonPath);
      tempData.push(seasonData);
      SetIsUpdated(Date.now());
      setData(tempData);
    }
  };

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      dataPaths.forEach(function (season) {
        getSeason(season);
      });
    }
  }, [isInitialized]);

  useEffect(() => {
    if (data.length === dataPaths.length) {
      setIsLoading(false);
    }
  }, [updated]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <AllTeamData Data={data} />
      )}
    </div>
  );
}

export default App;
