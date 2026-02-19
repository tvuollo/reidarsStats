import { TARGET_TEAM_ID } from '../constants/team'
import { validSeasons, validationResults } from '../data/seasons'
import { calculateTeamTotalsAcrossSeasons, getTeamStatGroupDetail } from '../utils/season'

export const reidarsTotals = calculateTeamTotalsAcrossSeasons(validSeasons, TARGET_TEAM_ID)

export function getReidarsStatGroupDetail(seasonKey: string, statGroupId: string) {
  return getTeamStatGroupDetail(validSeasons, TARGET_TEAM_ID, seasonKey, statGroupId)
}

export const reidarsValidationResults = validationResults
export const reidarsInvalidSeasonFiles = reidarsValidationResults.filter((result) => !result.valid)
export const reidarsSeasonDataCompatible = reidarsInvalidSeasonFiles.length === 0
