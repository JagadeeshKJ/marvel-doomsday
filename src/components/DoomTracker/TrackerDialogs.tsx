import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useDoomTracker } from '../../contexts/DoomTrackerContext'
import { toLocalDateTime } from '../../utils/doomTracker'
import { articles, characters, movies, type Article, type Character, type Movie } from './data'
import { Artwork } from './Artwork'
import { CharacterEmblem, Icon, type IconName } from './Icon'
import { MovieCard } from './TrackerPages'

interface DialogShellProps {
  title: string
  children: ReactNode
  wide?: boolean
}

function DialogShell({ title, children, wide = false }: DialogShellProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const headingId = useId()
  const { closeDialog } = useDoomTracker()
  useEffect(() => {
    const element = ref.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    if (element && !element.open) {
      element.showModal()
      element.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
    }
    document.body.style.overflow = 'hidden'
    return () => {
      element?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])

  return <dialog
    ref={ref}
    className={`dt-dialog${wide ? ' dt-dialog-wide' : ''}`}
    aria-labelledby={headingId}
    onCancel={event => { event.preventDefault(); closeDialog() }}
    onKeyDown={event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeDialog()
      }
    }}
    onClick={event => { if (event.target === event.currentTarget) closeDialog() }}
  >
    <div className="dt-dialog-inner">
      <header className="dt-dialog-header"><div><span className="dt-eyebrow">A LITTLE MORE OF YOUR UNIVERSE</span><h2 id={headingId}>{title}</h2></div><button className="dt-icon-button" onClick={closeDialog} aria-label="Close dialog"><Icon name="close" size={21} /></button></header>
      {children}
    </div>
  </dialog>
}

interface ArticleDialogProps {
  article: Article
}

