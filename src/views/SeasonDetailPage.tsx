import { Link } from 'react-router-dom'

import type { TeamStatGroupDetail } from '../utils/season'

interface SeasonDetailPageProps {
  detail: TeamStatGroupDetail | null
  seasonKey: string
  statGroupId: string
  hasGameEventsData: (gameId: string) => boolean
}

function SeasonDetailPage({
  detail,
  seasonKey,
  statGroupId,
  hasGameEventsData,
}: SeasonDetailPageProps) {
  const rankingForIndex = (ranking: string, index: number): number => {
    const parsed = Number(ranking)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }

    return index + 1
  }

  const teamLabel = (teamAbbreviation?: string, teamName?: string): string => {
    return teamAbbreviation || teamName || '-'
  }

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
          <p>{detail.games[0].GameDate} - {detail.games[detail.games.length - 1].GameDate}</p>
        </div>
      </header>

      <section className="article__content">
        <div className="articlebody">
          <h2 className="archiveitem__title">Sarjataulukko</h2>
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th>Sijoitus</th>
                  <th className="reidars-datatable-td-left">Joukkue</th>
                  <th>GP</th>
                  <th>PTS</th>
                  <th>W</th>
                  <th>T</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                </tr>
              </thead>
              <tbody>
                {detail.standings.map((team, index) => {
                  const teamCode = team.TeamAbbreviation ?? team.TeamAbbrv;

                  return (
                    <tr key={`${team.TeamID}-${index}`}>
                      <th>{rankingForIndex(team.Ranking, index)}</th>
                      <td className="reidars-datatable-td-left">
                        {teamLabel(teamCode, team.TeamName)}
                      </td>
                      <td>{team.Games}</td>
                      <td>
                        <strong>{team.Points}</strong>
                      </td>
                      <td>{team.Wins ?? team.Won ?? '0'}</td>
                      <td>{team.Ties ?? team.Draw ?? '0'}</td>
                      <td>{team.Looses ?? team.Lost ?? '0'}</td>
                      <td>{team.GoalsFor}</td>
                      <td>{team.GoalsAgainst}</td>
                      <td>{team.GoalDiff}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="reidars-table-legend">
            <span className="reidars-table-legend-span">GP: Pelejä pelattu</span>
            <span className="reidars-table-legend-span">PTS: Pisteet</span>
            <span className="reidars-table-legend-span">W: Voitot</span>
            <span className="reidars-table-legend-span">T: Tasapelit</span>
            <span className="reidars-table-legend-span">L: Tappiot</span>
            <span className="reidars-table-legend-span">GF: Tehdyt maalit</span>
            <span className="reidars-table-legend-span">GA: Päästetyt maalit</span>
            <span className="reidars-table-legend-span">GD: Maaliero</span>
          </p>
        </div>
      </section>

      <section className="article__content">
        <div className="articlebody">
          <h2 className="archiveitem__title">Pelit</h2>
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th className="reidars-datatable-td-left">Päivämäärä</th>
                  <th className="reidars-datatable-td-left">Koti</th>
                  <th className="reidars-datatable-td-left">Vieras</th>
                  <th>Tulos</th>
                  <th />
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
                        {(hasGameEventsData(String(game.GameID))) ? (
                          <Link className="inline-link" to={`/game/${game.GameID}`}>
                            <strong>Pelin tiedot &raquo;</strong>
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

      {/*
      <section className="article__content">
        <div className="articlebody">
          <h3 className="archiveitem__title">Linkit</h3>
          <a
            className="reidars-external-link-button"
            href={`https://tulospalvelu.leijonat.fi/serie/?season=${detail.seasonKey.replace("season", "")}&lid=${detail.levelId}&did=${detail.areaId}&stgid=${detail.statGroupId}`}
            target="_blank"
          >
            Kausi tulospalvelussa <strong>&raquo;</strong>
          </a>
        </div>
      </section>
*/}

      <Link className="link reidars-backbutton" to="/">
        &lsaquo; Takaisin
      </Link>
    </main >
  )
}

export default SeasonDetailPage
