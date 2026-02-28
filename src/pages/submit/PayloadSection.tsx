import React, { useRef, useState } from 'react';

interface Props {
  pdfFile: File | null;
  onPdfFileSelect: (file: File) => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface DropZoneProps {
  accept: string;
  file: File | null;
  onSelect: (file: File) => void;
  label: string;
  hint: string;
  icon: string;
}

const DropZone: React.FC<DropZoneProps> = ({ accept, file, onSelect, label, hint, icon }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const exts = accept.split(',').map(s => s.trim().toLowerCase());

  const validate = (f: File): boolean => {
    const name = f.name.toLowerCase();
    if (exts.some(ext => name.endsWith(ext))) {
      setError('');
      return true;
    }
    setError(`Only ${accept} files allowed / 仅支持 ${accept} 格式`);
    return false;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && validate(dropped)) onSelect(dropped);
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center group cursor-pointer transition-all ${
          isDragOver
            ? 'border-accent-gold bg-white'
            : file
              ? 'border-accent-gold/30 bg-amber-50/30'
              : 'border-gray-300 bg-gray-50 hover:border-accent-gold hover:bg-white'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => {
            const selected = e.target.files?.[0];
            if (selected && validate(selected)) onSelect(selected);
          }}
        />
      {file ? (
        <>
          <span className="material-symbols-outlined text-3xl text-accent-gold mb-3 block">{icon}</span>
          <p className="text-sm font-medium text-charcoal mb-1">{file.name}</p>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{formatSize(file.size)}</p>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-3xl text-gray-400 mb-3 group-hover:text-accent-gold block">{icon}</span>
          <p className="text-sm font-medium text-charcoal mb-1">{label}</p>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{hint}</p>
        </>
      )}
      </div>
      {error && <p className="text-red-500 text-xs font-bold mt-2">{error}</p>}
    </div>
  );
};

export const PayloadSection: React.FC<Props> = ({ pdfFile, onPdfFileSelect }) => (
  <section className="bg-white p-8 border border-gray-200 shadow-sm">
    <div className="flex items-baseline gap-3 mb-8 border-b border-gray-100 pb-4">
      <span className="text-2xl font-serif font-bold text-accent-gold">03</span>
      <h4 className="text-lg font-bold uppercase tracking-widest">Payload / 载荷上传</h4>
    </div>

    {/* Template download */}
    <div className="mb-8 p-4 bg-gray-50 border border-gray-200">
      <div className="mb-3">
        <p className="text-sm font-bold text-charcoal">Please use our official template / 请使用官方模板</p>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">
          Format your manuscript using the template below before submitting / 请先用模板排版再投稿
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/SHIT-LaTeX-Template.zip"
          download
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-accent-gold text-accent-gold text-[10px] font-bold uppercase tracking-widest hover:bg-accent-gold hover:text-white transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          LaTeX Template / LaTeX 模板
        </a>
        <a
          href="/SHIT_Word-Template.docx"
          download
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:border-accent-gold hover:text-accent-gold transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Word Template / Word 模板
        </a>
      </div>
      <p className="text-[10px] text-science-red font-bold mt-2">
        LaTeX users: please compile with XeLaTeX / LaTeX 用户请使用 XeLaTeX 编译
      </p>
    </div>

    {/* PDF upload */}
    <DropZone
      accept=".pdf"
      file={pdfFile}
      onSelect={onPdfFileSelect}
      label="PDF Document / PDF文档"
      hint=".pdf"
      icon="picture_as_pdf"
    />
  </section>
);
