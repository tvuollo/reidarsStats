import type { EventGameInfo, EventGameRecord } from '../types/events'
import { excludedGameIds } from './seasons'

export interface LoadedEventGame {
  fileKey: string
  gameId: string
  record: EventGameRecord
  game: EventGameInfo
}

async function fetchText(path: string): Promise<string> {
  try {
    const response = await fetch(path)
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

export const loadedEventGames: LoadedEventGame[] = loadedEventFiles.flatMap((file) =>
  file.records
    .map((record) => {
      const game = record.GamesUpdate[0]
      if (!game) {
        return null
      }

      return {
        fileKey: file.fileKey,
        gameId: String(game.Id),
        record,
        game,
      }
    })
    .filter((entry): entry is LoadedEventGame => entry !== null)
    .filter((entry) => !excludedGameIds.has(entry.gameId)),
)

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
