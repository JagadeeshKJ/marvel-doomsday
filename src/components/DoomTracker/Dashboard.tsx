import { useEffect, useState } from 'react'
import { useDoomTracker } from '../../contexts/DoomTrackerContext'
import { getCountdown } from '../../utils/doomTracker'
import { characters, DOOMSDAY_RELEASE, DOOMSDAY_SOURCE, movies } from './data'
import { Artwork } from './Artwork'
import { CharacterEmblem, Icon, type IconName } from './Icon'
import { NewsFeed } from './NewsFeed'

export function Countdown() {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const countdown = getCountdown(DOOMSDAY_RELEASE, now)
  if (countdown.released) return <div className="dt-release-arrived">The scheduled release day has arrived. Check local listings.</div>
  const parts = [
    ['DAYS', countdown.days], ['HOURS', countdown.hours], ['MINS', countdown.minutes], ['SECS', countdown.seconds],
  ] as const
  return <dl className="dt-countdown" aria-label="Countdown to December 18, 2026, midnight US Eastern">
    {parts.map(([label, value]) => <div key={label}><dd>{String(value).padStart(label === 'DAYS' ? 3 : 2, '0')}</dd><dt>{label}</dt></div>)}
  </dl>
}

export function DoomsdayHero() {
  const { setDialog } = useDoomTracker()
  return <section className="dt-hero" aria-labelledby="dt-hero-title">
    <img src="/doom/doom-hero.svg" className="dt-hero-art" alt="" fetchPriority="high" />
    <div className="dt-hero-shade" />
    <div className="dt-hero-content">
      <div className="dt-hero-kicker"><span />THE COUNTDOWN HAS BEGUN</div>
      <div className="dt-hero-title-lockup"><span className="dt-avengers-title">AVENGERS</span><h2 id="dt-hero-title">DOOMSDAY<span>.</span></h2></div>
      <p>Every universe has a reckoning. Be ready for ours.</p>
      <Countdown />
      <div className="dt-hero-actions">
        <button className="dt-primary-button" onClick={() => setDialog({ type: 'reminder', title: 'Avengers: Doomsday - opening day', at: '2026-12-18T09:00' })}><Icon name="bell" size={17} />Remind me</button>
        <button className="dt-hero-secondary" onClick={() => setDialog({ type: 'movie', id: 'doomsday' })}>Explore the movie<Icon name="arrow" size={17} /></button>
      </div>
    </div>
    <a href={DOOMSDAY_SOURCE} target="_blank" rel="noreferrer" className="dt-hero-date"><Icon name="calendar" size={14} />DECEMBER 18, 2026<span />ONLY IN THEATERS<Icon name="upRight" size={13} /></a>
    <span className="dt-hero-art-label">AN ORIGINAL FAN ILLUSTRATION</span>
    <div className="dt-hero-index"><b>PHASE 06</b><span />THE MULTIVERSE SAGA</div>
  </section>
}

function TrackerStats() {
  const { preferences, navigate, now } = useDoomTracker()
  const activeReminders = preferences.reminders.filter(reminder => !reminder.completed).length
  const stats: { icon: IconName; label: string; value: string; caption: string; color: string; action: () => void }[] = [
    { icon: 'bookmark', label: 'On your watchlist', value: String(preferences.watchlist.length).padStart(2, '0'), caption: 'Great stories ahead', color: 'red', action: () => navigate('watchlist') },
    { icon: 'calendar', label: 'Days until Doomsday', value: String(getCountdown(DOOMSDAY_RELEASE, now).days).padStart(3, '0'), caption: 'The next big chapter', color: 'amber', action: () => navigate('tickets') },
    { icon: 'users', label: 'Character files', value: String(characters.length).padStart(2, '0'), caption: 'Know your universe', color: 'blue', action: () => navigate('characters') },
    { icon: 'bell', label: 'Active reminders', value: String(activeReminders).padStart(2, '0'), caption: 'Never miss a moment', color: 'green', action: () => navigate('reminders') },
  ]
  return <div className="dt-stats">
    {stats.map(stat => <button className="dt-stat" key={stat.label} onClick={stat.action}>
      <span className={`dt-stat-icon dt-tone-${stat.color}`}><Icon name={stat.icon} size={21} /></span>
      <span className="dt-stat-content"><span className="dt-stat-label">{stat.label}</span><span className="dt-stat-bottom"><strong>{stat.value}</strong><span>{stat.caption}</span></span></span>
      <Icon name="upRight" size={15} className="dt-stat-arrow" />
    </button>)}
  </div>
}

export function WatchlistPreview() {
  const { preferences, navigate, toggleWatched, setDialog } = useDoomTracker()
  const titles = preferences.watchlist.map(id => movies.find(movie => movie.id === id)).filter(movie => movie !== undefined)
  const watched = titles.filter(movie => preferences.watched.includes(movie.id)).length
  return <section className="dt-watchlist-preview">
    <div className="dt-panel-heading"><h2>Your watchlist <span>{titles.length}</span></h2><Icon name="bookmark" size={18} /></div>
    <p>A little homework. A lot of Marvel.</p>
    <div className="dt-mini-movies">
      {titles.slice(0, 3).map(movie => <div className="dt-mini-movie" key={movie.id}>
        <button className="dt-mini-movie-info" onClick={() => setDialog({ type: 'movie', id: movie.id })}>
          <Artwork src={movie.image} alt="" className="dt-mini-poster" style={{ backgroundColor: movie.color }} />
          <span><strong>{movie.title}</strong><span>{movie.kind}<i />{movie.id === 'loki' ? movie.duration : movie.year}</span><small>{preferences.watched.includes(movie.id) ? 'Watched. Worth a rewatch?' : 'Ready when you are'}</small></span>
        </button>
        <button className={`dt-round-check${preferences.watched.includes(movie.id) ? ' is-checked' : ''}`} onClick={() => toggleWatched(movie.id)} aria-pressed={preferences.watched.includes(movie.id)} aria-label={`Mark ${movie.title} as ${preferences.watched.includes(movie.id) ? 'unwatched' : 'watched'}`}><Icon name="check" size={13} /></button>
      </div>)}
      {!titles.length && <div className="dt-mini-empty"><Icon name="film" size={26} /><p>Your next favorite is waiting.</p><button className="dt-text-button" onClick={() => setDialog({ type: 'catalog' })}>Find a title <Icon name="plus" size={15} /></button></div>}
    </div>
    <div className="dt-watch-progress"><span>{watched} of {titles.length} watched</span><span>{titles.length ? Math.round(watched / titles.length * 100) : 0}%</span><progress value={watched} max={titles.length || 1} aria-label="Watchlist completion" /></div>
    <button className="dt-watchlist-link" onClick={() => navigate('watchlist')}>Open my watchlist<Icon name="arrow" size={16} /></button>
  </section>
}

export function CharacterSpotlight() {
  const { navigate, setDialog } = useDoomTracker()
  return <section className="dt-character-spotlight">
    <div className="dt-section-heading"><div><span className="dt-eyebrow">THE PEOPLE BEHIND THE POWERS</span><h2>Familiar faces. New possibilities.</h2></div><button className="dt-text-button" onClick={() => navigate('characters')}>All characters<Icon name="arrow" size={16} /></button></div>
    <div className="dt-character-strip">
      {characters.slice(0, 5).map(character => <button key={character.id} className="dt-character-chip" onClick={() => setDialog({ type: 'character', id: character.id })}>
        <span className="dt-character-avatar" style={{ color: character.color, background: character.background }}><CharacterEmblem symbol={character.symbol} size={34} /></span>
        <span><strong>{character.name}</strong><small>{character.alias}</small></span><Icon name="upRight" size={14} />
      </button>)}
    </div>
  </section>
}

export function Dashboard() {
  const { navigate } = useDoomTracker()
  return <>
    <DoomsdayHero />
    <TrackerStats />
    <div className="dt-dashboard-columns">
      <NewsFeed preview />
      <div className="dt-right-rail">
        <WatchlistPreview />
        <button className="dt-ticket-teaser" onClick={() => navigate('tickets')}>
          <span className="dt-ticket-teaser-icon"><Icon name="ticket" size={26} /></span>
          <span><strong>Big screen. Bigger moments.</strong><span>Your seat in the multiverse awaits.</span></span><Icon name="upRight" size={18} />
        </button>
      </div>
    </div>
    <CharacterSpotlight />
  </>
}
