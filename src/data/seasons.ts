import type { SeasonData } from '../types/season'
import { getSeasonKeyFromPath, validateSeasonData } from '../utils/season'

const dataRequestVersion = Date.now().toString(36)

function withDataRequestVersion(path: string): string {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}v=${dataRequestVersion}`
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

const seasonFilenames = await loadJsonFileIndex('/data/season/index.json')

export const loadedSeasons = (
  await Promise.all(
    seasonFilenames.map(async (filename) => {
      const path = `/data/season/${filename}`
      const data = parseJson(await fetchText(path))
      return {
        path,
        seasonKey: getSeasonKeyFromPath(filename),
        data,
      }
    }),
  )
).sort((a, b) => a.seasonKey.localeCompare(b.seasonKey))

export const validationResults = loadedSeasons.map((season) =>
  validateSeasonData(season.data, season.seasonKey),
)

const validSeasonKeys = new Set(
  validationResults.filter((result) => result.valid).map((result) => result.seasonKey),
)

interface StatGroupExclusion {
  seasonKey: string
  statGroupId: string
}

export const excludedStatGroups: StatGroupExclusion[] = [
  { seasonKey: 'season2014', statGroupId: '2275' },
  { seasonKey: 'season2015', statGroupId: '2278' },
]

function excludedStatGroupIdsForSeason(seasonKey: string): Set<string> {
  return new Set(
    excludedStatGroups
      .filter((item) => item.seasonKey === seasonKey)
      .map((item) => item.statGroupId),
  )
}

function gameStatGroupId(game: SeasonData['Games'][number]): string {
  return game.StatGroupID || game.SerieID || ''
}

function stripSensitivePlayerFields(data: SeasonData): SeasonData {
  return {
    ...data,
    Players: data.Players.map((player) => {
      const { DateOfBirth: _dateOfBirth, BirthDate: _birthDate, PlayerAge: _playerAge, ...safePlayer } =
        player as SeasonData['Players'][number] & {
          DateOfBirth?: unknown
          BirthDate?: unknown
          PlayerAge?: unknown
        }
      return safePlayer
    }),
  }
}

function excludeStatGroups(data: SeasonData, seasonKey: string): SeasonData {
  const excludedIds = excludedStatGroupIdsForSeason(seasonKey)
  if (excludedIds.size === 0) {
    return data
  }

  return {
    ...data,
    StatGroups: data.StatGroups.filter((group) => !excludedIds.has(group.StatGroupID)),
    Standings: data.Standings.filter((standing) => !excludedIds.has(standing.StatGroupID)),
    Games: data.Games.filter((game) => !excludedIds.has(gameStatGroupId(game))),
    TopScorers: data.TopScorers.filter(
      (scorer) => !scorer.StatGroupID || !excludedIds.has(scorer.StatGroupID),
    ),
  }
}

export const excludedGameIds = new Set(
  loadedSeasons
    .filter((season) => validSeasonKeys.has(season.seasonKey))
    .flatMap((season) => {
      const excludedIds = excludedStatGroupIdsForSeason(season.seasonKey)
      if (excludedIds.size === 0) {
        return []
      }

      const data = season.data as SeasonData
      return data.Games
        .filter((game) => excludedIds.has(gameStatGroupId(game)))
        .map((game) => String(game.GameID))
    }),
)

export const validSeasons = loadedSeasons
  .filter((season) => validSeasonKeys.has(season.seasonKey))
  .map((season) => ({
    seasonKey: season.seasonKey,
    data: excludeStatGroups(stripSensitivePlayerFields(season.data as SeasonData), season.seasonKey),
  }))

export function seasonLabel(seasonKey: string): string {
  return seasonKey.replace('season', '')
}
