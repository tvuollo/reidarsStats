import { seasonLabel } from '../data/seasons'
import { homeUrl, playersUrl } from '../features/queryRoutes'
import type { TeamPlayerHistory } from '../utils/season'

type PlayerSortKey = 'name' | 'years' | 'goals' | 'assists' | 'points'

interface PlayersPageProps {
  players: TeamPlayerHistory[]
  sortKey: string
}

function resolveSortKey(sortKey: string): PlayerSortKey {
  if (sortKey === 'name' || sortKey === 'goals' || sortKey === 'assists' || sortKey === 'points') {
    return sortKey
  }

  return 'years'
}

function compareNames(a: TeamPlayerHistory, b: TeamPlayerHistory): number {
  const lastNameCompare = a.lastName.localeCompare(b.lastName, 'fi')
  if (lastNameCompare !== 0) {
    return lastNameCompare
  }

  return a.firstName.localeCompare(b.firstName, 'fi')
}

function sortPlayers(players: TeamPlayerHistory[], sortKey: PlayerSortKey): TeamPlayerHistory[] {
  const sortedPlayers = [...players]

  sortedPlayers.sort((a, b) => {
    if (sortKey === 'name') {
      return compareNames(a, b)
    }

    if (sortKey === 'goals') {
      const goalCompare = b.careerGoals - a.careerGoals
      if (goalCompare !== 0) {
        return goalCompare
      }
    }

    if (sortKey === 'assists') {
      const assistCompare = b.careerAssists - a.careerAssists
      if (assistCompare !== 0) {
        return assistCompare
      }
    }

    if (sortKey === 'points') {
      const pointCompare = b.careerPoints - a.careerPoints
      if (pointCompare !== 0) {
        return pointCompare
      }
    }

    const seasonCompare = b.seasonCount - a.seasonCount
    if (seasonCompare !== 0) {
      return seasonCompare
    }

    const pointCompare = b.careerPoints - a.careerPoints
    if (pointCompare !== 0) {
      return pointCompare
    }

    return compareNames(a, b)
  })

  return sortedPlayers
}

function PlayersPage({ players, sortKey }: PlayersPageProps) {
  const resolvedSortKey = resolveSortKey(sortKey)
  const sortedPlayers = sortPlayers(players, resolvedSortKey)

  return (
    <main className="container reidars-stats-container">
      <a className="link reidars-backbutton" href={homeUrl()}>
        &lsaquo; Takaisin
      </a>

      <header className="article__header">
        <div className="articleheader">
          <h1 className="articletitle">Pelaajat</h1>
          <p>Kaikki kausidatasta loytyneet Reidars-pelaajat. Yhteensa {players.length} pelaajaa.</p>
        </div>
      </header>

      <section className="article__content">
        <div className="articlebody">
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th className="reidars-datatable-td-left">
                    <a className="reidars-table-sortlink" href={playersUrl('name')}>Pelaaja</a>
                  </th>
                  <th>
                    <a className="reidars-table-sortlink" href={playersUrl('years')}>Vuosia</a>
                  </th>
                  <th>
                    <a className="reidars-table-sortlink" href={playersUrl('goals')}>G</a>
                  </th>
                  <th>
                    <a className="reidars-table-sortlink" href={playersUrl('assists')}>A</a>
                  </th>
                  <th>
                    <a className="reidars-table-sortlink" href={playersUrl('points')}>PTS</a>
                  </th>
                  <th className="reidars-datatable-td-left">Vuodet</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No players found in the season data.</td>
                  </tr>
                ) : (
                  sortedPlayers.map((player) => (
                    <tr key={player.playerId || player.personId || player.displayName}>
                      <th className="reidars-datatable-td-left">
                        {player.displayName}
                        <br />
                        <span className="reidars-players-seasons">{player.roles.join(", ")}</span>
                      </th>
                      <td>{player.seasons.length}</td>
                      <td>{player.careerGoals}</td>
                      <td>{player.careerAssists}</td>
                      <td>{player.careerPoints}</td>
                      <td className="reidars-datatable-td-left">{seasonLabel(player.firstSeason)}-{seasonLabel(player.lastSeason)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <a className="link reidars-backbutton" href={homeUrl()}>
        &lsaquo; Takaisin
      </a>
    </main>
  )
}

export default PlayersPage
