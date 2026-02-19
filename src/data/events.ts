import type { EventGameInfo, EventGameRecord } from '../types/events'

export interface LoadedEventGame {
  fileKey: string
  gameId: string
  record: EventGameRecord
  game: EventGameInfo
}

const eventModules = import.meta.glob('./events/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export const loadedEventFiles = Object.entries(eventModules)
  .map(([path, value]) => ({
    path,
    fileKey: path.split('/').pop()?.replace('.json', '') ?? path,
    records: value as EventGameRecord[],
  }))
  .sort((a, b) => a.fileKey.localeCompare(b.fileKey))

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
    .filter((entry): entry is LoadedEventGame => entry !== null),
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
