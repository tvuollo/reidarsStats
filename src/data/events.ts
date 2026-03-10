import type { EventGameInfo, EventGameRecord } from '../types/events'
import { excludedGameIds } from './seasons'

const dataRequestVersion = Date.now().toString(36)

function withDataRequestVersion(path: string): string {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}v=${dataRequestVersion}`
}

export interface LoadedEventGame {
  fileKey: string
  gameId: string
  record: EventGameRecord
  game: EventGameInfo
}

function parseYear(value: string): number | null {
  const match = /(\d{4})$/.exec(value.trim())
  if (!match) {
    return null
  }

  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

function gameYear(entry: LoadedEventGame): number | null {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(entry.game.StartDate.trim())
  if (match) {
    return Number(match[3])
  }

  const parsed = Date.parse(entry.game.StartDate)
  if (!Number.isFinite(parsed)) {
    return null
  }

  return new Date(parsed).getUTCFullYear()
}

function shouldReplaceEventGame(existing: LoadedEventGame, candidate: LoadedEventGame): boolean {
  const existingFileYear = parseYear(existing.fileKey)
  const candidateFileYear = parseYear(candidate.fileKey)
  const existingGameYear = gameYear(existing)
  const candidateGameYear = gameYear(candidate)

  const existingYearMatches = existingFileYear !== null && existingFileYear === existingGameYear
  const candidateYearMatches = candidateFileYear !== null && candidateFileYear === candidateGameYear

  if (existingYearMatches !== candidateYearMatches) {
    return candidateYearMatches
  }

  const existingDistance =
    existingFileYear !== null && existingGameYear !== null
      ? Math.abs(existingFileYear - existingGameYear)
      : Number.POSITIVE_INFINITY
  const candidateDistance =
    candidateFileYear !== null && candidateGameYear !== null
      ? Math.abs(candidateFileYear - candidateGameYear)
      : Number.POSITIVE_INFINITY

  if (existingDistance !== candidateDistance) {
    return candidateDistance < existingDistance
  }

  return candidate.fileKey.localeCompare(existing.fileKey) < 0
}

async function fetchText(path: string): Promise<string> {
  try {
    const response = await fetch(withDataRequestVersion(path), { cache: 'no-store' })
    if (!response.ok) {
      return ''
    }

    return await response.text()
  } catch {
    return ''
  }
}

function parseJson(raw: string): unknown | null {
  const trimmed = raw.trim()
  if (!trimmed) {
    return null
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    return null
  }
}

async function loadJsonFileIndex(path: string): Promise<string[]> {
  const parsed = parseJson(await fetchText(path))
  return Array.isArray(parsed)
    ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function parseEventRecords(raw: string): EventGameRecord[] {
  const parsed = parseJson(raw)
  return Array.isArray(parsed) ? (parsed as EventGameRecord[]) : []
}

const eventFilenames = await loadJsonFileIndex('/data/events/index.json')

export const loadedEventFiles = (
  await Promise.all(
    eventFilenames.map(async (filename) => {
      const path = `/data/events/${filename}`
      const value = await fetchText(path)
      return {
        path,
        fileKey: filename.replace('.json', ''),
        records: parseEventRecords(value),
      }
    }),
  )
).sort((a, b) => a.fileKey.localeCompare(b.fileKey))

export const loadedEventGames: LoadedEventGame[] = (() => {
  const byGameId = new Map<string, LoadedEventGame>()

  for (const file of loadedEventFiles) {
    for (const record of file.records) {
      const game = record.GamesUpdate[0]
      if (!game) {
        continue
      }

      const entry: LoadedEventGame = {
        fileKey: file.fileKey,
        gameId: String(game.Id),
        record,
        game,
      }

      if (excludedGameIds.has(entry.gameId)) {
        continue
      }

      const existing = byGameId.get(entry.gameId)
      if (!existing || shouldReplaceEventGame(existing, entry)) {
        byGameId.set(entry.gameId, entry)
      }
    }
  }

  return [...byGameId.values()].sort((a, b) => a.gameId.localeCompare(b.gameId))
})()

export const eventGamesById = loadedEventGames.reduce((map, entry) => {
  const list = map.get(entry.gameId) ?? []
  list.push(entry)
  map.set(entry.gameId, list)
  return map
}, new Map<string, LoadedEventGame[]>())

export function getEventGameById(gameId: string): LoadedEventGame | null {
  const entries = eventGamesById.get(gameId)
  if (!entries || entries.length === 0) {
    return null
  }

  return entries[0]
}
