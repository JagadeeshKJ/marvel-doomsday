export interface Theme {
  name: string
  primary: string
  secondary: string
  background: string
  accent: string
  surface: string
  headingText: string
  bodyText: string
  muted: string
}

export const themes: Theme[] = [
  { name: '🕷️ Spider-Man', primary: '#C62828', secondary: '#1565C0', background: '#080B12', accent: '#E53935', surface: '#111722', headingText: '#FFFFFF', bodyText: '#C7CDD6', muted: '#293241' },
  { name: '🦾 Iron Man', primary: '#A61919', secondary: '#D4A72C', background: '#07090D', accent: '#5EDFFF', surface: '#111318', headingText: '#F5C542', bodyText: '#D1D5DB', muted: '#38312A' },
  { name: '🛡️ Captain America', primary: '#1A2B4C', secondary: '#A52A2A', background: '#0B111C', accent: '#E8E5D8', surface: '#141E2E', headingText: '#F2F0E8', bodyText: '#BAC3CE', muted: '#34445B' },
  { name: '⚡ Thor', primary: '#243B5A', secondary: '#A9B0B8', background: '#080D15', accent: '#65C7FF', surface: '#111A26', headingText: '#F1F5F9', bodyText: '#B5C0CC', muted: '#34475A' },
  { name: '🟢 Hulk', primary: '#4CAF50', secondary: '#542A6A', background: '#0A110D', accent: '#76C442', surface: '#111A14', headingText: '#F1F5F2', bodyText: '#AAB8AE', muted: '#294331' },
  { name: '🐆 Black Panther', primary: '#101112', secondary: '#52565A', background: '#050505', accent: '#8B5CF6', surface: '#121315', headingText: '#F4F4F5', bodyText: '#A1A1AA', muted: '#343438' },
  { name: '🕷️ Black Widow', primary: '#171717', secondary: '#B3261E', background: '#080808', accent: '#E53935', surface: '#141414', headingText: '#F5F5F5', bodyText: '#B3B3B3', muted: '#333333' },
  { name: '🏹 Hawkeye', primary: '#5B3A8E', secondary: '#121212', background: '#09080D', accent: '#9B72CF', surface: '#17131D', headingText: '#F4F4F4', bodyText: '#B9B3C1', muted: '#392D46' },
  { name: '🧙 Doctor Strange', primary: '#8E1B1B', secondary: '#263A5A', background: '#0C0C10', accent: '#FF9F43', surface: '#17171D', headingText: '#F5F0E6', bodyText: '#C5BFB4', muted: '#45382E' },
  { name: '🔴 Deadpool', primary: '#8F1717', secondary: '#0A0A0A', background: '#050505', accent: '#C52222', surface: '#141414', headingText: '#F5F5F5', bodyText: '#B8B8B8', muted: '#353535' },
  { name: '🐺 Wolverine', primary: '#E6B91E', secondary: '#183A68', background: '#0A1019', accent: '#F2D03B', surface: '#121C29', headingText: '#FFF4B0', bodyText: '#C5CBD2', muted: '#37475A' },
  { name: '✨ Captain Marvel', primary: '#153B70', secondary: '#A51C30', background: '#081426', accent: '#D9A928', surface: '#101F34', headingText: '#F2C94C', bodyText: '#CBD3DE', muted: '#344963' },
  { name: '🟢 Doctor Doom', primary: '#31513B', secondary: '#9AA0A2', background: '#080C09', accent: '#5E8C61', surface: '#121914', headingText: '#D6D8D5', bodyText: '#A9B0AA', muted: '#3D4A40' },
]
