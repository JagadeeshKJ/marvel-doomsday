import { describe, expect, it } from 'vitest'
import {
  getCountdown, initialTrackerPreferences, isTrackerPreferences,
  reminderCalendar, toLocalDateTime, validateReminder,
} from './doomTracker'

describe('DOOM Tracker countdown', () => {
  it('splits the remaining time into days, hours, minutes, and seconds', () => {
    const target = '2026-12-18T05:00:00Z'
    const now = Date.parse(target) - (3 * 86400 + 2 * 3600 + 8 * 60 + 11) * 1000
    expect(getCountdown(target, now)).toEqual({ days: 3, hours: 2, minutes: 8, seconds: 11, released: false })
  })

  it('does not count below zero after release', () => {
    expect(getCountdown('2026-12-18T05:00:00Z', Date.parse('2027-01-01T00:00:00Z')))
      .toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, released: true })
  })
})

describe('DOOM Tracker local data validation', () => {
  it('accepts the starter preferences and independent copies', () => {
    const first = initialTrackerPreferences()
    expect(isTrackerPreferences(first)).toBe(true)
    first.watchlist.push('doomsday')
    expect(initialTrackerPreferences().watchlist).not.toContain('doomsday')
  })

  it.each([
    null,
    [],
    { ...initialTrackerPreferences(), version: 2 },
    { ...initialTrackerPreferences(), name: '  ' },
    { ...initialTrackerPreferences(), spoilerShield: 'yes' },
    { ...initialTrackerPreferences(), watchlist: ['missing-title'] },
    { ...initialTrackerPreferences(), watchlist: ['endgame', 'endgame'] },
    { ...initialTrackerPreferences(), savedArticles: ['missing-article'] },
    { ...initialTrackerPreferences(), reminders: [{ id: 'bad', title: '', at: 'not-a-date', completed: false }] },
    { ...initialTrackerPreferences(), reminders: [{ id: 'bad\r\nUID:injected', title: 'Movie night', at: '2026-12-18T05:00:00Z', completed: false }] },
  ])('rejects malformed or unsupported preferences %#', value => {
    expect(isTrackerPreferences(value)).toBe(false)
  })

  it('accepts valid reminders and rejects duplicate identifiers', () => {
    const reminder = { id: 'reminder-1', title: 'Movie night', at: '2026-12-18T05:00:00Z', completed: false }
    expect(isTrackerPreferences({ ...initialTrackerPreferences(), reminders: [reminder] })).toBe(true)
    expect(isTrackerPreferences({ ...initialTrackerPreferences(), reminders: [reminder, reminder] })).toBe(false)
  })
})

describe('DOOM Tracker reminders', () => {
  const now = Date.parse('2026-09-10T12:00:00Z')

  it('validates both the title and a future date', () => {
    expect(validateReminder('Movie night', '2026-09-11T12:00:00Z', now)).toBeNull()
    expect(validateReminder('  ', '2026-09-11T12:00:00Z', now)).toMatch(/title/)
    expect(validateReminder('x'.repeat(81), '2026-09-11T12:00:00Z', now)).toMatch(/under 81/)
    expect(validateReminder('Movie night', 'invalid-date', now)).toMatch(/valid date/)
    expect(validateReminder('Movie night', '2026-09-09T12:00:00Z', now)).toMatch(/future/)
    expect(validateReminder('Movie night', '2026-09-10T12:00:00Z', now)).toMatch(/future/)
  })

  it('formats a local datetime input without converting it to UTC', () => {
    const date = new Date(2026, 8, 11, 9, 7, 32)
    expect(toLocalDateTime(date)).toBe('2026-09-11T09:07')
  })

  it('exports a UTC calendar event with a real alarm and escaped text', () => {
    const calendar = reminderCalendar({
      id: 'reminder-1',
      title: 'Movie, night; bring\\snacks\nNot a new property',
      at: '2026-09-11T18:00:00Z',
      completed: false,
    }, new Date(now))
    expect(calendar).toContain('BEGIN:VCALENDAR\r\nVERSION:2.0')
    expect(calendar).toContain('DTSTART:20260911T180000Z')
    expect(calendar).toContain('DTEND:20260911T183000Z')
    expect(calendar).toContain('SUMMARY:Movie\\, night\\; bring\\\\snacks\\nNot a new property')
    expect(calendar).toContain('BEGIN:VALARM\r\nTRIGGER:-PT15M')
    expect(calendar).toContain('UID:reminder-1@doom-tracker.local')
    expect(calendar).toMatch(/END:VCALENDAR\r\n$/)
  })

  it('folds long UTF-8 calendar lines without breaking characters', () => {
    const title = '\u2605'.repeat(80)
    const calendar = reminderCalendar({ id: 'long-title', title, at: '2026-09-11T18:00:00Z', completed: false }, new Date(now))
    for (const line of calendar.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
    expect(calendar.replace(/\r\n /g, '')).toContain(`SUMMARY:${title}`)
  })
})
