import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBookshelfStore, usePreferenceStore } from '../store'
import './ReaderPage.css'

function ReaderPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const chapters = useBookshelfStore((s) => s.chapters[bookId ?? ''])
  const books = useBookshelfStore((s) => s.books)
  const updateProgress = useBookshelfStore((s) => s.updateProgress)
  const prefs = usePreferenceStore()

  const [chapterIndex, setChapterIndex] = useState(() => {
    const saved = books.find((b) => b.book.id === bookId)
    return saved?.progress.chapterIndex ?? 0
  })
  const [showMenu, setShowMenu] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!bookId || !chapters || chapters.length === 0) return
    updateProgress(bookId, {
      bookId,
      chapterIndex,
      position: contentRef.current?.scrollTop ?? 0,
      percentage: Math.round(((chapterIndex + 1) / chapters.length) * 100),
      updatedAt: Date.now(),
    })
  }, [chapterIndex])

  function goToPrevChapter() {
    if (!chapters) return
    setChapterIndex((prev) => Math.max(0, prev - 1))
    setShowMenu(false)
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  function goToNextChapter() {
    if (!chapters) return
    setChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))
    setShowMenu(false)
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (!chapters || chapters.length === 0) {
    return (
      <div className="reader-empty">
        <p>暂无章节内容</p>
        <button onClick={() => navigate('/bookshelf')} className="back-link">
          返回书架
        </button>
      </div>
    )
  }

  const currentChapter = chapters[chapterIndex]
  const hasPrev = chapterIndex > 0
  const hasNext = chapterIndex < chapters.length - 1

  return (
    <div className={`reader theme-${prefs.theme}`}>
      {showMenu && (
        <div className="reader-header">
          <button className="reader-back" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <span className="reader-title">{currentChapter.title}</span>
          <span className="reader-progress">
            {chapterIndex + 1} / {chapters.length} 章
          </span>
          <button className="reader-toc-btn" onClick={() => { setShowToc(true); setShowMenu(false) }}>
            ☰
          </button>
        </div>
      )}

      <div ref={contentRef} className="reader-content">
        <h2 className="chapter-title">{currentChapter.title}</h2>
        <div className="chapter-text">{currentChapter.content || '（本章节暂无内容）'}</div>
      </div>

      <div className="reader-footer">
        <button
          className={`nav-btn${hasPrev ? '' : ' nav-btn--disabled'}`}
          onClick={goToPrevChapter}
          disabled={!hasPrev}
        >
          ◀ 上一章
        </button>
        <button
          className={`nav-btn center-btn${showMenu ? ' center-btn--active' : ''}`}
          onClick={() => { setShowMenu((v) => !v); setShowToc(false) }}
        >
          {showMenu ? '隐藏菜单' : '菜单'}
        </button>
        <button
          className={`nav-btn${hasNext ? '' : ' nav-btn--disabled'}`}
          onClick={goToNextChapter}
          disabled={!hasNext}
        >
          下一章 ▶
        </button>
      </div>

      {showToc && (
        <div className="toc-overlay" onClick={() => setShowToc(false)}>
          <div className="toc-panel" onClick={(e) => e.stopPropagation()}>
            <div className="toc-header">
              <h3>章节目录</h3>
              <button className="toc-close" onClick={() => setShowToc(false)}>×</button>
            </div>
            <div className="toc-list">
              {chapters.map((ch, i) => (
                <button
                  key={ch.index}
                  className={`toc-item${i === chapterIndex ? ' toc-item--active' : ''}`}
                  onClick={() => {
                    setChapterIndex(i)
                    setShowToc(false)
                    setShowMenu(false)
                  }}
                >
                  <span className="toc-index">{i + 1}.</span>
                  <span className="toc-title">{ch.title}</span>
                  {i === chapterIndex && <span className="toc-current">当前</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReaderPage