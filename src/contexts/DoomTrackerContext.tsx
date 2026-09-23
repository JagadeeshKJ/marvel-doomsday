import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { articles, movies, viewLabels, type TrackerView } from '../components/DoomTracker/data'
import { useDoomTrackerState } from '../hooks/useDoomTrackerState'
import { validateReminder } from '../utils/doomTracker'
import { themes } from '../utils/themes'

export type TrackerDialog =
  | { type: 'article' | 'movie' | 'character'; id: string }
  | { type: 'reminder'; title?: string; at?: string }
  | { type: 'search' | 'profile' | 'about' | 'catalog' | 'theme' }
  | null

function currentView(): TrackerView {
  const hash = window.location.hash.slice(1)
  return Object.keys(viewLabels).includes(hash) ? hash as TrackerView : 'overview'
}

function useTrackerController() {
  const { preferences, setPreferences, storageError, resetTracker } = useDoomTrackerState()
  const [view, setView] = useState<TrackerView>(currentView)
  const [dialog, setDialog] = useState<TrackerDialog>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now)
  const notified = useRef(new Set<string>())
  const notify = useCallback((message: string) => setToast(message), [])
  const closeDialog = useCallback(() => setDialog(null), [])

  useEffect(() => {
    const onHash = () => setView(currentView())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const due = preferences.reminders.filter(item => !item.completed && Date.parse(item.at) <= now && !notified.current.has(item.id))
    if (!due.length) return
    due.forEach(item => notified.current.add(item.id))
    notify(due.length === 1 ? `Reminder: ${due[0].title}` : `${due.length} reminders are due. Visit Reminders to see them.`)
  }, [now, preferences.reminders, notify])

  useEffect(() => {
    const theme = themes.find(t => t.name === preferences.theme) || themes[0]
    const root = document.documentElement
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-background', theme.background)
    root.style.setProperty('--theme-accent', theme.accent)
    root.style.setProperty('--theme-surface', theme.surface)
    root.style.setProperty('--theme-heading', theme.headingText)
    root.style.setProperty('--theme-body', theme.bodyText)
    root.style.setProperty('--theme-muted', theme.muted)
  }, [preferences.theme])

  function navigate(nextView: TrackerView) {
    window.location.hash = nextView
    setView(nextView)
    setDialog(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function toggleWatchlist(id: string) {
    const movie = movies.find(item => item.id === id)
    if (!movie) throw new Error('Unknown watchlist title.')
    const removing = preferences.watchlist.includes(id)
    setPreferences(previous => ({
      ...previous,
      watchlist: removing ? previous.watchlist.filter(item => item !== id) : [...previous.watchlist, id],
    }))
    notify(removing ? `${movie.title} removed from your watchlist.` : `${movie.title} added to your watchlist.`)
  }

  function toggleWatched(id: string) {
    const movie = movies.find(item => item.id === id)
    if (!movie) throw new Error('Unknown watched title.')
    const watched = preferences.watched.includes(id)
    setPreferences(previous => ({
      ...previous,
      watched: watched ? previous.watched.filter(item => item !== id) : [...previous.watched, id],
    }))
    notify(watched ? `${movie.title} marked as unwatched.` : `${movie.title} marked as watched. Nice one!`)
  }

  function toggleSavedArticle(id: string) {
    if (!articles.some(article => article.id === id)) throw new Error('Unknown article.')
    const saved = preferences.savedArticles.includes(id)
    setPreferences(previous => ({
      ...previous,
      savedArticles: saved ? previous.savedArticles.filter(item => item !== id) : [...previous.savedArticles, id],
    }))
    notify(saved ? 'Article removed from saved reads.' : 'Article saved for later.')
  }

  function toggleShield() {
    setPreferences(previous => ({ ...previous, spoilerShield: !previous.spoilerShield }))
    notify(preferences.spoilerShield ? 'Spoiler shield is off. Spoiler discussions are now visible.' : 'Spoiler shield is on. Explore without surprises.')
  }

  function addReminder(title: string, at: string): string | null {
    const error = validateReminder(title, at)
    if (error) return error
    setPreferences(previous => ({
      ...previous,
      reminders: [...previous.reminders, { id: crypto.randomUUID(), title: title.trim(), at: new Date(at).toISOString(), completed: false }],
    }))
    notify('Reminder set. Find it in Reminders or export it to your calendar.')
    return null
  }

  function toggleReminder(id: string) {
    setPreferences(previous => ({
      ...previous, reminders: previous.reminders.map(item => item.id === id ? { ...item, completed: !item.completed } : item),
    }))
  }

  function removeReminder(id: string) {
    setPreferences(previous => ({ ...previous, reminders: previous.reminders.filter(item => item.id !== id) }))
    notify('Reminder deleted.')
  }

  function saveName(name: string) {
    if (!name.trim() || name.trim().length > 40) throw new Error('Profile name must be between 1 and 40 characters.')
    setPreferences(previous => ({ ...previous, name: name.trim() }))
    notify('Your explorer profile has been updated.')
  }

  function setTheme(themeName: string) {
    setPreferences(previous => ({ ...previous, theme: themeName }))
    notify(`Theme updated to ${themeName}.`)
  }

  function reset() {
    const success = resetTracker()
    if (success) {
      notified.current.clear()
      notify('Your local tracker has been reset.')
    }
    return success
  }

  return {
    preferences, storageError, view, dialog, toast, now, navigate, setDialog, closeDialog, notify,
    toggleWatchlist, toggleWatched, toggleSavedArticle, toggleShield, addReminder, toggleReminder,
    removeReminder, saveName, setTheme, reset, dismissToast: () => setToast(null),
  }
}

const DoomTrackerContext = createContext<ReturnType<typeof useTrackerController> | null>(null)

interface DoomTrackerProviderProps {
  children: ReactNode
}

export function DoomTrackerProvider({ children }: DoomTrackerProviderProps) {
  return <DoomTrackerContext.Provider value={useTrackerController()}>{children}</DoomTrackerContext.Provider>
}

export function useDoomTracker() {
  const context = useContext(DoomTrackerContext)
  if (!context) throw new Error('DOOM Tracker components must be inside DoomTrackerProvider.')
  return context
}
