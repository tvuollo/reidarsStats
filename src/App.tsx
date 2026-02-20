import './App.css'

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getSingleGameViewData, hasSingleGameEventsData } from './features/gameEvents'
import { searchGames } from './features/gameSearch'
import {
  getReidarsStatGroupDetail,
  reidarsTotals,
} from './features/reidarsStats'
import { homeUrl } from './features/queryRoutes'
import DashboardPage from './views/DashboardPage'
import SearchPage from './views/SearchPage'
import SeasonDetailPage from './views/SeasonDetailPage'
import SingleGamePage from './views/SingleGamePage'

function App() {
  const [searchParams] = useSearchParams()

  const view = (searchParams.get('view') ?? 'home').toLowerCase()
  const seasonKey = searchParams.get('file') ?? ''
  const statGroupId = searchParams.get('statgroupid') ?? ''
  const gameId = searchParams.get('gameid') ?? ''
  const query = searchParams.get('query')?.trim() ?? ''

  const content = useMemo(() => {
    if (view === 'season' && seasonKey && statGroupId) {
      const detail = getReidarsStatGroupDetail(seasonKey, statGroupId)
      return (
        <SeasonDetailPage
          detail={detail}
          seasonKey={seasonKey}
          statGroupId={statGroupId}
          hasGameEventsData={hasSingleGameEventsData}
        />
      )
    }

    if (view === 'game' && gameId) {
      const data = getSingleGameViewData(gameId)
      return <SingleGamePage data={data} gameId={gameId} />
    }

    if (view === 'search' && query) {
      const results = searchGames(query)
      return <SearchPage query={query} results={results} />
    }

    return <DashboardPage totals={reidarsTotals} />
  }, [view, seasonKey, statGroupId, gameId, query])

  if (view !== 'home' && !seasonKey && !statGroupId && !gameId && !query) {
    return (
      <main className="app">
        <header className="app-header">
          <h1>Invalid View</h1>
          <a className="inline-link" href={homeUrl()}>
            Back to overview
          </a>
        </header>
      </main>
    )
  }

  return content
}

export default App
