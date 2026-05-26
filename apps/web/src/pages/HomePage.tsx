import { useNavigate } from 'react-router-dom'
import { useBookshelfStore } from '../store'
import './HomePage.css'

const MOCK_CATEGORIES = ['推荐', '玄幻', '言情', '都市', '历史', '科幻', '悬疑', '武侠']

function HomePage() {
  const navigate = useNavigate()
  const books = useBookshelfStore((s) => s.books)

  return (
    <div className="home-page">
      <div className="category-tabs">
        {MOCK_CATEGORIES.map((cat) => (
          <button key={cat} className="category-tab category-tab--active">
            {cat}
          </button>
        ))}
      </div>

      <section className="book-section">
        <h2 className="section-title">最近阅读</h2>
        {books.length === 0 ? (
          <div className="empty-state">
            <p>书架还没有书籍</p>
            <p className="empty-hint">前往书架页导入本地 TXT/EPUB 文件开始阅读</p>
          </div>
        ) : (
          <div className="book-grid">
            {books.map((item) => (
              <div
                key={item.book.id}
                className="book-card"
                onClick={() => navigate(`/reader/${item.book.id}`)}
              >
                <div className="book-cover">
                  {item.book.title.charAt(0)}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{item.book.title}</h3>
                  <span className="book-author">{item.book.author}</span>
                  <span className="book-progress">
                    {Math.round(item.progress.percentage)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage