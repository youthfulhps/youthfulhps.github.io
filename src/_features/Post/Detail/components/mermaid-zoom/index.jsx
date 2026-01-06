import React, { useState, useEffect } from 'react';
import './index.scss';

export const MermaidZoom = ({ isOpen, onClose, svgContent }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = event => {
      if (event.keyCode === 27) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`mermaid-zoom-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div className="mermaid-zoom-container">
        <button
          className="mermaid-zoom-close"
          onClick={handleClose}
          aria-label="다이어그램 닫기"
        >
          ✕
        </button>
        <div
          className="mermaid-zoom-content"
          onClick={e => e.stopPropagation()}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  );
};
