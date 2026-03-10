import { seasonLabel } from '../data/seasons'
import { homeUrl } from '../features/queryRoutes'
import type { TeamPlayerHistory } from '../utils/season'

interface PlayersPageProps {
  players: TeamPlayerHistory[]
}

function PlayersPage({ players }: PlayersPageProps) {
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
                  <th className="reidars-datatable-td-left">Pelaaja</th>
                  <th>Vuosia</th>
                  <th>G</th>
                  <th>A</th>
                  <th>P</th>
                  <th className="reidars-datatable-td-left">Vuodet</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No players found in the season data.</td>
                  </tr>
                ) : (
                  players.map((player) => (
                    <tr key={player.playerId || player.personId || player.displayName}>
                      <th className="reidars-datatable-td-left">
                        {player.displayName}
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
