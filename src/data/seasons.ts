import type { SeasonData } from '../types/season'
import { getSeasonKeyFromPath, validateSeasonData } from '../utils/season'

const seasonModules = import.meta.glob('./season/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export const loadedSeasons = Object.entries(seasonModules)
  .map(([path, data]) => ({
    path,
    seasonKey: getSeasonKeyFromPath(path),
    data,
  }))
  .sort((a, b) => a.seasonKey.localeCompare(b.seasonKey))

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
