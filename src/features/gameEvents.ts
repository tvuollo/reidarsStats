import { validSeasons } from '../data/seasons'
import { getEventGameById } from '../data/events'
import type { EventGameLog, EventGameRecord } from '../types/events'
import type { SeasonGame } from '../types/season'

export interface SingleGameViewData {
  gameId: string
  eventFileKey: string
  record: EventGameRecord
  seasonGame: (SeasonGame & { seasonKey: string }) | null
  gameLogsSorted: EventGameLog[]
}

function toNumber(value: string | number | undefined): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

export function getSingleGameViewData(gameId: string): SingleGameViewData | null {
  const eventGame = getEventGameById(gameId)
  if (!eventGame) {
    return null
  }

  const seasonMatch = validSeasons
    .map((season) => ({
      seasonKey: season.seasonKey,
      game: season.data.Games.find((item) => String(item.GameID) === gameId),
    }))
    .find((item) => item.game)

  const gameLogsSorted = [...eventGame.record.GameLogsUpdate].sort((a, b) => {
    if (a.Period !== b.Period) {
      return a.Period - b.Period
    }

    return toNumber(a.GameTime) - toNumber(b.GameTime)
  })

  return {
    gameId,
    eventFileKey: eventGame.fileKey,
    record: eventGame.record,
    seasonGame: seasonMatch?.game
      ? {
          ...seasonMatch.game,
          seasonKey: seasonMatch.seasonKey,
        }
      : null,
    gameLogsSorted,
  }
}

export function hasSingleGameEventsData(gameId: string): boolean {
  return getEventGameById(gameId) !== null
}
