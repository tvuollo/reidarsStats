import { Link } from 'react-router-dom'

import type { SingleGameViewData } from '../features/gameEvents'

interface SingleGamePageProps {
  data: SingleGameViewData | null
  gameId: string
  seasonLabel: (seasonKey: string) => string
}

function SingleGamePage({ data, gameId, seasonLabel }: SingleGamePageProps) {
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
    <main className="app">
      <header className="app-header">
        <h1>
          {game.HomeTeam.Name} {game.HomeTeam.Goals} - {game.AwayTeam.Goals} {game.AwayTeam.Name}
        </h1>
        <p>
          Game ID <code>{data.gameId}</code> | Source <code>{data.eventFileKey}</code>
        </p>
        <p>
          {data.seasonGame ? (
            <>
              Season <code>{seasonLabel(data.seasonGame.seasonKey)}</code> | StatGroup{' '}
              <code>{game.StatGroupName}</code>
            </>
          ) : (
            <>
              StatGroup <code>{game.StatGroupName}</code>
            </>
          )}
        </p>
        <p>
          <Link className="inline-link" to="/">
            Back to overview
          </Link>
        </p>
      </header>

      <section className="table-section">
        <h2>Game Summary</h2>
        <div className="table-scroll">
          <table>
            <tbody>
              <tr>
                <th>Date</th>
                <td>{game.StartDate}</td>
              </tr>
              <tr>
                <th>Start Time</th>
                <td>{game.StartTime}</td>
              </tr>
              <tr>
                <th>Arena</th>
                <td>{game.Arena}</td>
              </tr>
              <tr>
                <th>Level</th>
                <td>{game.LevelName}</td>
              </tr>
              <tr>
                <th>Spectators</th>
                <td>{game.Spectators}</td>
              </tr>
              <tr>
                <th>Finished Type</th>
                <td>{game.FinishedType}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-section">
        <h2>Referees</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data.record.Referees.length === 0 ? (
                <tr>
                  <td colSpan={2}>No referees listed.</td>
                </tr>
              ) : (
                data.record.Referees.map((referee, index) => (
                  <tr key={`${referee.RefereeName}-${index}`}>
                    <td>{referee.RefereeName}</td>
                    <td>{referee.RefereeRole}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-section">
        <h2>Period Summary</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Played Periods</td>
                <td>{data.record.PeriodSummary.PlayedPeriods}</td>
              </tr>
              <tr>
                <td>Goals</td>
                <td>{data.record.PeriodSummary.PeriodGoals.map((x) => x.Goals).join(' | ') || '-'}</td>
              </tr>
              <tr>
                <td>Powerplay Goals</td>
                <td>
                  {data.record.PeriodSummary.PeriodPPGoals.map((x) => x.PPGoals).join(' | ') || '-'}
                </td>
              </tr>
              <tr>
                <td>Powerplay Minutes</td>
                <td>{data.record.PeriodSummary.PeriodPPMins.map((x) => x.PPMins).join(' | ') || '-'}</td>
              </tr>
              <tr>
                <td>Penalty Minutes</td>
                <td>
                  {data.record.PeriodSummary.PeriodPenMins.map((x) => x.PenMins).join(' | ') || '-'}
                </td>
              </tr>
              <tr>
                <td>Shorthanded Goals</td>
                <td>
                  {data.record.PeriodSummary.PeriodSHGoals.map((x) => x.SHGoals).join(' | ') || '-'}
                </td>
              </tr>
              <tr>
                <td>Saves</td>
                <td>{data.record.PeriodSummary.PeriodSaves.map((x) => x.Saves).join(' | ') || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-section">
        <h2>Goalkeepers</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>Goalkeeper</th>
                <th>Jersey</th>
                <th>Saves by Period</th>
                <th>Out Times</th>
              </tr>
            </thead>
            <tbody>
              {data.record.GoalkeeperSummary.flatMap((teamSummary) =>
                teamSummary.TeamGoalkeepers.map((goalkeeper) => (
                  <tr key={`${teamSummary.TeamName}-${goalkeeper.PlayerLinkID}`}>
                    <td>{teamSummary.TeamName}</td>
                    <td>{goalkeeper.GkName}</td>
                    <td>{goalkeeper.GkJersey}</td>
                    <td>{goalkeeper.GkSaves.map((x) => x.Saves).join(' | ') || '-'}</td>
                    <td>{goalkeeper.GkOut.map((x) => x.Time).join(' | ') || '-'}</td>
                  </tr>
                )),
              ).length === 0 ? (
                <tr>
                  <td colSpan={5}>No goalkeeper summary rows.</td>
                </tr>
              ) : (
                data.record.GoalkeeperSummary.flatMap((teamSummary) =>
                  teamSummary.TeamGoalkeepers.map((goalkeeper) => (
                    <tr key={`${teamSummary.TeamName}-${goalkeeper.PlayerLinkID}`}>
                      <td>{teamSummary.TeamName}</td>
                      <td>{goalkeeper.GkName}</td>
                      <td>{goalkeeper.GkJersey}</td>
                      <td>{goalkeeper.GkSaves.map((x) => x.Saves).join(' | ') || '-'}</td>
                      <td>{goalkeeper.GkOut.map((x) => x.Time).join(' | ') || '-'}</td>
                    </tr>
                  )),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-section">
        <h2>Game Logs</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Time</th>
                <th>Type</th>
                <th>Team</th>
                <th>Player</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {data.gameLogsSorted.length === 0 ? (
                <tr>
                  <td colSpan={6}>No game log rows.</td>
                </tr>
              ) : (
                data.gameLogsSorted.map((log, index) => (
                  <tr key={`${log.Type}-${log.TeamId}-${log.GameTime}-${index}`}>
                    <td>{log.Period}</td>
                    <td>{log.GameTime}</td>
                    <td>{log.Type}</td>
                    <td>{log.TeamId}</td>
                    <td>{log.Name || log.ScorerName || log.GoalkeeperName || '-'}</td>
                    <td>
                      {[
                        log.ScorerName,
                        log.FirstAssistName,
                        log.SecondAssistName,
                        log.PenaltyReasonsAbbreviation,
                        log.PenaltyMinutes,
                        log.SuffererNames,
                      ]
                        .filter(Boolean)
                        .join(' | ') || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default SingleGamePage
