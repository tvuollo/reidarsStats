export function getEventTypeLabel(type: string): string {
  switch (type) {
    case 'GK_start':
      return 'Maalivahti aloittaa'
    case 'GK_in':
      return 'Maalivahti sisään'
    case 'GK_out':
      return 'Maalivahti pois'
    case 'Goal':
      return 'Maali'
    case 'Penalty':
      return 'Rangaistus'
    default:
      return ''
  }
}
