import './App.css'

import { Navigate, Route, Routes, useParams } from 'react-router-dom'

import { TARGET_TEAM_ABBREVIATION } from './constants/team'
import { seasonLabel } from './data/seasons'
import { getSingleGameViewData, hasSingleGameEventsData } from './features/gameEvents'
import { searchGames } from './features/gameSearch'
import {
  getReidarsStatGroupDetail,
  reidarsTotals,
} from './features/reidarsStats'
import DashboardPage from './views/DashboardPage'
import SearchPage from './views/SearchPage'
import SeasonDetailPage from './views/SeasonDetailPage'
import SingleGamePage from './views/SingleGamePage'

function SeasonDetailRoute() {
  const params = useParams<{ seasonKey: string; statGroupId: string }>()

  if (!params.seasonKey || !params.statGroupId) {
    return <Navigate to="/" replace />
  }

  const detail = getReidarsStatGroupDetail(params.seasonKey, params.statGroupId)

  return (
    <SeasonDetailPage
      detail={detail}
      seasonKey={params.seasonKey}
      statGroupId={params.statGroupId}
      targetTeamAbbreviation={TARGET_TEAM_ABBREVIATION}
      seasonLabel={seasonLabel}
      hasGameEventsData={hasSingleGameEventsData}
    />
  )
}

function SingleGameRoute() {
  const params = useParams<{ gameId: string }>()
  if (!params.gameId) {
    return <Navigate to="/" replace />
  }

  const data = getSingleGameViewData(params.gameId)
  return <SingleGamePage data={data} gameId={params.gameId} seasonLabel={seasonLabel} />
}

function SearchRoute() {
  const params = useParams<{ query: string }>()
  const query = decodeURIComponent(params.query ?? '').trim()

  if (!query) {
    return <Navigate to="/" replace />
  }

  const results = searchGames(query)
  return <SearchPage query={query} results={results} />
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage
            totals={reidarsTotals}
          />
        }
      />
      <Route path="/search/:query" element={<SearchRoute />} />
      <Route path="/season/:seasonKey/:statGroupId" element={<SeasonDetailRoute />} />
      <Route path="/game/:gameId" element={<SingleGameRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
