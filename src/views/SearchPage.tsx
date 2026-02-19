import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { GameSearchResult } from '../features/gameSearch'

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

    navigate(`/search/${encodeURIComponent(trimmed)}`)
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Game Search</h1>
        <p>
          Query: <code>{query}</code>
        </p>
        <p>
          <Link className="inline-link" to="/">
            Back to overview
          </Link>
        </p>
      </header>

      <section className="table-section">
        <h2>Search</h2>
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
      </section>

      <section className="table-section">
        <h2>Results ({results.length})</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Game</th>
                <th>Result</th>
                <th>StatGroup</th>
                <th>Matched In</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6}>No games matched this search query.</td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.gameId}>
                    <td>{result.date}</td>
                    <td>
                      {result.homeTeamName} vs {result.awayTeamName}
                    </td>
                    <td>
                      {result.homeGoals} - {result.awayGoals}
                    </td>
                    <td>{result.statGroupName}</td>
                    <td>{result.matchedIn.join(', ')}</td>
                    <td>
                      <Link className="inline-link" to={`/game/${result.gameId}`}>
                        Open game
                      </Link>
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

export default SearchPage
