import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { DoomTrackerProvider } from '../../contexts/DoomTrackerContext'
import { initialTrackerPreferences, TRACKER_STORAGE_KEY, toLocalDateTime } from '../../utils/doomTracker'
import DoomTracker from './DoomTracker'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', '') } },
    close: { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open') } },
  })
})

afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
})

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderTracker() {
  return render(<DoomTrackerProvider><DoomTracker /></DoomTrackerProvider>)
}

function navigate(name: RegExp) {
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', { name }))
}

function movieCard(title: string): HTMLElement {
  const scope = screen.queryByRole('dialog') ?? document.body
  const card = within(scope).getByRole('heading', { name: title, level: 3 }).closest('article')
  if (!card) throw new Error(`Movie card for ${title} was not rendered.`)
  return card
}

describe('DOOM Tracker experience', () => {
  it('renders a working dashboard with an enabled spoiler shield', () => {
    renderTracker()
    expect(screen.getByRole('heading', { name: 'Big things are coming.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'DOOMSDAY.' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Spoiler shield' })).toHaveAttribute('aria-checked', 'true')
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}').watchlist).toHaveLength(4)
  })

  it('closes mobile navigation even when a browser host has handled Escape', () => {
    renderTracker()
    const menu = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    escape.preventDefault()
    fireEvent(window, escape)
    expect(menu).toHaveAttribute('aria-expanded', 'false')
  })

  it('skips to content without changing the current hash-routed page', () => {
    renderTracker()
    navigate(/^Marvel news/)
    fireEvent.click(screen.getByRole('link', { name: 'Skip to content' }))
    expect(screen.getByRole('main')).toHaveFocus()
    expect(window.location.hash).toBe('#news')
    expect(screen.getByRole('heading', { name: 'Stay ahead of the story.' })).toBeInTheDocument()
  })

  it('adds, marks, filters, and persists a watchlist across remounts', () => {
    const app = renderTracker()
    navigate(/^My watchlist/)
    fireEvent.click(screen.getByRole('button', { name: 'Add a title' }))
    fireEvent.click(within(movieCard('Avengers: Doomsday')).getByRole('button', { name: 'Add to watchlist' }))
    expect(within(movieCard('Avengers: Doomsday')).getByRole('button', { name: 'On your list' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    fireEvent.click(within(movieCard('Avengers: Endgame')).getByRole('button', { name: 'Mark watched' }))
    fireEvent.click(within(screen.getByRole('group', { name: 'Watchlist status' })).getByRole('button', { name: 'Watched' }))
    expect(screen.getByRole('heading', { name: 'Avengers: Endgame', level: 3 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Avengers: Doomsday', level: 3 })).not.toBeInTheDocument()
    app.unmount()
    renderTracker()
    const saved = JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}')
    expect(saved.watchlist).toContain('doomsday')
    expect(saved.watched).toContain('endgame')
    expect(screen.getByRole('heading', { name: 'Avengers: Doomsday', level: 3 })).toBeInTheDocument()
  })

  it('removes a title and shows a useful empty search state', () => {
    renderTracker()
    navigate(/^My watchlist/)
    fireEvent.click(screen.getByRole('button', { name: 'Remove Avengers: Endgame from watchlist' }))
    expect(screen.queryByRole('heading', { name: 'Avengers: Endgame', level: 3 })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: 'Search your watchlist' }), { target: { value: 'does-not-exist' } })
    expect(screen.getByText('No titles match this view.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show all titles' }))
    expect(screen.getByRole('heading', { name: 'Loki', level: 3 })).toBeInTheDocument()
  })

  it('filters news categories and keeps saved articles', () => {
    renderTracker()
    navigate(/^Marvel news/)
    fireEvent.click(screen.getByRole('button', { name: 'TV & series' }))
    expect(screen.getByRole('heading', { name: 'A little mischief. A lot of multiverse.' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'New mask. Same legend. A whole new threat.' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Save A little mischief. A lot of multiverse.' }))
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}').savedArticles).toContain('loki-guide')
    fireEvent.click(screen.getByRole('button', { name: 'Saved (1)' }))
    expect(screen.getByRole('heading', { name: 'A little mischief. A lot of multiverse.' })).toBeInTheDocument()
  })

  it('blocks spoilers, allows a one-article reveal, and protects it again on reopen', () => {
    renderTracker()
    navigate(/^Marvel news/)
    expect(screen.queryByText('Thunderbolts*: the team behind the asterisk.')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /A briefing from beyond the spoiler shield.*Review spoiler warning/ }))
    expect(screen.getByRole('heading', { name: 'Your shield has your back.' })).toBeInTheDocument()
    expect(screen.queryByText(/being presented as the New Avengers/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reveal this article' }))
    expect(screen.getByText(/being presented as the New Avengers/)).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Spoiler shield' })).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    fireEvent.click(screen.getByRole('button', { name: /A briefing from beyond the spoiler shield.*Review spoiler warning/ }))
    expect(screen.queryByText(/being presented as the New Avengers/)).not.toBeInTheDocument()
  })

  it('searches characters and does not expose protected news through search', () => {
    renderTracker()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    const search = screen.getByRole('textbox', { name: 'Search the multiverse' })
    expect(search).toHaveFocus()
    fireEvent.change(search, { target: { value: 'asterisk' } })
    expect(screen.getByText('0 results for "asterisk"')).toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'Victor' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Doctor Doom.*Victor von Doom/ }))
    expect(screen.getByRole('heading', { name: 'Doctor Doom', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Genius intellect')).toBeInTheDocument()
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search the multiverse' }), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('persists the global spoiler preference', () => {
    renderTracker()
    fireEvent.click(screen.getByRole('switch', { name: 'Spoiler shield' }))
    navigate(/^Marvel news/)
    expect(screen.getByRole('heading', { name: 'Thunderbolts*: the team behind the asterisk.' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}').spoilerShield).toBe(false)
  })

  it('creates, completes, and removes a persistent reminder', () => {
    renderTracker()
    navigate(/^Reminders/)
    fireEvent.click(screen.getByRole('button', { name: 'Create reminder' }))
    fireEvent.change(screen.getByLabelText('What are we looking forward to?'), { target: { value: 'Doom movie night' } })
    fireEvent.change(screen.getByLabelText('When should we remind you?'), { target: { value: toLocalDateTime(new Date(Date.now() + 86400000)) } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Create reminder' }))
    expect(screen.getByRole('heading', { name: 'Doom movie night' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}').reminders).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Mark Doom movie night as complete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByRole('heading', { name: 'Doom movie night' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Delete Doom movie night' }))
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}').reminders).toHaveLength(0)
  })

  it('rejects past reminders without saving them', () => {
    renderTracker()
    fireEvent.click(screen.getByRole('button', { name: 'Remind me' }))
    fireEvent.change(screen.getByLabelText('When should we remind you?'), { target: { value: '2020-01-01T09:00' } })
    const form = screen.getByLabelText('When should we remind you?').closest('form')
    if (!form) throw new Error('Reminder form is missing.')
    fireEvent.submit(form)
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a date and time in the future.')
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}').reminders).toHaveLength(0)
  })

  it('surfaces reminders that became due while away, but skips completed reminders', () => {
    const preferences = initialTrackerPreferences()
    const at = new Date(Date.now() - 60000).toISOString()
    preferences.reminders = [
      { id: 'due-reminder', title: 'Time for a Marvel night', at, completed: false },
      { id: 'finished-reminder', title: 'Already watched', at, completed: true },
    ]
    localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(preferences))
    renderTracker()
    expect(screen.getByRole('status')).toHaveTextContent('Reminder: Time for a Marvel night')
    navigate(/^Reminders/)
    expect(screen.getByText('Due now')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Already watched' })).not.toBeInTheDocument()
  })

  it('shows actual ticket-provider links for the selected region', () => {
    renderTracker()
    navigate(/^Tickets & releases/)
    expect(screen.getByRole('link', { name: /Fandango/ })).toHaveAttribute('href', 'https://www.fandango.com/')
    fireEvent.change(screen.getByRole('combobox', { name: 'Ticket region' }), { target: { value: 'India' } })
    expect(screen.getByRole('link', { name: /BookMyShow/ })).toHaveAttribute('href', 'https://in.bookmyshow.com/')
    expect(screen.getByText(/does not sell tickets or confirm/)).toBeInTheDocument()
  })

  it('updates the local explorer profile', () => {
    renderTracker()
    fireEvent.click(screen.getByRole('button', { name: 'Edit explorer profile' }))
    fireEvent.change(screen.getByLabelText('Your explorer name'), { target: { value: 'Doom Squad' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save profile' }))
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}').name).toBe('Doom Squad')
    expect(screen.getByRole('button', { name: 'Edit profile for Doom Squad' })).toBeInTheDocument()
  })

  it('surfaces unreadable storage and requires confirmation before resetting only its own data', () => {
    localStorage.setItem(TRACKER_STORAGE_KEY, '{broken')
    localStorage.setItem('another-app', 'keep-me')
    renderTracker()
    expect(screen.getByRole('alert')).toHaveTextContent('Your saved tracker could not be read.')
    expect(localStorage.getItem(TRACKER_STORAGE_KEY)).toBe('{broken')
    fireEvent.click(screen.getByRole('button', { name: 'Edit explorer profile' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset local tracker data' }))
    expect(localStorage.getItem(TRACKER_STORAGE_KEY)).toBe('{broken')
    fireEvent.click(screen.getByRole('button', { name: 'Reset my tracker' }))
    expect(localStorage.getItem('another-app')).toBe('keep-me')
    expect(JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY) ?? '{}')).toEqual(initialTrackerPreferences())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('reports write failures rather than claiming changes have been persisted', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Quota exceeded', 'QuotaExceededError') })
    renderTracker()
    expect(screen.getByRole('alert')).toHaveTextContent('Your changes could not be saved in this browser.')
  })
})
