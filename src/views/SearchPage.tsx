import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import type { GameSearchResult } from '../features/gameSearch'
import { gameUrl, homeUrl, searchUrl } from '../features/queryRoutes'
import { generateMatchedString } from '../features/searchResult'

interface SearchPageProps {
  query: string
  results: GameSearchResult[]
}

function SearchPage({ query, results }: SearchPageProps) {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState(query)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = searchInput.trim()
    if (!trimmed) {
      return
    }

    navigate(searchUrl(trimmed))
  }

  return (
    <main className="container reidars-stats-container">
      <a className="link reidars-backbutton" href={homeUrl()}>
        &lsaquo; Takaisin
      </a>

      <header className="article__header">
        <div className="articleheader">
          <h1 className="articletitle">Haku</h1>
        </div>
      </header>

      <section className="article__content">
        <div className="articlebody">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by team or player name"
            />
            <button className="search-button" type="submit">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="article__content">
        <div className="articlebody">
          <h2 className="archiveitem__title">Hakutuloksia ({results.length})</h2>
          <div className="reidars-table-wrapper">
            <table className="reidars-datatable">
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No games matched this search query.</td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result.gameId}>
                      <td className="reidars-datatable-td-left">
                        {result.date}<br />{result.statGroupName}
                      </td>
                      <td className="reidars-datatable-td-left">
                        {result.homeTeamName} vs {result.awayTeamName}
                      </td>
                      <td className="reidars-datatable-td-left">
                        {result.homeGoals} - {result.awayGoals}
                      </td>
                      <td className="reidars-datatable-td-left">{generateMatchedString(result.matchedIn, result.matchedPlayerLogs)}</td>
                      <td>
                        <a className="inline-link" href={gameUrl(result.gameId)}>
                          <strong>Pelin tiedot &raquo;</strong>
                        </a>
                      </td>
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

export default SearchPage
