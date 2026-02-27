import './App.css'

import { type ReactElement, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import LoadingView from './components/LoadingView'
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

interface ViewResolutionInput {
  view: string
  seasonKey: string
  statGroupId: string
  gameId: string
  query: string
}

function resolveViewContent({
  view,
  seasonKey,
  statGroupId,
  gameId,
  query,
}: ViewResolutionInput): ReactElement {
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

  return <DashboardPage totals={reidarsTotals} />
}

function App() {
  const [searchParams] = useSearchParams()

  const view = (searchParams.get('view') ?? 'home').toLowerCase()
  const seasonKey = searchParams.get('file') ?? ''
  const statGroupId = searchParams.get('statgroupid') ?? ''
  const gameId = searchParams.get('gameid') ?? ''
  const query = searchParams.get('query')?.trim() ?? ''
  const routeKey = `${view}|${seasonKey}|${statGroupId}|${gameId}|${query}`

  const [resolved, setResolved] = useState<{ routeKey: string, content: ReactElement }>(() => ({
    routeKey,
    content: resolveViewContent({ view, seasonKey, statGroupId, gameId, query }),
  }))

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setResolved({
        routeKey,
        content: resolveViewContent({ view, seasonKey, statGroupId, gameId, query }),
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [routeKey, view, seasonKey, statGroupId, gameId, query])

  if (resolved.routeKey !== routeKey) {
    return <LoadingView />
  }

  return resolved.content
}

export default App
