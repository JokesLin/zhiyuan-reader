import { usePreferenceStore } from '../store'
import { useNavigate } from 'react-router-dom'
import './SettingsPage.css'

const FONT_OPTIONS = [
  { value: 'system-ui', label: '系统默认' },
  { value: '"Noto Serif SC", serif', label: '宋体' },
  { value: '"Microsoft YaHei", sans-serif', label: '微软雅黑' },
  { value: '"KaiTi", serif', label: '楷体' },
]

const THEME_OPTIONS = [
  { value: 'light', label: '默认白', color: '#FFFFFF' },
  { value: 'green', label: '护眼绿', color: '#C7EDCC' },
  { value: 'paper', label: '羊皮纸', color: '#F5E6D3' },
  { value: 'dark', label: '夜间黑', color: '#1A1A2E' },
] as const

function SettingsPage() {
  const navigate = useNavigate()
  const prefs = usePreferenceStore()

  return (
    <div className="settings-page">
      <h2 className="section-title">阅读偏好</h2>

      <div className="setting-group">
        <label className="setting-label">字体大小</label>
        <div className="setting-row">
          <span>Aa</span>
          <input
            type="range"
            min="12"
            max="28"
            value={prefs.fontSize}
            onChange={(e) => prefs.setFontSize(Number(e.target.value))}
            className="slider"
          />
          <span style={{ fontSize: `${prefs.fontSize}px` }}>Aa</span>
        </div>
        <span className="setting-value">{prefs.fontSize}px</span>
      </div>

      <div className="setting-group">
        <label className="setting-label">字体</label>
        <div className="font-options">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.value}
              className={`font-option${prefs.fontFamily === font.value ? ' font-option--active' : ''}`}
              onClick={() => prefs.setFontFamily(font.value)}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <label className="setting-label">行间距</label>
        <div className="setting-row">
          <span>窄</span>
          <input
            type="range"
            min="1.2"
            max="2.5"
            step="0.1"
            value={prefs.lineHeight}
            onChange={(e) => prefs.setLineHeight(Number(e.target.value))}
            className="slider"
          />
          <span>宽</span>
        </div>
        <span className="setting-value">{prefs.lineHeight}</span>
      </div>

      <div className="setting-group">
        <label className="setting-label">阅读主题</label>
        <div className="theme-options">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.value}
              className={`theme-option${prefs.theme === t.value ? ' theme-option--active' : ''}`}
              style={{ backgroundColor: t.color }}
              onClick={() => prefs.setTheme(t.value)}
            >
              <span
                className="theme-dot"
                style={{
                  color: t.value === 'dark' ? '#fff' : '#1a202c',
                }}
              >
                {prefs.theme === t.value ? '✓' : ''}
              </span>
              <span
                className="theme-label"
                style={{
                  color: t.value === 'dark' ? '#fff' : '#1a202c',
                }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <label className="setting-label">翻页方式</label>
        <div className="page-mode-options">
          <button
            className={`page-mode-option${prefs.pageMode === 'click' ? ' page-mode-option--active' : ''}`}
            onClick={() => prefs.setPageMode('click')}
          >
            点击翻页
          </button>
          <button
            className={`page-mode-option${prefs.pageMode === 'scroll' ? ' page-mode-option--active' : ''}`}
            onClick={() => prefs.setPageMode('scroll')}
          >
            滚动阅读
          </button>
        </div>
      </div>

      <div className="settings-footer">
        <button className="nav-link" onClick={() => navigate('/about')}>
          关于致远阅读 →
        </button>
      </div>
    </div>
  )
}

export default SettingsPage