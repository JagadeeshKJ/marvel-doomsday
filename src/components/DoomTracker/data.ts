export type TrackerView = 'overview' | 'news' | 'watchlist' | 'characters' | 'tickets' | 'reminders'
export type NewsCategory = 'All updates' | 'Movies' | 'TV & series' | 'Comics'

export interface Movie {
  id: string
  title: string
  year: number
  kind: 'Movie' | 'Series'
  duration: string
  image: string
  color: string
  description: string
  source: string
}

export interface Article {
  id: string
  title: string
  category: Exclude<NewsCategory, 'All updates'>
  tag: string
  image: string
  imagePosition?: string
  minutes: number
  summary: string
  paragraphs: string[]
  source: string
  sourceName: string
  spoiler?: boolean
}

export interface Character {
  id: string
  name: string
  alias: string
  team: string
  symbol: 'mask' | 'four' | 'hammer' | 'shield' | 'horns' | 'web'
  color: string
  background: string
  description: string
  powers: string[]
  debut: string
  source: string
}

export const DOOMSDAY_RELEASE = '2026-12-18T05:00:00Z'
export const DOOMSDAY_SOURCE = 'https://www.marvel.com/movies/avengers-doomsday'

export const movies: Movie[] = [
  {
    id: 'endgame',
    title: 'Avengers: Endgame',
    year: 2019,
    kind: 'Movie',
    duration: '3h 1m',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',
    color: '#4a3762',
    description: 'The end of an era, and the perfect place to revisit the heroes who brought us here. An essential chapter in your road to Doomsday.',
    source: 'https://www.marvel.com/movies/avengers-endgame',
  },
  {
    id: 'loki',
    title: 'Loki',
    year: 2023,
    kind: 'Series',
    duration: 'Season 2',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Loki_season_2_poster.jpg',
    color: '#385447',
    description: 'Time gets complicated. Follow Loki and the TVA through a story that puts the multiverse front and center.',
    source: 'https://www.marvel.com/tv-shows/loki/2',
  },
  {
    id: 'fantastic-four',
    title: 'The Fantastic Four: First Steps',
    year: 2025,
    kind: 'Movie',
    duration: '1h 55m',
    image: 'https://upload.wikimedia.org/wikipedia/en/1/13/The_Fantastic_Four_First_Steps_poster.jpg',
    color: '#477f93',
    description: 'A retro-futuristic world. A cosmic challenge. Get acquainted with Reed, Sue, Johnny, and Ben before the next Avengers chapter.',
    source: 'https://www.marvel.com/movies/the-fantastic-four-first-steps',
  },
  {
    id: 'thunderbolts',
    title: 'Thunderbolts*',
    year: 2025,
    kind: 'Movie',
    duration: '2h 6m',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/90/Thunderbolts%2A_poster.jpg',
    color: '#ab7c43',
    description: 'Not every team starts with heroes. A group of unlikely allies finds itself on a mission where working together may be the only way out.',
    source: 'https://www.marvel.com/movies/thunderbolts',
  },
  {
    id: 'doomsday',
    title: 'Avengers: Doomsday',
    year: 2026,
    kind: 'Movie',
    duration: 'Coming December 18',
    image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Avengers_Doomsday_poster.jpg',
    color: '#314234',
    description: 'The next Avengers event brings Doctor Doom into the spotlight. Scheduled for December 18, 2026 in the US; release dates may vary by region.',
    source: DOOMSDAY_SOURCE,
  },
  {
    id: 'spider-man',
    title: 'Spider-Man: Brand New Day',
    year: 2026,
    kind: 'Movie',
    duration: 'A new chapter',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Spider-Man_Brand_New_Day_poster.jpg',
    color: '#9d3d40',
    description: 'Check in with your friendly neighborhood Spider-Man as Peter Parker enters a new chapter. Find current film information at the official source.',
    source: 'https://www.marvel.com/movies/spider-man-brand-new-day',
  },
]

export const articles: Article[] = [
  {
    id: 'doom-arrives',
    title: 'New mask. Same legend. A whole new threat.',
    category: 'Movies',
    tag: 'DOOMSDAY',
    image: '/doom/doom-hero.svg',
    imagePosition: '66% 32%',
    minutes: 3,
    summary: 'Robert Downey Jr. steps into the role of Victor von Doom. Here is your spoiler-free briefing.',
    paragraphs: [
      'Robert Downey Jr. is returning to the Marvel Cinematic Universe in a different role: Victor von Doom. The casting sets the stage for a new chapter of Avengers storytelling.',
      'Anthony and Joe Russo are directing Avengers: Doomsday, currently scheduled for a US theatrical release on December 18, 2026. This countdown follows that date, not a confirmed local screening time.',
      'Keep this page on your radar, revisit the earlier films, and check Marvel for official announcements. We keep rumors separate from confirmed information.',
    ],
    source: DOOMSDAY_SOURCE,
    sourceName: 'Marvel Studios',
  },
  {
    id: 'first-family',
    title: "The first family. The next big chapter.",
    category: 'Movies',
    tag: 'FANTASTIC FOUR',
    image: '/doom/first-family.svg',
    minutes: 4,
    summary: 'Four very different heroes. One extraordinary family. Get to know the team.',
    paragraphs: [
      'Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm are the Fantastic Four. Their connection as a family is just as important as their powers.',
      'The Fantastic Four: First Steps introduces a retro-futuristic world and a fresh screen incarnation of the team, with Pedro Pascal, Vanessa Kirby, Joseph Quinn, and Ebon Moss-Bachrach.',
      'Add First Steps to your watchlist for a spoiler-free starting point. Our character files cover the classic comic-book foundations without revealing the film ending.',
    ],
    source: 'https://www.marvel.com/movies/the-fantastic-four-first-steps',
    sourceName: 'Marvel Studios',
  },
  {
    id: 'loki-guide',
    title: 'A little mischief. A lot of multiverse.',
    category: 'TV & series',
    tag: 'WATCH GUIDE',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Loki_season_2_poster.jpg',
    imagePosition: '50% 35%',
    minutes: 5,
    summary: 'Why a visit to the TVA belongs on your pre-Doomsday rewatch list.',
    paragraphs: [
      'If timelines and alternate realities have you reaching for a flowchart, Loki is a good place to start. The series turns those big ideas into a character-driven journey.',
      'Start with season one before moving to season two. The show builds its ideas gradually, so watching in release order gives those discoveries room to breathe.',
      'This is a fan-curated recommendation, not an official list of required viewing for Doomsday. Watch at your own pace and mark each title off as you go.',
    ],
    source: 'https://www.marvel.com/tv-shows/loki/2',
    sourceName: 'Marvel',
  },
  {
    id: 'doom-origins',
    title: 'Behind the armor: who is Victor von Doom?',
    category: 'Comics',
    tag: 'CHARACTER FILE',
    image: '/doom/doom-hero.svg',
    imagePosition: '70% 25%',
    minutes: 4,
    summary: 'A spoiler-free introduction to Latveria, the armor, and the mind behind the mask.',
    paragraphs: [
      'Doctor Doom first appeared in Fantastic Four #5 in 1962. Victor von Doom combines scientific brilliance with a command of the mystical arts.',
      'As the ruler of the fictional nation of Latveria, Doom sees himself as far more than a conventional villain. His rivalry with Reed Richards is a defining part of his comic-book history.',
      'Comics and screen adaptations are different continuities. These origins are background reading, not a prediction of how Avengers: Doomsday will tell its story.',
    ],
    source: 'https://www.marvel.com/characters/doctor-doom-victor-von-doom',
    sourceName: 'Marvel character guide',
  },
  {
    id: 'thunderbolts-ending',
    title: 'Thunderbolts*: the team behind the asterisk.',
    category: 'Movies',
    tag: 'SPOILER DISCUSSION',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/90/Thunderbolts%2A_poster.jpg',
    imagePosition: '50% 32%',
    minutes: 4,
    summary: 'Finished the film? Let us unpack what that new team name means.',
    paragraphs: [
      'Spoilers for Thunderbolts* follow. The asterisk pays off with the team being presented as the New Avengers, reframing the title and the unlikely group at its center.',
      'That name creates an interesting tension between the way a team is presented to the world and the people actually doing the work. The film earns that discussion through its focus on trust and recovery.',
      'This is our fan commentary on a released film, not confirmation of any unreleased Doomsday plot. Check the official film page for more about Thunderbolts*.',
    ],
    source: 'https://www.marvel.com/movies/thunderbolts',
    sourceName: 'Marvel Studios',
    spoiler: true,
  },
  {
    id: 'road-to-doom',
    title: 'Your road to Doomsday starts with a rewatch.',
    category: 'Movies',
    tag: 'THE ESSENTIALS',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg',
    imagePosition: '50% 28%',
    minutes: 3,
    summary: 'A handpicked starting point for your next Marvel movie night.',
    paragraphs: [
      'There is no wrong way to return to the Marvel universe. Our starter watchlist pairs Avengers: Endgame with Loki, The Fantastic Four: First Steps, and Thunderbolts*.',
      'Each title offers a different perspective: the Avengers legacy, the logic of timelines, a new family, and a new team. This is a fan-made guide rather than required homework.',
      'Make the list your own. Add a title, mark a rewatch complete, or set a reminder for your next movie night. Everything stays in this browser.',
    ],
    source: 'https://www.marvel.com/movies',
    sourceName: 'Marvel movie library',
  },
]

