import { useEffect, useRef, useState } from 'react'
import { useDoomTracker } from '../../contexts/DoomTrackerContext'
import { viewLabels, type TrackerView } from './data'
import { DoomMark, Icon, type IconName } from './Icon'
import { Dashboard } from './Dashboard'
import { NewsFeed } from './NewsFeed'
import { CharactersPage, RemindersPage, TicketsPage, WatchlistPage } from './TrackerPages'
import { TrackerDialogs } from './TrackerDialogs'
import './DoomTracker.css'

const navigation: { view: TrackerView; icon: IconName; label: string }[] = [
  { view: 'overview', icon: 'grid', label: 'Overview' },
  { view: 'news', icon: 'news', label: 'Marvel news' },
  { view: 'watchlist', icon: 'bookmark', label: 'My watchlist' },
  { view: 'characters', icon: 'users', label: 'Characters' },
  { view: 'tickets', icon: 'ticket', label: 'Tickets & releases' },
  { view: 'reminders', icon: 'bell', label: 'Reminders' },
]

const pageHeadings: Record<TrackerView, { title: string; description: string }> = {
  overview: { title: 'Big things are coming.', description: 'Your front-row seat to everything Marvel.' },
  news: { title: 'Stay ahead of the story.', description: 'The announcements, guides, and conversations that matter.' },
  watchlist: { title: 'Make it a Marvel night.', description: 'A handpicked starting point. A watchlist that is entirely yours.' },
  characters: { title: 'Extraordinary is an understatement.', description: 'Meet the heroes, the antiheroes, and the man behind the mask.' },
  tickets: { title: 'Some moments need a big screen.', description: 'Plan your next premiere. Find your people. Be there.' },
  reminders: { title: 'Good things are worth remembering.', description: 'Movie nights, release days, and everything you do not want to miss.' },
}

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function Sidebar({ open, onClose }: SidebarProps) {
  const { view, preferences, navigate, toggleShield, setDialog } = useDoomTracker()
  const reminders = preferences.reminders.filter(reminder => !reminder.completed).length
  return <>
    {open && <button className="dt-sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`dt-sidebar${open ? ' is-open' : ''}`} id="dt-sidebar">
      <button className="dt-brand" aria-label="DOOM Tracker home" onClick={() => { navigate('overview'); onClose() }}>
        <DoomMark /><span><strong>DOOM<span>TRACKER</span></strong><small>YOUR UNIVERSE. TRACKED.</small></span>
      </button>
      <span className="dt-nav-caption">YOUR COMMAND CENTER</span>
      <nav aria-label="Main navigation">
        {navigation.map(item => <button key={item.view} className={`dt-nav-item${view === item.view ? ' is-active' : ''}`} aria-current={view === item.view ? 'page' : undefined} onClick={() => { navigate(item.view); onClose() }}>
          <Icon name={item.icon} size={19} /><span>{item.label}</span>
          {item.view === 'watchlist' && <span className="dt-nav-count">{preferences.watchlist.length}</span>}
          {item.view === 'reminders' && reminders > 0 && <span className="dt-nav-count">{reminders}</span>}
          {item.view === 'news' && <span className="dt-nav-new" />}
        </button>)}
      </nav>
      <div className="dt-sidebar-bottom">
        <div className={`dt-shield-card${preferences.spoilerShield ? '' : ' is-disabled'}`}>
          <div className="dt-shield-title"><Icon name="shield" size={21} /><strong>Spoiler shield</strong><button className="dt-switch" role="switch" aria-checked={preferences.spoilerShield} aria-label="Spoiler shield" onClick={toggleShield}><span /></button></div>
          <p>{preferences.spoilerShield ? 'All the hype. None of the spoilers.' : 'Spoiler discussions are visible.'}</p>
          <span className="dt-shield-status"><i />{preferences.spoilerShield ? 'YOU ARE IN THE SAFE ZONE' : 'EXPLORING WITHOUT A SHIELD'}</span>
        </div>
        <button className="dt-sidebar-about" onClick={() => setDialog({ type: 'about' })}><Icon name="heart" size={16} />Built by fans, for fans<Icon name="upRight" size={14} /></button>
        <button className="dt-profile" aria-label={`Edit profile for ${preferences.name}`} onClick={() => setDialog({ type: 'profile' })}>
          <span className="dt-user-avatar">{preferences.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()}</span><span><strong>{preferences.name}</strong><small>Earth-616 explorer</small></span><Icon name="settings" size={17} />
        </button>
      </div>
    </aside>
  </>
}

interface TopbarProps {
  onMenu: () => void
  menuOpen: boolean
}

function Topbar({ onMenu, menuOpen }: TopbarProps) {
  const { view, preferences, setDialog, navigate } = useDoomTracker()
  const reminders = preferences.reminders.filter(reminder => !reminder.completed).length
  return <header className="dt-topbar">
    <div className="dt-breadcrumb"><button className="dt-icon-button dt-mobile-menu" onClick={onMenu} aria-label="Open navigation" aria-controls="dt-sidebar" aria-expanded={menuOpen}><Icon name="menu" /></button><span className="dt-breadcrumb-home">Your universe</span><span className="dt-breadcrumb-slash">/</span><strong>{viewLabels[view]}</strong></div>
    <div className="dt-topbar-actions">
      <button className="dt-search-trigger" aria-label="Search the multiverse" onClick={() => setDialog({ type: 'search' })}><Icon name="search" size={17} /><span>Search the multiverse...</span><kbd>Ctrl K</kbd></button>
      <span className="dt-topbar-divider" />
      <button className="dt-icon-button dt-notification-button" aria-label={`Open reminders, ${reminders} active`} onClick={() => navigate('reminders')}><Icon name="bell" size={20} />{reminders > 0 && <span />}</button>
      <button className="dt-icon-button" aria-label="Change theme" onClick={() => setDialog({ type: 'theme' })}><Icon name="palette" size={20} /></button>
      <button className="dt-topbar-avatar" onClick={() => setDialog({ type: 'profile' })} aria-label="Edit explorer profile">{preferences.name.charAt(0).toUpperCase()}<span /></button>
    </div>
  </header>
}

export default function DoomTracker() {
  const { view, setDialog, dialog, storageError, toast, dismissToast } = useDoomTracker()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setDialog({ type: 'search' })
      }
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setDialog])

  useEffect(() => {
    document.title = `${viewLabels[view]} | DOOM Tracker`
  }, [view])

  return <div className="dt-app">
    <a className="dt-skip-link" href="#dt-main" onClick={event => { event.preventDefault(); mainRef.current?.focus() }}>Skip to content</a>
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="dt-workspace">
      <Topbar onMenu={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
      <main ref={mainRef} id="dt-main" className="dt-main" tabIndex={-1}>
        {storageError && <div className="dt-storage-warning" role="alert"><Icon name="info" size={19} /><span>{storageError}</span><button onClick={() => setDialog({ type: 'profile' })}>Open profile</button></div>}
        <div className="dt-page-heading">
          <div><span className="dt-eyebrow dt-greeting">{view === 'overview' ? 'WELCOME TO YOUR NEXT CHAPTER' : 'YOUR UNIVERSE. YOUR WAY.'}</span><h1>{pageHeadings[view].title}</h1><p>{pageHeadings[view].description}</p></div>
          <div className="dt-today"><Icon name="calendar" size={15} /><span>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())}</span><span className="dt-today-dot" />Earth-616</div>
        </div>
        {view === 'overview' && <Dashboard />}
        {view === 'news' && <NewsFeed />}
        {view === 'watchlist' && <WatchlistPage />}
        {view === 'characters' && <CharactersPage />}
        {view === 'tickets' && <TicketsPage />}
        {view === 'reminders' && <RemindersPage />}
        <footer className="dt-footer"><span><span className="dt-footer-dot" />A little less chaos. A lot more Marvel.</span><button onClick={() => setDialog({ type: 'about' })}>An independent fan project<Icon name="upRight" size={12} /></button></footer>
      </main>
    </div>
    {dialog && <TrackerDialogs />}
    {toast && <div className="dt-toast" role="status"><span className="dt-toast-check"><Icon name="check" size={17} /></span><span>{toast}</span><button className="dt-icon-button" aria-label="Dismiss notification" onClick={dismissToast}><Icon name="close" size={16} /></button></div>}
  </div>
}
