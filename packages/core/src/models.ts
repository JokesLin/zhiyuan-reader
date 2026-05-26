export interface BookMeta {
  id: string
  title: string
  author: string
  cover?: string
  description?: string
  category?: string
  tags?: string[]
  filePath?: string
  fileFormat: 'txt' | 'epub'
  totalChapters: number
  createdAt: number
  updatedAt: number
}

export interface Chapter {
  index: number
  title: string
  content: string
}

export interface ReadingProgress {
  bookId: string
  chapterIndex: number
  position: number
  percentage: number
  updatedAt: number
}

export interface BookshelfItem {
  book: BookMeta
  progress: ReadingProgress
  isFavorite: boolean
  isFinished: boolean
  addedAt: number
}

export interface ReaderPreferences {
  fontSize: number
  fontFamily: string
  lineHeight: number
  theme: 'light' | 'green' | 'paper' | 'dark'
  brightness: number
  pageMode: 'click' | 'scroll'
}

export const DEFAULT_READER_PREFERENCES: ReaderPreferences = {
  fontSize: 16,
  fontFamily: 'system-ui',
  lineHeight: 1.8,
  theme: 'light',
  brightness: 100,
  pageMode: 'click',
}

export const BOOK_CATEGORIES = [
  '玄幻',
  '言情',
  '都市',
  '历史',
  '科幻',
  '悬疑',
  '武侠',
  '奇幻',
  '游戏',
  '轻小说',
] as const

export type BookCategory = (typeof BOOK_CATEGORIES)[number]