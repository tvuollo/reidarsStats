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
    <main className="app">
      <header className="app-header">
        <h1>{detail.statGroupName}</h1>
        <p>
          Season <code>{seasonLabel(detail.seasonKey)}</code> | Team <code>{targetTeamAbbreviation}</code>
        </p>
        <Link className="inline-link" to="/">
          Back to overview
        </Link>
      </header>

      <section className="table-section">
        <h2>Season Totals</h2>
        <div className="table-scroll">
          <table>
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
      </section>

      <section className="table-section">
        <h2>Games (Team Only)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Home</th>
                <th>Away</th>
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
                    <td>{game.GameDate}</td>
                    <td>{game.HomeTeamAbbreviation}</td>
                    <td>{game.AwayTeamAbbreviation}</td>
                    <td>
                      {game.HomeGoals} - {game.AwayGoals}
                    </td>
                    <td>
                      {hasGameEventsData(String(game.GameID)) ? (
                        <Link className="inline-link" to={`/game/${game.GameID}`}>
                          Open
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
      </section>

      <section className="table-section">
        <h2>Top Scorers (Team in StatGroup)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {detail.topScorers.length === 0 ? (
                <tr>
                  <td colSpan={4}>No scorer rows found for this StatGroup.</td>
                </tr>
              ) : (
                detail.topScorers.map((scorer) => (
                  <tr key={`${scorer.PersonID}-${scorer.PlayerID ?? scorer.LastName}`}>
                    <td>
                      {scorer.FirstName} {scorer.LastName}
                    </td>
                    <td>{scorer.Goals}</td>
                    <td>{scorer.Assists}</td>
                    <td>{scorer.Points}</td>
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

export default SeasonDetailPage
