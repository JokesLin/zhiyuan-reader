import type { BookMeta, Chapter, ReadingProgress, BookshelfItem, ReaderPreferences } from './models'

export interface BookRepository {
  getBooks(): Promise<BookshelfItem[]>
  getBook(bookId: string): Promise<BookshelfItem | null>
  addBook(book: BookMeta, chapters: Chapter[]): Promise<void>
  removeBook(bookId: string): Promise<void>
  updateProgress(bookId: string, progress: ReadingProgress): Promise<void>
  getProgress(bookId: string): Promise<ReadingProgress | null>
  getChapters(bookId: string): Promise<Chapter[]>
  getChapter(bookId: string, chapterIndex: number): Promise<Chapter | null>
  toggleFavorite(bookId: string): Promise<void>
  toggleFinished(bookId: string): Promise<void>
}

export interface PreferencesRepository {
  getPreferences(): Promise<ReaderPreferences>
  savePreferences(prefs: ReaderPreferences): Promise<void>
}

export interface DataExportImport {
  exportData(): Promise<string>
  importData(json: string): Promise<void>
}