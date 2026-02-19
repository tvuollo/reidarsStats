import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { TeamTotalsSummary } from '../utils/season'

interface DashboardPageProps {
  totals: TeamTotalsSummary
}

function DashboardPage({
  totals,
}: DashboardPageProps) {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = searchInput.trim()
    if (!trimmed) {
      return
    }

    navigate(`/search/${encodeURIComponent(trimmed)}`)
  }

  return (
    <main className="container reidars-stats-container">
      <header className="article__header">
        <div className="articleheader">
          <h1 className="articletitle">Reidars Tilastokeskus</h1>
        </div>
      </header>

      <div className="article__content">
        <section className="articlebody">
          <div className="reidars-home-totals">
            <p className="reidars-home-total">
              Pelejä<span className="reidars-home-total-number">{totals.totals.games}</span>
            </p>
            <p className="reidars-home-total">
              Voittoja<span className="reidars-home-total-number">{totals.totals.wins}</span>
            </p>
            <p className="reidars-home-total">
              Tasapelejä<span className="reidars-home-total-number">{totals.totals.ties}</span>
            </p>
            <p className="reidars-home-total">
              Tappioita<span className="reidars-home-total-number">{totals.totals.losses}</span>
            </p>
          </div>
        </section>

        <hr />

        <section className="articlebody">
          <h2>0. Game Search</h2>
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search games by team or player"
            />
            <button className="search-button" type="submit">
              Search
            </button>
          </form>
        </section>

        <hr />

        <section className="articlebody">
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th>StatGroup</th>
                  <th>GP</th>
                  <th>W</th>
                  <th>T</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {totals.byStatGroup.map((statGroup) => (
                  <tr key={`${statGroup.seasonKey}-${statGroup.statGroupId}`}>
                    <th>{statGroup.statGroupName}</th>
                    <td>{statGroup.totals.games}</td>
                    <td>{statGroup.totals.wins}</td>
                    <td>{statGroup.totals.ties}</td>
                    <td>{statGroup.totals.losses}</td>
                    <td>{statGroup.totals.goalsFor}</td>
                    <td>{statGroup.totals.goalsAgainst}</td>
                    <td>
                      <Link
                        className="inline-link"
                        to={`/season/${statGroup.seasonKey}/${statGroup.statGroupId}`}
                      >
                        Open &rsaquo;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="reidars-table-legend">
            <span className="reidars-table-legend-span">GP: Pelejä pelattu</span>
            <span className="reidars-table-legend-span">W: Voitot</span>
            <span className="reidars-table-legend-span">T: Tasapelit</span>
            <span className="reidars-table-legend-span">L: Tappiot</span>
            <span className="reidars-table-legend-span">GF: Tehdyt maalit</span>
            <span className="reidars-table-legend-span">GA: Päästetyt maalit</span>
          </p>
        </section>
      </div>
    </main>
  )
}

export default DashboardPage
