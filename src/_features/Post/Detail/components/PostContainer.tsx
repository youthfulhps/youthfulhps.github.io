import React, { useState, useEffect, useRef } from 'react';
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';
import MermaidZoom from './MermaidZoom';
import { MarkdownRemarkNode } from '@shared/types/gatsby';

deckDeckGoHighlightElement();

type PostContainerProps = {
  html: MarkdownRemarkNode['html'];
};

function PostContainer({ html }: PostContainerProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedSvgContent, setSelectedSvgContent] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const mermaidSvgs = containerRef.current.querySelectorAll('p > svg');

      mermaidSvgs.forEach(element => {
        const svg = element as SVGElement;
        svg.style.cursor = 'zoom-in';
        svg.setAttribute('aria-label', '클릭하여 다이어그램 확대');
        svg.setAttribute('role', 'button');
        svg.setAttribute('tabindex', '0');

        const handleClick = () => {
          const svgClone = svg.cloneNode(true) as SVGElement;
          const rect = svg.getBoundingClientRect();
          const isVertical = rect.height > rect.width;

          if (isVertical) {
            svgClone.setAttribute('data-orientation', 'vertical');
          } else {
            svgClone.setAttribute('data-orientation', 'horizontal');
          }

          const tempContainer = document.createElement('div');
          tempContainer.appendChild(svgClone);

          setSelectedSvgContent(tempContainer.innerHTML);
          setIsZoomOpen(true);
        };

        const handleKeyDown = (event: Event) => {
          const keyboardEvent = event as KeyboardEvent;
          if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
            keyboardEvent.preventDefault();
            handleClick();
          }
        };

        svg.addEventListener('click', handleClick);
        svg.addEventListener('keydown', handleKeyDown);

        (svg as any).__mermaidZoomCleanup = () => {
          svg.removeEventListener('click', handleClick);
          svg.removeEventListener('keydown', handleKeyDown);
        };
      });

      return () => {
        mermaidSvgs.forEach(element => {
          const svg = element as SVGElement;
          if ((svg as any).__mermaidZoomCleanup) {
            (svg as any).__mermaidZoomCleanup();
          }
        });
      };
    }
  }, [html]);

  const handleCloseZoom = () => {
    setIsZoomOpen(false);
    setSelectedSvgContent('');
  };

  return (
    <>
      {html && (
        <div
          ref={containerRef}
          className="post-container"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      <MermaidZoom
        isOpen={isZoomOpen}
        onClose={handleCloseZoom}
        svgContent={selectedSvgContent}
      />
    </>
  );
}

export default PostContainer;
