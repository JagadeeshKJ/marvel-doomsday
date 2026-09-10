import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DoomTracker from './components/DoomTracker/DoomTracker'
import { DoomTrackerProvider } from './contexts/DoomTrackerContext'

const root = document.getElementById('root')
if (!root) throw new Error('DOOM Tracker requires a root element.')

createRoot(root).render(
  <StrictMode>
    <DoomTrackerProvider>
      <DoomTracker />
    </DoomTrackerProvider>
  </StrictMode>,
)
