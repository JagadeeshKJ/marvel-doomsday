import { articles, movies } from '../components/DoomTracker/data'

export const TRACKER_STORAGE_KEY = 'doom-tracker:v1'

export interface TrackerReminder {
  id: string
  title: string
  at: string
  completed: boolean
}

export interface TrackerPreferences {
  version: 1
  name: string
  watchlist: string[]
  watched: string[]
  savedArticles: string[]
  spoilerShield: boolean
  reminders: TrackerReminder[]
}

export function initialTrackerPreferences(): TrackerPreferences {
  return {
    version: 1,
    name: 'True Believer',
    watchlist: ['endgame', 'loki', 'fantastic-four', 'thunderbolts'],
    watched: [],
    savedArticles: [],
    spoilerShield: true,
    reminders: [],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isKnownIds(value: unknown, known: string[]): value is string[] {
  return Array.isArray(value) && value.every(id => typeof id === 'string' && known.includes(id))
    && new Set(value).size === value.length
}

export function isTrackerPreferences(value: unknown): value is TrackerPreferences {
  if (!isRecord(value)) return false
  const movieIds = movies.map(movie => movie.id)
  return value.version === 1
    && typeof value.name === 'string' && value.name.trim().length > 0 && value.name.length <= 40
    && isKnownIds(value.watchlist, movieIds)
    && isKnownIds(value.watched, movieIds)
    && isKnownIds(value.savedArticles, articles.map(article => article.id))
    && typeof value.spoilerShield === 'boolean'
    && Array.isArray(value.reminders)
    && value.reminders.every(reminder => isRecord(reminder)
      && typeof reminder.id === 'string' && /^[a-zA-Z0-9-]+$/.test(reminder.id)
      && typeof reminder.title === 'string' && reminder.title.trim().length > 0 && reminder.title.length <= 80
      && typeof reminder.at === 'string' && Number.isFinite(Date.parse(reminder.at))
      && typeof reminder.completed === 'boolean')
    && new Set(value.reminders.map(reminder => reminder.id)).size === value.reminders.length
}

export function getCountdown(target: string, now: number) {
  const remaining = Math.max(0, Math.floor((Date.parse(target) - now) / 1000))
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining / 3600) % 24,
    minutes: Math.floor(remaining / 60) % 60,
    seconds: remaining % 60,
    released: remaining === 0,
  }
}

export function toLocalDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function validateReminder(title: string, at: string, now = Date.now()): string | null {
  if (!title.trim()) return 'Give your reminder a title.'
  if (title.trim().length > 80) return 'Keep your reminder title under 81 characters.'
  if (!Number.isFinite(Date.parse(at))) return 'Choose a valid date and time.'
  if (Date.parse(at) <= now) return 'Choose a date and time in the future.'
  return null
}

function escapeCalendarText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\r\n|\n|\r/g, '\\n').replace(/[,;]/g, '\\$&')
}

function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder()
  let result = ''
  let bytes = 0
  for (const character of line) {
    const size = encoder.encode(character).length
    if (bytes + size > 75) {
      result += '\r\n '
      bytes = 1
    }
    result += character
    bytes += size
  }
  return result
}

export function reminderCalendar(reminder: TrackerReminder, now = new Date()): string {
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DOOM Tracker//Reminders//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:${reminder.id}@doom-tracker.local`, `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(new Date(reminder.at))}`,
    `DTEND:${stamp(new Date(Date.parse(reminder.at) + 30 * 60000))}`,
    `SUMMARY:${escapeCalendarText(reminder.title)}`,
    'DESCRIPTION:Your DOOM Tracker reminder. Release dates may change.',
    'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:DOOM Tracker reminder',
    'END:VALARM', 'END:VEVENT', 'END:VCALENDAR', '',
  ].map(foldCalendarLine).join('\r\n')
}
