import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { DataItem, RootObject, StatGroup } from './Interfaces/DataInterfaces';

import AllTeamData from './Sections/AllTeamData.tsx';

const App = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updated, setUpdated] = useState<number>(Date.now());

  const reidarsTeamId: string = "996011578";
  const dataPaths: string[] = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

  const [masterData, setMasterData] = useState<DataItem[]>([])
  const [statGroups, setStatGroups] = useState<StatGroup[]>([]);

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
      setIsLoading(false);
    }
  }, [updated]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <AllTeamData Data={masterData} TeamId={reidarsTeamId} />
      )}
    </div>
  );
}

export default App;
