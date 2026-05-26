import { v4 as uuidv4 } from 'uuid'
import type { BookMeta, Chapter } from './models'

export interface BookParser {
  canParse(fileName: string): boolean
  parseMeta(fileName: string, content: string): BookMeta
  parseChapters(content: string): Chapter[]
}

export class TxtBookParser implements BookParser {
  canParse(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.txt')
  }

  parseMeta(fileName: string, content: string): BookMeta {
    const lines = content.split('\n').slice(0, 50)
    const title = this.guessTitle(lines) || fileName.replace(/\.txt$/i, '')
    const author = this.guessAuthor(lines)
    const chapters = this.parseChapters(content)

    return {
      id: uuidv4(),
      title,
      author,
      filePath: fileName,
      fileFormat: 'txt',
      totalChapters: chapters.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  parseChapters(content: string): Chapter[] {
    const chapterPattern = /^(第[一二三四五六七八九十百千万]+章|第\d+章|第\S+章|序章|前言|后记|番外|楔子)\s*(.*)$/gm
    const lines = content.split('\n')
    const chapterBreaks: number[] = []

    for (let i = 0; i < lines.length; i++) {
      chapterPattern.lastIndex = 0
      if (chapterPattern.test(lines[i].trim())) {
        chapterBreaks.push(i)
      }
    }

    if (chapterBreaks.length === 0) {
      chapterBreaks.push(0)
    }

    const chapters: Chapter[] = []
    const totalBreaks = chapterBreaks.length

    for (let i = 0; i < totalBreaks; i++) {
      const startLine = chapterBreaks[i]
      const endLine = i + 1 < totalBreaks ? chapterBreaks[i + 1] : lines.length
      const titleLine = lines[startLine].trim()
      const contentLines = lines.slice(startLine + 1, endLine)

      chapters.push({
        index: i,
        title: titleLine || `第 ${i + 1} 章`,
        content: contentLines.join('\n').trim(),
      })
    }

    return chapters
  }

  private guessTitle(lines: string[]): string {
    const titlePatterns = [/^书名[：:]\s*(.+)/, /^《(.+)》/, /^作品[：:]\s*(.+)/]
    for (const line of lines) {
      for (const pattern of titlePatterns) {
        const match = line.match(pattern)
        if (match) return match[1].trim()
      }
    }
    return ''
  }

  private guessAuthor(lines: string[]): string {
    const authorPatterns = [/^作者[：:]\s*(.+)/, /^作[者者][：:]\s*(.+)/]
    for (const line of lines) {
      for (const pattern of authorPatterns) {
        const match = line.match(pattern)
        if (match) return match[1].trim()
      }
    }
    return '未知作者'
  }
}

export class EpubBookParser implements BookParser {
  canParse(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.epub')
  }

  parseMeta(fileName: string, _content: string): BookMeta {
    return {
      id: uuidv4(),
      title: fileName.replace(/\.epub$/i, ''),
      author: '未知作者',
      filePath: fileName,
      fileFormat: 'epub',
      totalChapters: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  parseChapters(_content: string): Chapter[] {
    return []
  }
}

export function createBookParser(fileName: string): BookParser | null {
  const parsers: BookParser[] = [new TxtBookParser(), new EpubBookParser()]
  return parsers.find((p) => p.canParse(fileName)) || null
}

export function detectEncoding(buffer: Uint8Array): 'utf-8' | 'gbk' {
  const len = Math.min(buffer.length, 4096)
  if (len < 2) return 'utf-8'

  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return 'utf-8'
  }

  let invalidUtf8 = 0
  let validUtf8 = 0
  let gbkLike = 0
  let asciiCount = 0

  for (let i = 0; i < len; i++) {
    const b = buffer[i]

    if (b < 0x80) {
      asciiCount++
      continue
    }

    if (b >= 0xc2 && b <= 0xdf) {
      if (i + 1 < len && buffer[i + 1] >= 0x80 && buffer[i + 1] <= 0xbf) {
        validUtf8++
        i++
        continue
      }
      invalidUtf8++
    } else if (b >= 0xe0 && b <= 0xef) {
      if (
        i + 2 < len &&
        buffer[i + 1] >= 0x80 && buffer[i + 1] <= 0xbf &&
        buffer[i + 2] >= 0x80 && buffer[i + 2] <= 0xbf
      ) {
        const b1 = buffer[i + 1]
        const b2 = buffer[i + 2]
        if (b1 >= 0xa0 && b1 <= 0xbf && b2 >= 0x80 && b2 <= 0xbf) {
          gbkLike++
        }
        validUtf8++
        i += 2
        continue
      }
      invalidUtf8++
    } else if (b >= 0xf0 && b <= 0xf4) {
      if (
        i + 3 < len &&
        buffer[i + 1] >= 0x80 && buffer[i + 1] <= 0xbf &&
        buffer[i + 2] >= 0x80 && buffer[i + 2] <= 0xbf &&
        buffer[i + 3] >= 0x80 && buffer[i + 3] <= 0xbf
      ) {
        validUtf8++
        i += 3
        continue
      }
      invalidUtf8++
    } else if (b >= 0x81 && b <= 0xfe) {
      gbkLike++
      if (i + 1 < len) {
        const t = buffer[i + 1]
        if ((t >= 0x40 && t <= 0x7e) || (t >= 0x80 && t <= 0xfe)) {
          i++
        }
      }
    } else {
      invalidUtf8++
    }
  }

  const nonAscii = len - asciiCount
  if (nonAscii === 0) return 'utf-8'

  if (invalidUtf8 > 0) return 'gbk'

  if (gbkLike > validUtf8 * 2) return 'gbk'

  return 'utf-8'
}