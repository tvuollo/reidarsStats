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

export const validSeasons = loadedSeasons
  .filter((season) => validSeasonKeys.has(season.seasonKey))
  .map((season) => ({
    seasonKey: season.seasonKey,
    data: stripSensitivePlayerFields(season.data as SeasonData),
  }))

export function seasonLabel(seasonKey: string): string {
  return seasonKey.replace('season', '')
}
