import React, { useRef, useState } from 'react';

interface Props {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export const PayloadSection: React.FC<Props> = ({ file, onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileSelect(dropped);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="bg-white p-8 border border-gray-200 shadow-sm">
      <div className="flex items-baseline gap-3 mb-8 border-b border-gray-100 pb-4">
        <span className="text-2xl font-serif font-bold text-accent-gold">03</span>
        <h4 className="text-lg font-bold uppercase tracking-widest">Payload / 载荷上传</h4>
      </div>
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center group cursor-pointer transition-all ${
          isDragOver
            ? 'border-accent-gold bg-white'
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
          accept=".doc,.docx"
          className="hidden"
          onChange={handleFileInput}
        />
        {file ? (
          <>
            <span className="material-symbols-outlined text-4xl text-accent-gold mb-4 block">description</span>
            <p className="text-sm font-medium text-charcoal mb-1">{file.name}</p>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{formatSize(file.size)}</p>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-4 group-hover:text-accent-gold block">upload_file</span>
            <p className="text-sm font-medium text-charcoal mb-1">Drag and drop your manuscript here / 请在此处拖拽上传稿件</p>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Accepted formats: .doc, .docx only / 仅支持 .doc / .docx 格式</p>
          </>
        )}
      </div>
    </section>
  );
};