export const characters: Character[] = [
  {
    id: 'doom', name: 'Doctor Doom', alias: 'Victor von Doom', team: 'Latveria', symbol: 'mask',
    color: '#477057', background: '#e9eee8',
    description: 'A brilliant scientist, formidable sorcerer, and the ruler of Latveria. Behind his iconic armor is a mind convinced it alone can bring order to the world.',
    powers: ['Genius intellect', 'Mystic arts', 'Powered armor'],
    debut: 'Fantastic Four #5 (1962)', source: 'https://www.marvel.com/characters/doctor-doom-victor-von-doom',
  },
  {
    id: 'reed', name: 'Mister Fantastic', alias: 'Reed Richards', team: 'Fantastic Four', symbol: 'four',
    color: '#477d9f', background: '#e8f0f5',
    description: 'The endlessly curious scientist at the heart of the Fantastic Four. Reed pairs an elastic body with a mind that is always reaching for the next discovery.',
    powers: ['Elasticity', 'Scientific genius', 'Inventor'],
    debut: 'Fantastic Four #1 (1961)', source: 'https://www.marvel.com/characters/mister-fantastic',
  },
  {
    id: 'thor', name: 'Thor', alias: 'Thor Odinson', team: 'Avengers', symbol: 'hammer',
    color: '#a87f43', background: '#f2ece2',
    description: 'The Asgardian God of Thunder has spent centuries learning what it means to be worthy. A cosmic adventurer with a very human heart.',
    powers: ['Thunder and lightning', 'Superhuman strength', 'Asgardian longevity'],
    debut: 'Journey into Mystery #83 (1962)', source: 'https://www.marvel.com/characters/thor-thor-odinson',
  },
  {
    id: 'sam', name: 'Captain America', alias: 'Sam Wilson', team: 'Avengers', symbol: 'shield',
    color: '#a75556', background: '#f6e9e7',
    description: 'Sam Wilson brings compassion, determination, and a unique perspective to the shield. A hero defined by what he stands for, not just what he can do.',
    powers: ['Expert flight', 'Tactical leadership', 'Shield mastery'],
    debut: 'Captain America #117 (1969)', source: 'https://www.marvel.com/characters/sam-wilson',
  },
  {
    id: 'loki', name: 'Loki', alias: 'God of Mischief', team: 'Asgard', symbol: 'horns',
    color: '#658558', background: '#edf0e4',
    description: 'A trickster, a shapeshifter, and always more complicated than he first appears. Loki has never been easy to fit into the role of hero or villain.',
    powers: ['Illusion casting', 'Shapeshifting', 'Sorcery'],
    debut: 'Journey into Mystery #85 (1962)', source: 'https://www.marvel.com/characters/loki',
  },
  {
    id: 'spider-man', name: 'Spider-Man', alias: 'Peter Parker', team: 'Friendly neighborhood', symbol: 'web',
    color: '#af5352', background: '#f5e6e4',
    description: 'An everyday person who keeps choosing to do something extraordinary. Peter balances life in New York with the responsibility that comes with his powers.',
    powers: ['Spider-sense', 'Wall-crawling', 'Web-slinging'],
    debut: 'Amazing Fantasy #15 (1962)', source: 'https://www.marvel.com/characters/spider-man-peter-parker',
  },
]

export const viewLabels: Record<TrackerView, string> = {
  overview: 'Overview', news: 'Marvel news', watchlist: 'My watchlist',
  characters: 'Characters', tickets: 'Tickets & releases', reminders: 'Reminders',
}
