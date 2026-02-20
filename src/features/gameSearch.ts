import { loadedEventGames } from '../data/events'
import type { EventGameLog } from '../types/events'

export interface GameSearchResult {
  gameId: string
  eventFileKey: string
  statGroupName: string
  date: string
  homeTeamName: string
  awayTeamName: string
  homeGoals: number
  awayGoals: number
  matchedIn: string[]
  matchedPlayerLogs: EventGameLog[]
}

function normalize(value: string): string {
  return value.toLowerCase().trim()
}

function compact(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function includesQuery(value: string, query: string): boolean {
  return normalize(value).includes(query)
}

function playerLogValues(log: EventGameLog): string[] {
  return [
    log.Name,
    log.ScorerName,
    log.GoalkeeperName,
    log.FirstAssistName,
    log.SecondAssistName,
    log.SuffererNames,
  ].filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function matchingPlayerLogs(logs: EventGameLog[], query: string): EventGameLog[] {
  return logs.filter((log) => playerLogValues(log).some((value) => includesQuery(value, query)))
}

function logSignature(log: EventGameLog): string {
  return [
    log.Key ?? '',
    log.Type,
    String(log.TeamId),
    String(log.Period),
    String(log.GameTime),
    log.Name ?? '',
    log.ScorerName ?? '',
    log.GoalkeeperName ?? '',
    log.FirstAssistName ?? '',
    log.SecondAssistName ?? '',
    log.SuffererNames ?? '',
  ].join('|')
}

export function searchGames(queryInput: string): GameSearchResult[] {
  const query = normalize(queryInput)
  if (!query) {
    return []
  }

  const byGameId = new Map<string, GameSearchResult>()

  for (const entry of loadedEventGames) {
    const game = entry.game
    const matchedIn = new Set<string>()
    const matchedLogs = matchingPlayerLogs(entry.record.GameLogsUpdate, query)

    if (includesQuery(game.HomeTeam.Name, query) || includesQuery(game.AwayTeam.Name, query)) {
      matchedIn.add('team')
    }

    if (matchedLogs.length > 0) {
      matchedIn.add('player')
    }

    if (matchedIn.size === 0) {
      continue
    }

    const existing = byGameId.get(entry.gameId)
    if (existing) {
      const merged = new Set([...existing.matchedIn, ...matchedIn])
      existing.matchedIn = [...merged]
      const existingSignatures = new Set(existing.matchedPlayerLogs.map(logSignature))
      for (const log of matchedLogs) {
        const signature = logSignature(log)
        if (existingSignatures.has(signature)) {
          continue
        }

        existing.matchedPlayerLogs.push(log)
        existingSignatures.add(signature)
      }
      continue
    }

    byGameId.set(entry.gameId, {
      gameId: entry.gameId,
      eventFileKey: entry.fileKey,
      statGroupName: game.StatGroupName,
      date: compact(game.StartDate),
      homeTeamName: game.HomeTeam.Name,
      awayTeamName: game.AwayTeam.Name,
      homeGoals: game.HomeTeam.Goals,
      awayGoals: game.AwayTeam.Goals,
      matchedIn: [...matchedIn],
      matchedPlayerLogs: matchedLogs,
    })
  }

  const results = [...byGameId.values()]
  results.sort((a, b) => {
    const aParts = a.date.split('.').map(Number)
    const bParts = b.date.split('.').map(Number)
    const aTime = new Date(aParts[2] ?? 0, (aParts[1] ?? 1) - 1, aParts[0] ?? 1).getTime()
    const bTime = new Date(bParts[2] ?? 0, (bParts[1] ?? 1) - 1, bParts[0] ?? 1).getTime()
    return bTime - aTime
  })

  return results
}
