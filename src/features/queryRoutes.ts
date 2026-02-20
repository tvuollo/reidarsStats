export function homeUrl(): string {
  return '/?view=home'
}

export function seasonUrl(seasonKey: string, statGroupId: string): string {
  const params = new URLSearchParams({
    view: 'season',
    file: seasonKey,
    statgroupid: statGroupId,
  })
  return `/?${params.toString()}`
}

export function gameUrl(gameId: string): string {
  const params = new URLSearchParams({
    view: 'game',
    gameid: gameId,
  })
  return `/?${params.toString()}`
}

export function searchUrl(query: string): string {
  const params = new URLSearchParams({
    view: 'search',
    query,
  })
  return `/?${params.toString()}`
}
