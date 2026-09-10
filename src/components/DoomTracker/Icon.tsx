import type { Character } from './data'

const paths = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  news: 'M4 4h14v16H4zM18 8h3v10a2 2 0 0 1-2 2M7 8h7M7 12h7M7 16h4',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M18 8a3 3 0 0 1 0 6M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  ticket: 'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4zM15 5v3m0 3v2m0 3v3',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM8 12l3 3 5-6',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  upRight: 'M6 18 18 6M6 6h12v12',
  chevron: 'm9 5 7 7-7 7',
  plus: 'M12 5v14M5 12h14',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M6 18 18 6',
  menu: 'M3 6h18M3 12h18M3 18h18',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 2h6l1 3 3 1 3 5v2l-3 5-3 1-1 3H9l-1-3-3-1-3-5v-2l3-5 3-1z',
  calendar: 'M4 5h16v16H4zM16 3v4M8 3v4M4 10h16M8 14h2m4 0h2m-8 3h2',
  clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  play: 'm8 4 13 8-13 8z',
  film: 'M3 3h18v18H3zM7 3v18M17 3v18M3 8h4m10 0h4M3 16h4m10 0h4',
  globe: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c6 5 6 15 0 20-6-5-6-15 0-20',
  bolt: 'm13 2-9 12h7l-1 8 10-13h-8z',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  star: 'm12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z',
  info: 'M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
}

export type IconName = keyof typeof paths

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={paths[name]} /></svg>
}

export function DoomMark() {
  return <svg width="39" height="42" viewBox="0 0 42 46" fill="none" aria-hidden="true">
    <path d="M21 1 39 11v21L21 45 3 32V11Z" fill="#e53935" />
    <path d="m12 14 9-4 9 4-2 18-7 5-7-5Z" fill="#fff" />
    <path d="m13 18 6 2v4l-6-2m16-4-6 2v4l6-2M19 29h4m-2-8v7m-5 4h10" stroke="#e53935" strokeWidth="2.5" />
  </svg>
}

interface CharacterEmblemProps {
  symbol: Character['symbol']
  size?: number
}

export function CharacterEmblem({ symbol, size = 52 }: CharacterEmblemProps) {
  const characterPaths: Record<Character['symbol'], string> = {
    mask: 'M24 3 7 13l4 25 13 8 13-8 4-25ZM14 16l7 3v5l-8-3m21-5-7 3v5l8-3M24 17v13m-8 6h16m-13-5h10',
    four: 'M30 9 15 27h20M29 10v29M46 24a22 22 0 1 1-44 0 22 22 0 0 1 44 0',
    hammer: 'm12 5 22 5-5 19-22-5zM16 27l-5 17 7 2 5-17M35 14l8 2m-10 6 6 5M2 8l6 2',
    shield: 'M45 24a21 21 0 1 1-42 0 21 21 0 0 1 42 0M37 24a13 13 0 1 1-26 0 13 13 0 0 1 26 0m-13-9 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z',
    horns: 'M14 27C2 22 5 11 3 3c12 9 5 17 15 18m16 6C46 22 43 11 45 3c-12 9-5 17-15 18M14 24l10-8 10 8-2 15-8 6-8-6zM16 29l5 3m11-3-5 3',
    web: 'M24 3C8 3 6 15 8 29c2 10 16 17 16 17s14-7 16-17C42 15 40 3 24 3ZM12 19l9 4-3 8-6-4zM36 19l-9 4 3 8 6-4zM24 3v43M9 12l15 6 15-6M9 35l15-6 15 6',
  }
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={characterPaths[symbol]} /></svg>
}