function ArticleDialog({ article }: ArticleDialogProps) {
  const { preferences, toggleSavedArticle } = useDoomTracker()
  const [revealed, setRevealed] = useState(false)
  const protectedArticle = article.spoiler && preferences.spoilerShield && !revealed
  const saved = preferences.savedArticles.includes(article.id)
  return <DialogShell title={protectedArticle ? 'A spoiler lives beyond this point.' : article.title} wide>
    {protectedArticle ? <div className="dt-spoiler-warning"><span className="dt-empty-orbit"><Icon name="shield" size={40} /></span><h3>Your shield has your back.</h3><p>This discussion contains plot details from a released Marvel title. Reveal only this article, or keep exploring spoiler-free. Your global shield will stay on.</p><button className="dt-primary-button" onClick={() => setRevealed(true)}><Icon name="eye" size={17} />Reveal this article</button></div> : <>
      <Artwork className="dt-article-banner" src={article.image} alt="" style={{ objectPosition: article.imagePosition }} />
      <div className="dt-article-meta"><span>{article.category} / {article.minutes} MIN READ</span><span>DOOM TRACKER EDITORIAL</span></div>
      {article.spoiler && <div className="dt-spoiler-label"><Icon name="eye" size={15} />Spoiler discussion - revealed for this visit</div>}
      <p className="dt-article-lead">{article.summary}</p>
      <div className="dt-article-copy">{article.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      <div className="dt-dialog-footer"><a className="dt-primary-button" href={article.source} target="_blank" rel="noreferrer">Explore {article.sourceName}<Icon name="upRight" size={16} /></a><button className="dt-secondary-button" onClick={() => toggleSavedArticle(article.id)} aria-pressed={saved}><Icon name={saved ? 'check' : 'bookmark'} size={16} />{saved ? 'Saved for later' : 'Save for later'}</button></div>
      <p className="dt-content-note">Independent fan commentary. Visit the linked source for current official information.</p>
    </>}
  </DialogShell>
}

interface MovieDialogProps {
  movie: Movie
}

function MovieDialog({ movie }: MovieDialogProps) {
  const { preferences, setDialog, toggleWatchlist, toggleWatched } = useDoomTracker()
  const saved = preferences.watchlist.includes(movie.id)
  const watched = preferences.watched.includes(movie.id)
  return <DialogShell title={movie.title} wide>
    <div className="dt-movie-detail">
      <Artwork src={movie.image} alt={`${movie.title} poster`} style={{ background: movie.color }} />
      <div><span className="dt-detail-kicker">{movie.kind} / {movie.year}</span><h3>A place in your next chapter.</h3><p>{movie.description}</p><span className="dt-detail-duration"><Icon name="clock" size={16} />{movie.duration}</span>
        <div className="dt-detail-actions"><button className="dt-primary-button" aria-pressed={saved} onClick={() => toggleWatchlist(movie.id)}><Icon name={saved ? 'check' : 'plus'} size={17} />{saved ? 'Remove from watchlist' : 'Add to watchlist'}</button>{saved && <button className="dt-secondary-button" aria-pressed={watched} onClick={() => toggleWatched(movie.id)}><Icon name="check" size={17} />{watched ? 'Mark unwatched' : 'Mark watched'}</button>}</div>
        <a className="dt-text-button" href={movie.source} target="_blank" rel="noreferrer">Official film & viewing information<Icon name="upRight" size={16} /></a>
      </div>
    </div>
    <div className="dt-dialog-footer"><button className="dt-text-button" onClick={() => setDialog({ type: 'catalog' })}><Icon name="film" size={16} />Browse more titles</button><button className="dt-text-button" onClick={() => setDialog({ type: 'reminder', title: `Watch ${movie.title}` })}><Icon name="bell" size={16} />Plan a movie night</button></div>
    <p className="dt-content-note">Poster shown for identification, via Wikipedia. Availability varies by region and provider.</p>
  </DialogShell>
}

interface CharacterDialogProps {
  character: Character
}

function CharacterDialog({ character }: CharacterDialogProps) {
  return <DialogShell title={character.name}>
    <div className="dt-character-detail-art" style={{ color: character.color, background: character.background }}><CharacterEmblem symbol={character.symbol} size={85} /><span>{character.team}</span></div>
    <div className="dt-character-detail-title"><span className="dt-eyebrow">THE PERSON BEHIND THE NAME</span><h3>{character.alias}</h3></div>
    <p className="dt-dialog-copy">{character.description}</p>
    <div className="dt-power-tags">{character.powers.map(power => <span key={power}>{power}</span>)}</div>
    <dl className="dt-character-facts"><div><dt>First comic appearance</dt><dd>{character.debut}</dd></div><div><dt>Continuity</dt><dd>Classic Marvel comics</dd></div></dl>
    <a className="dt-primary-button" href={character.source} target="_blank" rel="noreferrer">Read the official character file<Icon name="upRight" size={16} /></a>
  </DialogShell>
}

interface ReminderDialogProps {
  initialTitle?: string
  initialDate?: string
}

function ReminderDialog({ initialTitle = '', initialDate }: ReminderDialogProps) {
  const { addReminder, closeDialog } = useDoomTracker()
  const [title, setTitle] = useState(initialTitle)
  const [at, setAt] = useState(initialDate ?? toLocalDateTime(new Date(Date.now() + 86400000)))
  const [error, setError] = useState<string | null>(null)
  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const message = addReminder(title, at)
    if (message) { setError(message); return }
    closeDialog()
  }
  return <DialogShell title="Put something good on your radar.">
    <form className="dt-form" onSubmit={onSubmit}>
      <label htmlFor="dt-reminder-title">What are we looking forward to?</label>
      <input id="dt-reminder-title" autoFocus placeholder="A Marvel movie night, perhaps?" value={title} onChange={event => setTitle(event.target.value)} maxLength={80} required />
      <label htmlFor="dt-reminder-time">When should we remind you?</label>
      <input id="dt-reminder-time" type="datetime-local" value={at} onChange={event => setAt(event.target.value)} min={toLocalDateTime(new Date())} required aria-describedby="dt-reminder-time-note" />
      <p className="dt-field-note" id="dt-reminder-time-note">Your local time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}. You can export this reminder to your calendar after saving.</p>
      {error && <p className="dt-form-error" role="alert">{error}</p>}
      <div className="dt-form-info"><Icon name="bell" size={20} /><p>We will show your reminder while the app is open. For a nudge when you are away, download its calendar file from Reminders.</p></div>
      <div className="dt-dialog-footer"><button className="dt-secondary-button" type="button" onClick={closeDialog}>Maybe later</button><button className="dt-primary-button" type="submit"><Icon name="bell" size={16} />Create reminder</button></div>
    </form>
  </DialogShell>
}

