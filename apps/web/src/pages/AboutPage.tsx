function AboutPage() {
  return (
    <div style={{ padding: '24px 16px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>
        致远阅读
      </h2>
      <p style={{ fontSize: 14, color: '#718096', marginBottom: 24 }}>
        版本 0.1.0
      </p>

      <div style={{ textAlign: 'left', lineHeight: 1.8, fontSize: 14, color: '#4A5568' }}>
        <p>致远阅读是一款开源、跨平台的小说阅读应用，致力于为阅读爱好者提供纯净、流畅、可高度定制的阅读体验。</p>
        <br />
        <p><strong>技术栈：</strong>React + TypeScript + Vite</p>
        <p><strong>许可证：</strong>MIT License</p>
        <br />
        <p>项目地址：<a href="#" style={{ color: '#2B6CB0' }}>github.com/zhiyuan-reader</a></p>
      </div>
    </div>
  )
}

export default AboutPage