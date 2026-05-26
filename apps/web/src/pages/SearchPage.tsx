import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookshelfStore } from '../store'
import './SearchPage.css'

function SearchPage() {
  const [query, setQuery] = useState('')
  const books = useBookshelfStore((s) => s.books)
  const navigate = useNavigate()

  const filtered = query
    ? books.filter(
        (b) =>
          b.book.title.includes(query) || b.book.author.includes(query)
      )
    : []

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="搜索书名或作者..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>
            ×
          </button>
        )}
      </div>

      {query && filtered.length === 0 && (
        <div className="search-empty">
          <p>未找到匹配的书籍</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="search-results">
          {filtered.map((item) => (
            <div
              key={item.book.id}
              className="search-item"
              onClick={() => navigate(`/reader/${item.book.id}`)}
            >
              <div className="search-cover">
                {item.book.title.charAt(0)}
              </div>
              <div className="search-meta">
                <h3 className="search-title">{item.book.title}</h3>
                <span className="search-author">{item.book.author}</span>
                <span className="search-progress">
                  已读 {Math.round(item.progress.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage