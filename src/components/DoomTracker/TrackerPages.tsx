import { useState } from 'react'
import { useDoomTracker } from '../../contexts/DoomTrackerContext'
import { reminderCalendar, type TrackerReminder } from '../../utils/doomTracker'
import { characters, DOOMSDAY_SOURCE, movies, type Movie } from './data'
import { Artwork } from './Artwork'
import { CharacterEmblem, Icon } from './Icon'

interface MovieCardProps {
  movie: Movie
  inCatalog?: boolean
}

export function MovieCard({ movie, inCatalog = false }: MovieCardProps) {
  const { preferences, setDialog, toggleWatched, toggleWatchlist } = useDoomTracker()
  const watched = preferences.watched.includes(movie.id)
  const saved = preferences.watchlist.includes(movie.id)
  return <article className="dt-movie-card">
    <button className="dt-movie-art" onClick={() => setDialog({ type: 'movie', id: movie.id })} aria-label={`View ${movie.title}`} style={{ background: movie.color }}>
      <Artwork src={movie.image} alt={`${movie.title} poster`} />
      {watched && <span className="dt-watched-badge"><Icon name="check" size={12} />WATCHED</span>}
      <span className="dt-movie-art-action"><Icon name="plus" size={21} /></span>
    </button>
    <div className="dt-movie-card-info">
      <span className="dt-story-meta">{movie.year}<span />{movie.kind}</span>
      <h3>{movie.title}</h3><p>{movie.duration}</p>
      <div className="dt-movie-card-actions">
        {inCatalog
          ? <button className={`dt-small-button${saved ? ' is-selected' : ''}`} aria-pressed={saved} onClick={() => toggleWatchlist(movie.id)}><Icon name={saved ? 'check' : 'plus'} size={15} />{saved ? 'On your list' : 'Add to watchlist'}</button>
          : <><button className={`dt-small-button${watched ? ' is-selected' : ''}`} onClick={() => toggleWatched(movie.id)} aria-pressed={watched}><Icon name="check" size={15} />{watched ? 'Watched' : 'Mark watched'}</button><button className="dt-icon-button" aria-label={`Remove ${movie.title} from watchlist`} onClick={() => toggleWatchlist(movie.id)}><Icon name="trash" size={16} /></button></>}
      </div>
    </div>
  </article>
}

