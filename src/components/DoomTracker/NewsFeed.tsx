import { useState } from 'react'
import { useDoomTracker } from '../../contexts/DoomTrackerContext'
import { articles, type Article, type NewsCategory } from './data'
import { Artwork } from './Artwork'
import { Icon } from './Icon'

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  const { preferences, toggleSavedArticle, setDialog } = useDoomTracker()
  const protectedArticle = article.spoiler && preferences.spoilerShield
  const saved = preferences.savedArticles.includes(article.id)
  const title = protectedArticle ? 'A briefing from beyond the spoiler shield.' : article.title

  return <article className={`dt-news-card${protectedArticle ? ' dt-news-card-protected' : ''}`}>
    <div className="dt-news-image">
      {protectedArticle
        ? <div className="dt-protected-art"><Icon name="shield" size={30} /><span>SPOILER SHIELD IS ON</span></div>
        : <Artwork src={article.image} alt="" style={{ objectPosition: article.imagePosition }} />}
      <span className="dt-story-tag">{protectedArticle ? 'SPOILER PROTECTED' : article.tag}</span>
      <button className={`dt-save-button${saved ? ' is-saved' : ''}`} onClick={() => toggleSavedArticle(article.id)} aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${title}`}>
        <Icon name={saved ? 'check' : 'bookmark'} size={16} />
      </button>
    </div>
    <button className="dt-story-body" onClick={() => setDialog({ type: 'article', id: article.id })}>
      <span className="dt-story-meta">{article.category}<span />{article.minutes} min read</span>
      <h3>{title}</h3>
      <span className="dt-story-end">{protectedArticle ? 'Review spoiler warning' : 'Get the full story'}<Icon name="upRight" size={16} /></span>
    </button>
  </article>
}

interface NewsFeedProps {
  preview?: boolean
}

export function NewsFeed({ preview = false }: NewsFeedProps) {
  const [category, setCategory] = useState<NewsCategory>('All updates')
  const [savedOnly, setSavedOnly] = useState(false)
  const { preferences, navigate } = useDoomTracker()
  const categories: NewsCategory[] = ['All updates', 'Movies', 'TV & series', 'Comics']
  const filtered = articles.filter(article => (category === 'All updates' || article.category === category)
    && (!savedOnly || preferences.savedArticles.includes(article.id)))
  const visible = preview ? filtered.slice(0, 3) : filtered

  return <section className="dt-news-section" aria-labelledby="dt-news-heading">
    <div className="dt-section-heading">
      <div><span className="dt-eyebrow">FRESH FROM THE MULTIVERSE</span><h2 id="dt-news-heading">{preview ? 'The latest intel' : 'Stories worth your time.'}</h2></div>
      {preview
        ? <button className="dt-text-button" onClick={() => navigate('news')}>View all news <Icon name="arrow" size={16} /></button>
        : <button className={`dt-secondary-button${savedOnly ? ' is-selected' : ''}`} onClick={() => setSavedOnly(!savedOnly)} aria-pressed={savedOnly}><Icon name="bookmark" size={16} />Saved ({preferences.savedArticles.length})</button>}
    </div>
    <div className="dt-tabs" role="group" aria-label="News categories">
      {categories.map(item => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={category === item ? 'is-active' : ''}>{item}</button>)}
    </div>
    {visible.length
      ? <div className="dt-news-grid">{visible.map(article => <NewsCard key={article.id} article={article} />)}</div>
      : <div className="dt-empty-state"><Icon name="bookmark" size={30} /><h3>No stories here just yet.</h3><p>Save a story with its bookmark button, or try another category.</p><button className="dt-secondary-button" onClick={() => { setSavedOnly(false); setCategory('All updates') }}>Explore all stories</button></div>}
    {!preview && <p className="dt-content-note"><Icon name="info" size={14} />Fan-curated briefings, not a live news feed. Each story links to its official source.</p>}
  </section>
}
