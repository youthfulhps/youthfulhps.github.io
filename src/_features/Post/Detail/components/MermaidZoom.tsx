import React, { useState, useEffect, useCallback } from 'react';

type MermaidZoomProps = {
  isOpen: boolean;
  onClose: () => void;
  svgContent: string;
};

function MermaidZoom({ isOpen, onClose, svgContent }: MermaidZoomProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`mermaid-zoom-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-8 md:p-4 ${
        isClosing ? 'closing' : ''
      }`}
      onClick={handleClose}
    >
      <div className="mermaid-zoom-container relative max-w-[95vw] md:max-w-[98vw] w-fit h-fit max-h-[98vh] bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl overflow-hidden">
        <button
          className="absolute top-4 right-4 z-[10000] w-10 h-10 border-none rounded-full bg-black/60 text-white text-xl font-bold cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/80 hover:scale-105 focus:outline-2 focus:outline-[#007acc] focus:outline-offset-2"
          onClick={handleClose}
          aria-label="다이어그램 닫기"
        >
          ✕
        </button>
        <div
          className="mermaid-zoom-content w-full h-full p-8 flex items-center justify-center min-h-[300px] md:p-4"
          onClick={e => e.stopPropagation()}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
}

export default MermaidZoom;
