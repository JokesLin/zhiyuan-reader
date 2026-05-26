import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookshelfStore } from '../store'
import { createBookParser, detectEncoding } from '@zhiyuan/core'
import './BookshelfPage.css'

function BookshelfPage() {
  const { books, addBook, removeBook } = useBookshelfStore()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const parser = createBookParser(file.name)
    if (!parser) {
      alert('暂不支持该文件格式，仅支持 TXT 和 EPUB')
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      const uint8 = new Uint8Array(buffer)
      const encoding = detectEncoding(uint8)
      const decoder = new TextDecoder(encoding)
      const content = decoder.decode(uint8)

      const meta = parser.parseMeta(file.name, content)
      const chapters = parser.parseChapters(content)
      addBook(meta, chapters)
    } catch {
      alert('文件解析失败，请检查文件格式')
    }

    e.target.value = ''
  }

  return (
    <div className="bookshelf-page">
      <div className="bookshelf-header">
        <h2 className="section-title">我的书架</h2>
        <button className="import-btn" onClick={() => fileInputRef.current?.click()}>
          + 导入
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.epub"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <p>书架空空如也</p>
          <p className="empty-hint">点击右上角"导入"添加本地书籍</p>
        </div>
      ) : (
        <div className="bookshelf-grid">
          {books.map((item) => (
            <div
              key={item.book.id}
              className="bookshelf-card"
              onClick={() => navigate(`/reader/${item.book.id}`)}
            >
              <div className="bookshelf-cover">
                {item.book.title.charAt(0)}
              </div>
              <div className="bookshelf-meta">
                <h3 className="bookshelf-title">{item.book.title}</h3>
                <span className="bookshelf-author">{item.book.author}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.progress.percentage}%` }}
                  />
                </div>
                <span className="progress-text">
                  {Math.round(item.progress.percentage)}%
                </span>
              </div>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  removeBook(item.book.id)
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookshelfPage