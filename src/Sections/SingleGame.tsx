import React, { useEffect, useState } from 'react';
import { DataItem } from '../Interfaces/TeamSeasonInterfaces';
import { RootObject } from '../Interfaces/TeamSeasonInterfaces';

interface SingleGameProps {
    Data: DataItem[];
    Filename: string | (string | null)[] | null;
    GameId: string | (string | null)[] | null;
}

const SingleGame = ({ Data, Filename, GameId }: SingleGameProps) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isDataHandled, setIsDataHandled] = useState<boolean>(false);
    const [seasonData, setSeasonData] = useState<RootObject | null>(null);

    const HandleData = () => {
    };

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized && !isDataHandled) {
            if (Filename != null) {

            }

            HandleData();
        }
    }, [isInitialized]);

    if (!isDataHandled) {
        return <p>Loading...</p>
    }

    return (
        <>
            <div className="article__header">
                <div className="articleheader">
                    <h1 className="articletitle">Game view</h1>
                    <p>
                        <small>Game details</small>
                    </p>
                </div>
            </div>
            <div className="article__content">
                <div className="articlebody">
                    <h3 className="archiveitem__title">Otsikko</h3>
                    <div className="reidars-table-wrapper">
                        <table className="reidars-datatable">
                            <thead>
                                <tr>
                                    <th>Päivämäärä</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>data</td>
                                </tr>
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