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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
};

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
          SHIT JOURNAL PREPRINT
        </span>
      ))}
    </div>
  </div>
);

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfPath }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // react-pdf state (mobile only)
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!pdfPath) {
      setLoading(false);
      return;
    }

    const getUrl = async () => {
      const { data } = await supabase.storage
        .from('manuscripts')
        .createSignedUrl(pdfPath, 3600);

      if (data?.signedUrl) setPdfUrl(data.signedUrl);
      setLoading(false);
    };

    getUrl();
  }, [pdfPath]);

  useEffect(() => {
    if (!isMobile) return;
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile]);

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

  // Desktop: iframe
  if (!isMobile) {
    return (
      <div className="relative select-none">
        <Watermark />
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0`}
          className="w-full border border-gray-200"
          style={{ height: '80vh' }}
          title="PDF Viewer"
        />
      </div>
    );
  }

  // Mobile: react-pdf canvas
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
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i + 1} className="mb-2">
            <Page
              pageNumber={i + 1}
              width={containerWidth || undefined}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};