export function WatchlistPage() {
  const { preferences, setDialog } = useDoomTracker()
  const [filter, setFilter] = useState('All titles')
  const [query, setQuery] = useState('')
  const titles = preferences.watchlist.map(id => movies.find(movie => movie.id === id)).filter(movie => movie !== undefined)
  const watchedCount = titles.filter(movie => preferences.watched.includes(movie.id)).length
  const filtered = titles.filter(movie => movie.title.toLowerCase().includes(query.trim().toLowerCase())
    && (filter === 'All titles' || (filter === 'Watched' ? preferences.watched.includes(movie.id) : !preferences.watched.includes(movie.id))))

  return <section>
    <div className="dt-page-toolbar">
      <div className="dt-inline-summary"><span className="dt-summary-icon"><Icon name="bookmark" size={24} /></span><div><strong>{titles.length} titles. Endless possibilities.</strong><span>{watchedCount} watched{titles.length > 0 ? ` / ${titles.length - watchedCount} adventures to go` : ''}</span></div></div>
      <button className="dt-primary-button" onClick={() => setDialog({ type: 'catalog' })}><Icon name="plus" size={17} />Add a title</button>
    </div>
    <div className="dt-filter-bar">
      <div className="dt-tabs" role="group" aria-label="Watchlist status">{['All titles', 'To watch', 'Watched'].map(item => <button key={item} className={filter === item ? 'is-active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === 'All titles' && <span className="dt-tab-count">{titles.length}</span>}</button>)}</div>
      <label className="dt-inline-search"><Icon name="search" size={17} /><input aria-label="Search your watchlist" placeholder="Find in your watchlist..." value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>
    {filtered.length > 0
      ? <div className="dt-movie-grid">{filtered.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div>
      : <div className="dt-empty-state dt-empty-large"><Icon name="film" size={40} /><h2>{titles.length ? 'No titles match this view.' : 'Your next favorite is waiting.'}</h2><p>{titles.length ? 'Try a different search or switch your watchlist filter.' : 'Explore the collection and make a little room for adventure.'}</p><button className="dt-primary-button" onClick={() => titles.length ? (setFilter('All titles'), setQuery('')) : setDialog({ type: 'catalog' })}>{titles.length ? 'Show all titles' : 'Explore titles'}<Icon name="arrow" size={16} /></button></div>}
    <p className="dt-content-note"><Icon name="info" size={14} />Your starter list is fan-curated, not official required viewing. Changes are saved on this device when browser storage is available.</p>
  </section>
}

export function CharactersPage() {
  const { setDialog } = useDoomTracker()
  const [query, setQuery] = useState('')
  const [team, setTeam] = useState('All characters')
  const filtered = characters.filter(character => `${character.name} ${character.alias}`.toLowerCase().includes(query.trim().toLowerCase())
    && (team === 'All characters' || character.team === team))
  return <section>
    <div className="dt-filter-bar">
      <div className="dt-tabs" role="group" aria-label="Character team">{['All characters', 'Avengers', 'Fantastic Four', 'Latveria'].map(item => <button key={item} aria-pressed={team === item} className={team === item ? 'is-active' : ''} onClick={() => setTeam(item)}>{item}</button>)}</div>
      <label className="dt-inline-search"><Icon name="search" size={17} /><input aria-label="Search characters" placeholder="Find a familiar face..." value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>
    <div className="dt-characters-grid">{filtered.map(character => <button className="dt-character-card" key={character.id} onClick={() => setDialog({ type: 'character', id: character.id })}>
      <span className="dt-character-card-art" style={{ color: character.color, background: character.background }}><span className="dt-character-card-team">{character.team}</span><span className="dt-emblem-ring"><CharacterEmblem symbol={character.symbol} size={76} /></span><span className="dt-character-art-index">CLASSIFIED / 616</span></span>
      <span className="dt-character-card-body"><span><strong>{character.name}</strong><small>{character.alias}</small></span><span className="dt-character-open"><Icon name="upRight" size={18} /></span></span>
    </button>)}</div>
    {!filtered.length && <div className="dt-empty-state"><Icon name="users" size={32} /><h3>No characters found in this corner of the multiverse.</h3><p>Try another name or team.</p><button className="dt-secondary-button" onClick={() => { setQuery(''); setTeam('All characters') }}>Show all characters</button></div>}
    <p className="dt-content-note"><Icon name="info" size={14} />Spoiler-free comic-book profiles. Inclusion here does not confirm a character's role in an upcoming film.</p>
  </section>
}

const ticketProviders = {
  'United States': [
    { name: 'Fandango', initial: 'F', description: 'Find local theaters and showtimes.', url: 'https://www.fandango.com/', color: '#e77736' },
    { name: 'AMC Theatres', initial: 'amc', description: 'Explore screenings at your nearest AMC.', url: 'https://www.amctheatres.com/', color: '#df2f40' },
  ],
  'United Kingdom': [
    { name: 'ODEON', initial: 'O', description: 'Find your next big-screen experience.', url: 'https://www.odeon.co.uk/', color: '#2459a0' },
    { name: 'Vue', initial: 'vue', description: 'Explore local listings and premium screens.', url: 'https://www.myvue.com/', color: '#bf511d' },
  ],
  India: [
    { name: 'BookMyShow', initial: 'B', description: 'Discover movie listings in your city.', url: 'https://in.bookmyshow.com/', color: '#de4056' },
    { name: 'PVR INOX', initial: 'PVR', description: 'Find screenings at PVR INOX cinemas.', url: 'https://www.pvrcinemas.com/', color: '#8e712e' },
  ],
}

type TicketRegion = keyof typeof ticketProviders

export function TicketsPage() {
  const [region, setRegion] = useState<TicketRegion>('United States')
  const { setDialog } = useDoomTracker()
  return <section>
    <div className="dt-release-feature">
      <img src="/doom/doom-hero.svg" alt="" />
      <div><span className="dt-release-pill">THE NEXT AVENGERS EVENT</span><h2>Be there for Doomsday.</h2><p>December 18, 2026 <span>/</span> Scheduled US release</p><button className="dt-primary-button" onClick={() => setDialog({ type: 'reminder', title: 'Check Avengers: Doomsday ticket availability' })}><Icon name="bell" size={17} />Remind me to check tickets</button><a href={DOOMSDAY_SOURCE} target="_blank" rel="noreferrer">Official movie information<Icon name="upRight" size={14} /></a></div>
    </div>
    <div className="dt-section-heading dt-ticket-heading"><div><span className="dt-eyebrow">YOUR BIG-SCREEN CONNECTION</span><h2>Find your next screening.</h2></div><label className="dt-region-select"><Icon name="pin" size={16} /><select aria-label="Ticket region" value={region} onChange={event => {
      const value = event.target.value
      if (value === 'United States' || value === 'United Kingdom' || value === 'India') setRegion(value)
    }}>{Object.keys(ticketProviders).map(item => <option key={item}>{item}</option>)}</select></label></div>
    <div className="dt-ticket-notice"><Icon name="info" size={20} /><p><strong>A direct line to your cinema.</strong> Live availability, prices, and seat selection are handled by the ticket provider. DOOM Tracker does not sell tickets or confirm that sales have opened.</p></div>
    <div className="dt-providers">{ticketProviders[region].map(provider => <a className="dt-provider" href={provider.url} target="_blank" rel="noreferrer" key={provider.name}><span className="dt-provider-logo" style={{ color: provider.color }}>{provider.initial}</span><span><h3>{provider.name}</h3><p>{provider.description}</p><strong>Check listings<Icon name="upRight" size={16} /></strong></span></a>)}</div>
    <div className="dt-upcoming-release"><span className="dt-release-calendar"><strong>DEC</strong><b>17</b><small>2027</small></span><span><span className="dt-eyebrow">FURTHER ON THE HORIZON</span><h3>Avengers: Secret Wars</h3><p>Another chapter is coming. Scheduled dates may change.</p></span><button className="dt-secondary-button" onClick={() => setDialog({ type: 'reminder', title: 'Avengers: Secret Wars - release day', at: '2027-12-17T09:00' })}><Icon name="bell" size={17} />Set a reminder</button></div>
  </section>
}

export function RemindersPage() {
  const { preferences, setDialog, toggleReminder, removeReminder, notify, now } = useDoomTracker()
  const [filter, setFilter] = useState('Upcoming')
  const reminders = preferences.reminders.filter(reminder => filter === 'All reminders' || (filter === 'Completed' ? reminder.completed : !reminder.completed))
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))

  function exportReminder(reminder: TrackerReminder) {
    const url = URL.createObjectURL(new Blob([reminderCalendar(reminder)], { type: 'text/calendar;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `doom-reminder-${reminder.id}.ics`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    notify('Calendar file prepared. Import it into your calendar for reminders outside this app.')
  }

  return <section>
    <div className="dt-page-toolbar"><div className="dt-inline-summary"><span className="dt-summary-icon"><Icon name="bell" size={23} /></span><div><strong>A little nudge for the good stuff.</strong><span>{preferences.reminders.filter(reminder => !reminder.completed).length} active reminders</span></div></div><button className="dt-primary-button" onClick={() => setDialog({ type: 'reminder' })}><Icon name="plus" size={17} />Create reminder</button></div>
    <div className="dt-ticket-notice"><Icon name="calendar" size={20} /><p>Reminders appear here while DOOM Tracker is open. Export a reminder to your calendar to get notified when you are away. Times are shown in your device's local time zone.</p></div>
    <div className="dt-tabs" role="group" aria-label="Reminder status">{['Upcoming', 'Completed', 'All reminders'].map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={filter === item ? 'is-active' : ''}>{item}</button>)}</div>
    {reminders.length ? <div className="dt-reminder-list">{reminders.map(reminder => <article className={`dt-reminder-row${reminder.completed ? ' is-complete' : ''}`} key={reminder.id}>
      <span className="dt-release-calendar"><strong>{new Date(reminder.at).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</strong><b>{new Date(reminder.at).getDate()}</b></span>
      <div className="dt-reminder-info"><h3>{reminder.title}</h3><p><Icon name="clock" size={14} />{new Date(reminder.at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p><span className={`dt-reminder-status${!reminder.completed && Date.parse(reminder.at) <= now ? ' is-due' : ''}`}>{reminder.completed ? 'Completed' : Date.parse(reminder.at) <= now ? 'Due now' : 'On your radar'}</span></div>
      <div className="dt-reminder-actions"><button className={`dt-small-button${reminder.completed ? ' is-selected' : ''}`} aria-label={`Mark ${reminder.title} as ${reminder.completed ? 'incomplete' : 'complete'}`} onClick={() => toggleReminder(reminder.id)}><Icon name="check" size={15} />{reminder.completed ? 'Completed' : 'Mark done'}</button><button className="dt-icon-button" aria-label={`Export ${reminder.title} to calendar`} onClick={() => exportReminder(reminder)}><Icon name="download" size={18} /></button><button className="dt-icon-button" aria-label={`Delete ${reminder.title}`} onClick={() => removeReminder(reminder.id)}><Icon name="trash" size={17} /></button></div>
    </article>)}</div>
      : <div className="dt-empty-state dt-empty-large"><span className="dt-empty-orbit"><Icon name="bell" size={39} /></span><h2>{filter === 'Completed' ? 'Your adventures are still ahead.' : 'Something to look forward to.'}</h2><p>{filter === 'Completed' ? 'Completed reminders will appear here.' : 'Plan a movie night, count down to a premiere, or remind yourself to check tickets.'}</p><button className="dt-primary-button" onClick={() => setDialog({ type: 'reminder' })}><Icon name="plus" size={16} />Set your first reminder</button></div>}
  </section>
}
