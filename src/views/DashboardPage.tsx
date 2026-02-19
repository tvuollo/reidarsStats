import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { SeasonValidationResult, TeamTotalsSummary } from '../utils/season'

interface DashboardPageProps {
  validationResults: SeasonValidationResult[]
  invalidFiles: SeasonValidationResult[]
  isCompatible: boolean
  totals: TeamTotalsSummary
  targetTeamId: string
  targetTeamAbbreviation: string
  seasonLabel: (seasonKey: string) => string
}

function DashboardPage({
  validationResults,
  invalidFiles,
  isCompatible,
  totals,
  targetTeamId,
  targetTeamAbbreviation,
  seasonLabel,
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
    <main className="app">
      <header className="app-header">
        <h1>Reidars All-Seasons Totals</h1>
        <p>
          TeamID <code>{targetTeamId}</code>, TeamAbbreviation <code>{targetTeamAbbreviation}</code>
        </p>
      </header>

      <section className="table-section">
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

      <section className="table-section">
        <h2>1. Type Compatibility Validation</h2>
        <p className="status-line">
          {isCompatible
            ? `All ${validationResults.length} season files are compatible with the shared SeasonData types.`
            : `${invalidFiles.length} of ${validationResults.length} season files are not compatible.`}
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Season</th>
                <th>Valid</th>
                <th>Error Count</th>
              </tr>
            </thead>
            <tbody>
              {validationResults.map((result) => (
                <tr key={result.seasonKey}>
                  <td>{seasonLabel(result.seasonKey)}</td>
                  <td>{result.valid ? 'Yes' : 'No'}</td>
                  <td>{result.errors.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {invalidFiles.length > 0 ? (
          <div className="error-list">
            {invalidFiles.map((file) => (
              <p key={file.seasonKey}>
                <strong>{seasonLabel(file.seasonKey)}:</strong> {file.errors.join(', ')}
              </p>
            ))}
          </div>
        ) : null}
      </section>

      <section className="table-section">
        <h2>2. Reidars Totals Across All Seasons</h2>
        <div className="summary-grid">
          <article className="summary-card">
            <span>Seasons matched</span>
            <strong>{totals.seasonsMatched}</strong>
          </article>
          <article className="summary-card">
            <span>Standings rows matched</span>
            <strong>{totals.rowsMatched}</strong>
          </article>
          <article className="summary-card">
            <span>Goals (for - against)</span>
            <strong>
              {totals.totals.goalsFor} - {totals.totals.goalsAgainst}
            </strong>
          </article>
          <article className="summary-card">
            <span>Total points</span>
            <strong>{totals.totals.points}</strong>
          </article>
        </div>

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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totals.totals.games}</td>
                <td>{totals.totals.wins}</td>
                <td>{totals.totals.ties}</td>
                <td>{totals.totals.otWins}</td>
                <td>{totals.totals.otLosses}</td>
                <td>{totals.totals.losses}</td>
                <td>{totals.totals.goalsFor}</td>
                <td>{totals.totals.goalsAgainst}</td>
                <td>{totals.totals.goalDiff}</td>
                <td>{totals.totals.points}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-section">
        <h2>3. StatGroup Breakdown</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>StatGroup</th>
                <th>Season File</th>
                <th>Games</th>
                <th>Wins</th>
                <th>Ties</th>
                <th>Losses</th>
                <th>Goals For</th>
                <th>Goals Against</th>
                <th>Goal Diff</th>
                <th>Points</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {totals.byStatGroup.map((statGroup) => (
                <tr key={`${statGroup.seasonKey}-${statGroup.statGroupId}`}>
                  <td>{statGroup.statGroupName}</td>
                  <td>{seasonLabel(statGroup.seasonKey)}</td>
                  <td>{statGroup.totals.games}</td>
                  <td>{statGroup.totals.wins}</td>
                  <td>{statGroup.totals.ties}</td>
                  <td>{statGroup.totals.losses}</td>
                  <td>{statGroup.totals.goalsFor}</td>
                  <td>{statGroup.totals.goalsAgainst}</td>
                  <td>{statGroup.totals.goalDiff}</td>
                  <td>{statGroup.totals.points}</td>
                  <td>
                    <Link
                      className="inline-link"
                      to={`/season/${statGroup.seasonKey}/${statGroup.statGroupId}`}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
