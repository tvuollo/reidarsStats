import { Link } from 'react-router-dom'

import type { TeamStatGroupDetail } from '../utils/season'

interface SeasonDetailPageProps {
  detail: TeamStatGroupDetail | null
  seasonKey: string
  statGroupId: string
  targetTeamAbbreviation: string
  seasonLabel: (seasonKey: string) => string
  hasGameEventsData: (gameId: string) => boolean
}

function SeasonDetailPage({
  detail,
  seasonKey,
  statGroupId,
  targetTeamAbbreviation,
  seasonLabel,
  hasGameEventsData,
}: SeasonDetailPageProps) {
  if (!detail) {
    return (
      <main className="app">
        <header className="app-header">
          <h1>Season View Not Found</h1>
          <p>
            No data found for season <code>{seasonKey}</code> and StatGroup <code>{statGroupId}</code>.
          </p>
          <Link className="inline-link" to="/">
            Back to overview
          </Link>
        </header>
      </main>
    )
  }

  return (
    <main className="container reidars-stats-container">
      <Link className="link reidars-backbutton" to="/">
        &lsaquo; Takaisin
      </Link>

      <header className="article__header">
        <div className="articleheader">
          <h1 className="articletitle">{detail.statGroupName}</h1>
          <p>
            Season <code>{seasonLabel(detail.seasonKey)}</code> | Team <code>{targetTeamAbbreviation}</code>
          </p>
        </div>
      </header>

      <section className="article__content">
        <div className="articlebody">
          <h2 className="archiveitem__title">Tilastot</h2>
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th>Games</th>
                  <th>Wins</th>
                  <th>Ties</th>
                  <th>OT Wins</th>
                  <th>OT Losses</th>
                  <th>Losses</th>
                  <th>Goals For</th>
                  <th>Goals Against</th>
                  <th>Goal Diff</th>
                  <th>Points</th>
                  <th>Ranking</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{detail.totals.games}</td>
                  <td>{detail.totals.wins}</td>
                  <td>{detail.totals.ties}</td>
                  <td>{detail.totals.otWins}</td>
                  <td>{detail.totals.otLosses}</td>
                  <td>{detail.totals.losses}</td>
                  <td>{detail.totals.goalsFor}</td>
                  <td>{detail.totals.goalsAgainst}</td>
                  <td>{detail.totals.goalDiff}</td>
                  <td>{detail.totals.points}</td>
                  <td>{detail.standingRow.Ranking}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="article__content">
        <div className="articlebody">
          <h2 className="archiveitem__title">Pelit</h2>
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th className="reidars-datatable-td-left">Date</th>
                  <th className="reidars-datatable-td-left">Home</th>
                  <th className="reidars-datatable-td-left">Away</th>
                  <th>Result</th>
                  <th>Events</th>
                </tr>
              </thead>
              <tbody>
                {detail.games.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No games found in this StatGroup for the selected team.</td>
                  </tr>
                ) : (
                  detail.games.map((game) => (
                    <tr key={game.GameID}>
                      <td className="reidars-datatable-td-left">{game.GameDate}</td>
                      <td className="reidars-datatable-td-left">{game.HomeTeamAbbreviation}</td>
                      <td className="reidars-datatable-td-left">{game.AwayTeamAbbreviation}</td>
                      <td>
                        {game.HomeGoals} - {game.AwayGoals}
                      </td>
                      <td>
                        {hasGameEventsData(String(game.GameID)) ? (
                          <Link className="inline-link" to={`/game/${game.GameID}`}>
                            Open &rsaquo;
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Link className="link reidars-backbutton" to="/">
        &lsaquo; Takaisin
      </Link>
    </main>
  )
}

export default SeasonDetailPage
