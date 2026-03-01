import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { supabase } from '../../lib/supabase';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  pdfPath: string | null;
}

const Watermark: React.FC = () => (
  <div
    className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    <div className="w-full h-full"
      style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 80px,
          rgba(197, 160, 47, 0.06) 80px,
          rgba(197, 160, 47, 0.06) 81px
        )`,
      }}
    />
    <div className="absolute inset-0 flex flex-wrap items-start justify-start gap-x-32 gap-y-24 p-12"
      style={{ transform: 'rotate(-25deg)', transformOrigin: 'center center' }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="text-[28px] font-serif font-bold whitespace-nowrap"
          style={{ color: 'rgba(197, 160, 47, 0.08)' }}
        >
          S.H.I.T JOURNAL PREPRINT
        </span>
      ))}
    </div>
  </div>
);

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfPath }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!pdfPath) {
      setLoading(false);
      return;
    }

    const cacheKey = `pdf_url_${pdfPath}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { url, expiry } = JSON.parse(cached);
      if (Date.now() < expiry) {
        setPdfUrl(url);
        setLoading(false);
        return;
      }
    }

    const getUrl = async () => {
      const { data } = await supabase.storage
        .from('manuscripts')
        .createSignedUrl(pdfPath, 3600);

      if (data?.signedUrl) {
        setPdfUrl(data.signedUrl);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          url: data.signedUrl,
          expiry: Date.now() + 30 * 60 * 1000, // 30 min cache
        }));
      }
      setLoading(false);
    };

    getUrl();
  }, [pdfPath]);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (numPages === 0) return;
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(p => p - 1);
      } else if (e.key === 'ArrowRight' && currentPage < numPages) {
        setCurrentPage(p => p + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl animate-pulse">💩</span>
        <p className="text-sm text-gray-400 mt-2">Loading document / 加载文档中...</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="text-center py-12 bg-gray-50 border border-gray-200">
        <span className="text-4xl block mb-4">📄</span>
        <p className="text-sm text-gray-500">PDF not available / PDF 不可用</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative select-none">
      <Watermark />
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="text-center py-12">
            <span className="text-4xl animate-pulse">💩</span>
            <p className="text-sm text-gray-400 mt-2">Loading PDF / 加载 PDF 中...</p>
          </div>
        }
        error={
          <div className="text-center py-12 bg-gray-50 border border-gray-200">
            <span className="text-4xl block mb-4">📄</span>
            <p className="text-sm text-gray-500">Failed to load PDF / PDF 加载失败</p>
          </div>
        }
      >
        {containerWidth > 0 && (
          <Page
            pageNumber={currentPage}
            width={containerWidth}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        )}
      </Document>

      {/* Pagination controls */}
      {numPages > 0 && (
        <div className="flex items-center justify-center gap-6 py-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-gray-200 hover:border-accent-gold hover:text-accent-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 上一页
          </button>
          <span className="text-sm font-serif text-charcoal">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage >= numPages}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-gray-200 hover:border-accent-gold hover:text-accent-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一页 →
          </button>
        </div>
      )}
    </div>
  );
};