function CatalogDialog() {
  const [query, setQuery] = useState('')
  const filtered = movies.filter(movie => movie.title.toLowerCase().includes(query.trim().toLowerCase()))
  return <DialogShell title="Find your next Marvel moment." wide>
    <label className="dt-catalog-search"><Icon name="search" size={19} /><input autoFocus aria-label="Search available titles" placeholder="Search movies and series..." value={query} onChange={event => setQuery(event.target.value)} /></label>
    <div className="dt-catalog-grid">{filtered.map(movie => <MovieCard key={movie.id} movie={movie} inCatalog />)}</div>
    {!filtered.length && <div className="dt-empty-state"><Icon name="search" size={28} /><h3>No titles found.</h3><p>Try a different title from the Marvel universe.</p></div>}
  </DialogShell>
}

function SearchDialog() {
  const { preferences, setDialog, navigate } = useDoomTracker()
  const [query, setQuery] = useState('')
  const term = query.trim().toLowerCase()
  const results: { type: 'movie' | 'article' | 'character'; id: string; title: string; detail: string; icon: IconName }[] = term ? [
    ...movies.filter(movie => movie.title.toLowerCase().includes(term)).map(movie => ({ type: 'movie' as const, id: movie.id, title: movie.title, detail: `${movie.kind} / ${movie.year}`, icon: 'film' as const })),
    ...characters.filter(character => `${character.name} ${character.alias}`.toLowerCase().includes(term)).map(character => ({ type: 'character' as const, id: character.id, title: character.name, detail: character.alias, icon: 'users' as const })),
    ...articles.filter(article => !(article.spoiler && preferences.spoilerShield) && `${article.title} ${article.summary}`.toLowerCase().includes(term)).map(article => ({ type: 'article' as const, id: article.id, title: article.title, detail: `${article.category} / Article`, icon: 'news' as const })),
  ] : []

  return <DialogShell title="Where in the multiverse?">
    <form role="search" onSubmit={event => { event.preventDefault(); if (results[0]) setDialog({ type: results[0].type, id: results[0].id }) }}>
      <label className="dt-catalog-search"><Icon name="search" size={20} /><input autoFocus aria-label="Search the multiverse" placeholder="Movies, characters, news..." value={query} onChange={event => setQuery(event.target.value)} /></label>
    </form>
    {!term ? <div className="dt-search-start"><span className="dt-eyebrow">A FEW PLACES TO START</span><div className="dt-search-suggestions">{['Doctor Doom', 'Loki', 'Fantastic Four'].map(suggestion => <button key={suggestion} onClick={() => setQuery(suggestion)}>{suggestion}<Icon name="upRight" size={14} /></button>)}</div><button className="dt-search-quicklink" onClick={() => navigate('watchlist')}><Icon name="bookmark" />Your watchlist<Icon name="arrow" size={16} /></button><button className="dt-search-quicklink" onClick={() => navigate('reminders')}><Icon name="bell" />Your upcoming reminders<Icon name="arrow" size={16} /></button></div>
      : <><p className="dt-search-count" role="status">{results.length} {results.length === 1 ? 'result' : 'results'} for "{query.trim()}"</p><div className="dt-search-results">{results.map(result => <button key={`${result.type}-${result.id}`} onClick={() => setDialog({ type: result.type, id: result.id })}><span className="dt-search-result-icon"><Icon name={result.icon} size={20} /></span><span><strong>{result.title}</strong><small>{result.detail}</small></span><Icon name="chevron" size={16} /></button>)}</div>{results.length === 0 && <div className="dt-empty-state"><Icon name="search" size={30} /><h3>Even the multiverse has its limits.</h3><p>Try a different title or character name.</p></div>}</>}
    {preferences.spoilerShield && <p className="dt-content-note"><Icon name="shield" size={14} />Spoiler-protected articles are excluded from search.</p>}
  </DialogShell>
}

