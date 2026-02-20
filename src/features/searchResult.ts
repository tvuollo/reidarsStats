import type { EventGameLog } from '../types/events'
import { getEventTypeLabel } from './eventTypes'

export function generateMatchedString(matchedStrings: string[], logs: EventGameLog[] | undefined): string {
  if (matchedStrings.length === 0) {
    return ''
  }

  if (matchedStrings[0] === 'team') {
    return 'Joukkue'
  }

  if (matchedStrings[0] === 'player' && logs) {
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
