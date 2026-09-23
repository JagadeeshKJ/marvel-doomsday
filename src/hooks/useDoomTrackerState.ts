import { useEffect, useState } from 'react'
import {
  initialTrackerPreferences, isTrackerPreferences, TRACKER_STORAGE_KEY,
  type TrackerPreferences,
} from '../utils/doomTracker'

interface StoredTracker {
  preferences: TrackerPreferences
  error: string | null
  canPersist: boolean
}

function readTracker(): StoredTracker {
  let raw: string | null
  try {
    raw = localStorage.getItem(TRACKER_STORAGE_KEY)
  } catch {
    return {
      preferences: initialTrackerPreferences(), canPersist: false,
      error: 'Browser storage is unavailable. Changes will only last for this visit.',
    }
  }
  if (!raw) return { preferences: initialTrackerPreferences(), error: null, canPersist: true }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return {
      preferences: initialTrackerPreferences(), canPersist: false,
      error: 'Your saved tracker could not be read. Reset local data in your profile to save again.',
    }
  }
  if (!isTrackerPreferences(parsed)) {
    if (typeof parsed === 'object' && parsed !== null && (parsed as any).version === 1) {
      parsed = { ...parsed, version: 2, theme: initialTrackerPreferences().theme }
      if (isTrackerPreferences(parsed)) {
        return { preferences: parsed as TrackerPreferences, error: null, canPersist: true }
      }
    }
    return {
      preferences: initialTrackerPreferences(), canPersist: false,
      error: 'Your saved tracker has an unsupported format. Reset local data in your profile to save again.',
    }
  }
  return { preferences: parsed, error: null, canPersist: true }
}

export function useDoomTrackerState() {
  const [initial] = useState(readTracker)
  const [preferences, setPreferences] = useState(initial.preferences)
  const [storageError, setStorageError] = useState(initial.error)
  const [canPersist, setCanPersist] = useState(initial.canPersist)

  useEffect(() => {
    if (!canPersist) return
    try {
      localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(preferences))
      setStorageError(null)
    } catch {
      setStorageError('Your changes could not be saved in this browser. They will only last for this visit.')
    }
  }, [preferences, canPersist])

  function resetTracker(): boolean {
    try {
      localStorage.removeItem(TRACKER_STORAGE_KEY)
    } catch {
      setStorageError('Local data could not be reset. Check your browser storage permissions and try again.')
      return false
    }
    setPreferences(initialTrackerPreferences())
    setCanPersist(true)
    setStorageError(null)
    return true
  }

  return { preferences, setPreferences, storageError, resetTracker }
}
