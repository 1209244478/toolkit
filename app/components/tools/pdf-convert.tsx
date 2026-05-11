'use client';
import { useState, useRef } from 'react';
import s from '@/app/lib/tool-styles.module.css';
import { useToolI18n } from '@/app/lib/i18n/use-tool-i18n';

export default function PdfConvert() {
  const { tc } = useToolI18n('pdf-convert');
  const [mode, setMode] = useState<'text' | 'html' | 'image'>('text');
  const [text, setText] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setImageFile(f);
      const url = URL.createObjectURL(f);
      setImagePreview(url);
    }
  };

  const print = () => {
    let content: string;
    switch (mode) {
      case 'text':
        if (!text.trim()) return;
        content = `<pre style="white-space:pre-wrap;font-family:system-ui;font-size:14px;line-height:1.8;padding:40px;max-width:100%;word-break:break-word">${escapeHtml(text)}</pre>`;
        break;
      case 'html':
        if (!htmlContent.trim()) return;
        content = `<div style="padding:40px;max-width:100%;word-break:break-word">${htmlContent}</div>`;
        break;
      case 'image':
        if (!imagePreview) return;
        content = `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;box-sizing:border-box"><img src="${imagePreview}" style="max-width:100%;max-height:100vh;object-fit:contain" /></div>`;
        break;
    }

    const css = `@page { size: ${pageSize} ${orientation}; margin: 0; } body { margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>PDF Export</title><style>${css}</style></head><body>${content}</body></html>`;

    const w = window.open('', '_blank');
    if (!w) {
      alert('弹窗被拦截，请允许当前网站弹窗后重试');
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    w.onload = () => {
      setTimeout(() => {
        w.print();
      }, 500);
    };
  };

  const exportImage = () => {
    if (!imagePreview) return;
    const a = document.createElement('a');
    a.href = imagePreview;
    a.download = 'image.' + (imageFile?.type?.split('/')[1] || 'png');
    a.click();
  };

  return (
    <div className={s.toolContainer}>
      <div className={s.btnGroup}>
        <button className={`${s.btn} ${mode === 'text' ? s.btnPrimary : s.btnOutline}`} onClick={() => setMode('text')}>
          文本 → PDF
        </button>
        <button className={`${s.btn} ${mode === 'html' ? s.btnPrimary : s.btnOutline}`} onClick={() => setMode('html')}>
          HTML → PDF
        </button>
        <button className={`${s.btn} ${mode === 'image' ? s.btnPrimary : s.btnOutline}`} onClick={() => setMode('image')}>
          图片 → PDF
        </button>
      </div>

      <div className={s.row}>
        <div className={s.col}>
          <label className={s.label}>纸张大小</label>
          <select className={s.select} value={pageSize} onChange={e => setPageSize(e.target.value)}>
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>
        <div className={s.col}>
          <label className={s.label}>方向</label>
          <select className={s.select} value={orientation} onChange={e => setOrientation(e.target.value)}>
            <option value="portrait">纵向</option>
            <option value="landscape">横向</option>
          </select>
        </div>
      </div>

      {mode === 'text' && (
        <div className={s.col}>
          <label className={s.label}>输入文本内容</label>
          <textarea
            className={s.textarea} style={{ minHeight: 300 }}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="输入要转换为 PDF 的文本内容..."
          />
        </div>
      )}

      {mode === 'html' && (
        <div className={s.col}>
          <label className={s.label}>输入 HTML 代码</label>
          <textarea
            className={s.textarea} style={{ minHeight: 300 }}
            value={htmlContent}
            onChange={e => setHtmlContent(e.target.value)}
            placeholder="<h1>标题</h1><p>输入 HTML 内容...</p>"
          />
        </div>
      )}

      {mode === 'image' && (
        <div className={s.col}>
          <label className={s.label}>选择图片文件</label>
          <input type="file" accept="image/*" onChange={handleImageFile} />
          {imagePreview && (
            <div className={s.card} style={{ marginTop: 12 }}>
              <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 'var(--radius-md)', objectFit: 'contain' }} />
            </div>
          )}
        </div>
      )}

      <button
        className={`${s.btn} ${s.btnPrimary}`}
        onClick={mode === 'image' && imagePreview ? print : print}
        disabled={
          (mode === 'text' && !text.trim()) ||
          (mode === 'html' && !htmlContent.trim()) ||
          (mode === 'image' && !imagePreview)
        }
        style={{ fontSize: '1rem', padding: '14px 32px' }}
      >
        打印并保存为 PDF
      </button>
      <p style={{ fontSize: '.8125rem', color: 'var(--text-sec)', textAlign: 'center' }}>
        使用浏览器的「打印 → 另存为
        PDF」功能，或选择「Microsoft Print to PDF」打印机
      </p>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