function ProfileDialog() {
  const { preferences, saveName, closeDialog, reset, storageError } = useDoomTracker()
  const [name, setName] = useState(preferences.name)
  const [confirmReset, setConfirmReset] = useState(false)
  const [error, setError] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) { setError('Every explorer needs a name. Enter yours to continue.'); return }
    saveName(name)
    closeDialog()
  }
  return <DialogShell title="Every universe needs you.">
    <form className="dt-form" onSubmit={submit}>
      <span className="dt-profile-large">{name.trim().charAt(0).toUpperCase() || '?'}</span>
      <label htmlFor="dt-explorer-name">Your explorer name</label><input id="dt-explorer-name" value={name} maxLength={40} required onChange={event => setName(event.target.value)} />
      <p className="dt-field-note">This is a local profile, not an online account. Your watchlist, reminders, and preferences belong to this browser.</p>
      {error && <p className="dt-form-error" role="alert">{error}</p>}
      {storageError && <p className="dt-form-error" role="alert">{storageError}</p>}
      <div className="dt-dialog-footer"><button type="button" className="dt-secondary-button" onClick={closeDialog}>Cancel</button><button className="dt-primary-button" type="submit">Save profile<Icon name="check" size={16} /></button></div>
    </form>
    <div className="dt-reset-section">{confirmReset ? <><h3>Start a new chapter?</h3><p>This deletes your DOOM Tracker reminders and saved articles and restores the starter watchlist. No other app's data will be changed.</p><div className="dt-detail-actions"><button className="dt-danger-button" onClick={() => { if (reset()) closeDialog() }}>Reset my tracker</button><button className="dt-secondary-button" onClick={() => setConfirmReset(false)}>Keep my data</button></div></> : <button className="dt-danger-link" onClick={() => setConfirmReset(true)}><Icon name="trash" size={15} />Reset local tracker data</button>}</div>
  </DialogShell>
}

function AboutDialog() {
  return <DialogShell title="Big fans. One little corner of the universe.">
    <div className="dt-about-mark"><Icon name="heart" size={35} /></div>
    <p className="dt-article-lead">DOOM Tracker brings the things you love about Marvel a little closer together.</p>
    <div className="dt-about-features">
      <div><Icon name="news" /><span><strong>Curated, not automated.</strong><p>Original fan briefings and guides with links to official sources. This is not a live news service.</p></span></div>
      <div><Icon name="bookmark" /><span><strong>Your browser. Your universe.</strong><p>Watchlists, profiles, and reminders save locally. No account, cloud sync, or background push notifications.</p></span></div>
      <div><Icon name="ticket" /><span><strong>Real cinemas. Direct connections.</strong><p>Ticket providers handle availability, payment, and booking. We help you find the door.</p></span></div>
      <div><Icon name="shield" /><span><strong>Surprises, on your terms.</strong><p>The spoiler shield hides marked discussions and removes them from search until you choose otherwise.</p></span></div>
    </div>
    <p className="dt-content-note">Independent, unofficial fan project. Not affiliated with or endorsed by Marvel or Disney. Character names belong to their respective owners. The hero and first-family graphics are original fan illustrations; linked film posters are used for identification via Wikipedia.</p>
    <a className="dt-text-button" href="https://www.marvel.com/" target="_blank" rel="noreferrer">Visit the official Marvel universe<Icon name="upRight" size={16} /></a>
  </DialogShell>
}

export function TrackerDialogs() {
  const { dialog } = useDoomTracker()
  if (!dialog) return null
  if (dialog.type === 'article') {
    const article = articles.find(item => item.id === dialog.id)
    if (!article) throw new Error('The selected article does not exist.')
    return <ArticleDialog key={article.id} article={article} />
  }
  if (dialog.type === 'movie') {
    const movie = movies.find(item => item.id === dialog.id)
    if (!movie) throw new Error('The selected movie does not exist.')
    return <MovieDialog key={movie.id} movie={movie} />
  }
  if (dialog.type === 'character') {
    const character = characters.find(item => item.id === dialog.id)
    if (!character) throw new Error('The selected character does not exist.')
    return <CharacterDialog key={character.id} character={character} />
  }
  if (dialog.type === 'reminder') return <ReminderDialog key={`${dialog.title}-${dialog.at}`} initialTitle={dialog.title} initialDate={dialog.at} />
  if (dialog.type === 'catalog') return <CatalogDialog />
  if (dialog.type === 'search') return <SearchDialog />
  if (dialog.type === 'profile') return <ProfileDialog />
  return <AboutDialog />
}
