import type { EventGameLog } from '../types/events'
import type { SearchContributionSummary } from './gameSearch'
import { getEventTypeLabel } from './eventTypes'

function contributionLabels(summary: SearchContributionSummary): string[] {
  const labels: string[] = []

  if (summary.goalCount > 0) {
    labels.push(`Maali (${summary.goalCount})`)
  }

  if (summary.assistCount > 0) {
    labels.push(`Syöttö (${summary.assistCount})`)
  }

  return labels
}

export function generateMatchedString(
  matchedStrings: string[],
  logs: EventGameLog[] | undefined,
  contributionSummary: SearchContributionSummary,
): string {
  if (matchedStrings.length === 0) {
    return ''
  }

  const contributionMatches = contributionLabels(contributionSummary)
  if (contributionMatches.length > 0) {
    return contributionMatches.join(', ')
  }

  if (matchedStrings.includes('team') && !matchedStrings.includes('player')) {
    return 'Joukkue'
  }

  if (matchedStrings.includes('player') && logs) {
    const eventTypes: string[] = []
    logs.forEach((log) => {
      const eventType = getEventTypeLabel(log.Type)
      if (eventTypes.indexOf(eventType) === -1) {
        eventTypes.push(eventType)
      }
    })
    return eventTypes.join(', ')
  }

  return ''
}
