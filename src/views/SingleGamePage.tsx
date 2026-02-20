import { Link } from 'react-router-dom'

import { getEventTypeLabel } from '../features/eventTypes'
import type { SingleGameViewData } from '../features/gameEvents'
import type { EventGameTeam } from '../types/events'

interface SingleGamePageProps {
  data: SingleGameViewData | null
  gameId: string
}

function SingleGamePage({ data, gameId }: SingleGamePageProps) {
  const GetTeamNameById = (Id: number, AwayTeam: EventGameTeam, HomeTeam: EventGameTeam) => {
    if (AwayTeam.Id == Id) {
      return AwayTeam.Name;
    }
    else {
      return HomeTeam.Name;
    }
  };

  if (!data) {
    return (
      <main className="app">
        <header className="app-header">
          <h1>Game Not Found</h1>
          <p>
            No events data found for game ID <code>{gameId}</code>.
          </p>
          <Link className="inline-link" to="/">
            Back to overview
          </Link>
        </header>
      </main>
    )
  }

  const game = data.record.GamesUpdate[0]

  return (
    <main className="container reidars-stats-container">
      <a className="link reidars-backbutton" href={`/season/${data.seasonGame?.seasonKey}/${data.seasonGame?.StatGroupID}`}>
        &lsaquo; Takaisin
      </a>

      <header className="article__header">
        <div className="articleheader">
          <h1 className="articletitle">Pelin tiedot</h1>
          <p>
            {game.StatGroupName}
            {" | "}
            {game.StartDate}
          </p>
        </div>
      </header>

      <section className="article__score">
        <div className="gameitem gameitem--report">
          <p className="gameitem__header">
            {game.Arena}
            {" | "}
            {game.StartDate}
            {" | "}
            {game.StartTime}
          </p>
          <div className="gameitem__score">
            <div className="gamescore">
              <span className="gamescore__team gamescore__team--home"></span>
              <span className="gamescore__score">
                {game.AwayTeam.Name}
                {"  "}
                {data.gameLogsSorted.length === 0 ? "" : game.AwayTeam.Goals}
                {"  -  "}
                {data.gameLogsSorted.length === 0 ? "" : game.HomeTeam.Goals}
                {"  "}
                {game.HomeTeam.Name}
              </span>
              <span className="gamescore__team gamescore__team--away"></span>
            </div>
          </div>
          {data.gameLogsSorted.length > 0 ? (<p className="gameitem__scorers">Yleisöä: {game.Spectators}</p>) : null}
        </div>
      </section>

      <section className="article__content" style={data.gameLogsSorted.length === 0 ? { display: "none" } : undefined}>
        <div className="articlebody">
          <h2 className="archiveitem__title">Tapahtumat</h2>
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th />
                  <th />
                  <th />
                  <th>{game.AwayTeam.Name}</th>
                  <th>{game.HomeTeam.Name}</th>
                </tr>
              </thead>
              <tbody>
                {data.gameLogsSorted.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No game log rows.</td>
                  </tr>
                ) : (
                  data.gameLogsSorted.map((event, index) => (
                    <tr key={`${event.Type}-${event.TeamId}-${event.GameTime}-${index}`}>
                      <td className="reidars-datatable-td-left">{(event.GameTime / 60).toFixed(2)}</td>
                      <td className="reidars-datatable-td-left">
                        {getEventTypeLabel(event.Type)}<br />
                        <small>{GetTeamNameById(event.TeamId, game.AwayTeam, game.HomeTeam)}</small>
                      </td>
                      <td className="reidars-datatable-td-left">
                        {event.Type === "Goal" && (
                          <>
                            {event.ScorerName}<br />
                            {event.FirstAssistName !== undefined && event.FirstAssistName !== " " && (
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
                        {event.Type === "GK_in" && (
                          <>{event.GoalkeeperName}</>
                        )}
                        {event.Type === "GK_out" && (
                          <>{event.PreviousGoalkeeperName}</>
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h3 className="archiveitem__title">Linkit</h3>
          <a
            className="reidars-external-link-button"
            href={`https://tulospalvelu.leijonat.fi/game/?season=${data.eventFileKey.replace("events", "")}&gameid=${data.gameId}`}
            target="_blank"
          >
            Peli tulospalvelussa <strong>&raquo;</strong>
          </a>
        </div>
      </section>

      <a className="link reidars-backbutton" href={`/season/${data.seasonGame?.seasonKey}/${data.seasonGame?.StatGroupID}`}>
        &lsaquo; Takaisin
      </a>
    </main>
  )
}

export default SingleGamePage
