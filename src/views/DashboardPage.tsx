import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import type { TeamTotalsSummary } from '../utils/season'

interface DashboardPageProps {
  totals: TeamTotalsSummary
}

function DashboardPage({
  totals,
}: DashboardPageProps) {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const sortedStatGroups = [...totals.byStatGroup].sort((a, b) => {
    if (!a.startDate && !b.startDate) {
      return 0
    }

    if (!a.startDate) {
      return 1
    }

    if (!b.startDate) {
      return -1
    }

    const [aDay, aMonth, aYear] = a.startDate.split('.').map(Number)
    const [bDay, bMonth, bYear] = b.startDate.split('.').map(Number)
    const aTime = new Date(aYear ?? 0, (aMonth ?? 1) - 1, aDay ?? 1).getTime()
    const bTime = new Date(bYear ?? 0, (bMonth ?? 1) - 1, bDay ?? 1).getTime()

    return bTime - aTime
  })

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

      <div className="article__content">
        <section className="articlebody">
          <h2 className="archiveitem__title">Hae pelejä</h2>
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Hae joukkueen tai pelaajan nimellä..."
            />
            <button className="search-button" type="submit">
              Hae
            </button>
          </form>
        </section>
      </div>

      <div className="article__content">
        <section className="articlebody">
          <h2 className="archiveitem__title">Kaudet</h2>
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <thead>
                <tr>
                  <th className="reidars-datatable-td-left">Sarja</th>
                  <th>GP</th>
                  <th>W</th>
                  <th>T</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>Sijoitus</th>
                </tr>
              </thead>
              <tbody>
                {sortedStatGroups.map((statGroup) => (
                  <tr key={`${statGroup.seasonKey}-${statGroup.statGroupId}`}>
                    <th>
                      <a
                        className="inline-link"
                        href={`/season/${statGroup.seasonKey}/${statGroup.statGroupId}`}
                      >
                        {statGroup.startDate} - {statGroup.endDate}<br />
                        {statGroup.statGroupName} &raquo;
                      </a>
                    </th>
                    <td>{statGroup.totals.games}</td>
                    <td>{statGroup.totals.wins}</td>
                    <td>{statGroup.totals.ties}</td>
                    <td>{statGroup.totals.losses}</td>
                    <td>{statGroup.totals.goalsFor}</td>
                    <td>{statGroup.totals.goalsAgainst}</td>
                    <td>{statGroup.totals.rank}</td>
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
