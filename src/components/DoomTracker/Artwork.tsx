import { useEffect, useState, type CSSProperties } from 'react'
import { Icon } from './Icon'

interface ArtworkProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  eager?: boolean
}

export function Artwork({ src, alt, className, style, eager = false }: ArtworkProps) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (failed) {
    return <div className={`dt-artwork-fallback ${className ?? ''}`} role="img" aria-label={alt || 'Artwork unavailable'} style={style}>
      <Icon name="film" size={30} /><span>ARTWORK UNAVAILABLE</span>
    </div>
  }
  return <img src={src} alt={alt} className={className} style={style} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
}
