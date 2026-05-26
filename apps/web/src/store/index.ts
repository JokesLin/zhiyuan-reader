import { create } from 'zustand'
import type { BookshelfItem, BookMeta, ReadingProgress, Chapter } from '@zhiyuan/core'

interface BookshelfState {
  books: BookshelfItem[]
  chapters: Record<string, Chapter[]>
  addBook: (book: BookMeta, chapters: Chapter[]) => void
  removeBook: (bookId: string) => void
  updateProgress: (bookId: string, progress: ReadingProgress) => void
  getBook: (bookId: string) => BookshelfItem | undefined
}

export const useBookshelfStore = create<BookshelfState>((set, get) => ({
  books: [],
  chapters: {},
  addBook: (book, chapters) =>
    set((state) => ({
      books: [
        {
          book,
          progress: { bookId: book.id, chapterIndex: 0, position: 0, percentage: 0, updatedAt: Date.now() },
          isFavorite: false,
          isFinished: false,
          addedAt: Date.now(),
        },
        ...state.books,
      ],
      chapters: { ...state.chapters, [book.id]: chapters },
    })),
  removeBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((b) => b.book.id !== bookId),
      chapters: { ...state.chapters, [bookId]: undefined } as Record<string, Chapter[]>,
    })),
  updateProgress: (bookId, progress) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.book.id === bookId ? { ...b, progress } : b
      ),
    })),
  getBook: (bookId) => get().books.find((b) => b.book.id === bookId),
}))

interface PreferenceState {
  fontSize: number
  fontFamily: string
  lineHeight: number
  theme: 'light' | 'green' | 'paper' | 'dark'
  brightness: number
  pageMode: 'click' | 'scroll'
  setFontSize: (size: number) => void
  setFontFamily: (font: string) => void
  setLineHeight: (height: number) => void
  setTheme: (theme: 'light' | 'green' | 'paper' | 'dark') => void
  setBrightness: (brightness: number) => void
  setPageMode: (mode: 'click' | 'scroll') => void
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
  fontSize: 16,
  fontFamily: 'system-ui',
  lineHeight: 1.8,
  theme: 'light',
  brightness: 100,
  pageMode: 'click',
  setFontSize: (fontSize) => set({ fontSize }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
  setTheme: (theme) => set({ theme }),
  setBrightness: (brightness) => set({ brightness }),
  setPageMode: (pageMode) => set({ pageMode }),
}))