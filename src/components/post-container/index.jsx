import React, { useState, useEffect, useRef } from 'react';
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';
import { MermaidZoom } from '../mermaid-zoom';

deckDeckGoHighlightElement();

export const PostContainer = ({ html }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedSvgContent, setSelectedSvgContent] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Mermaid SVG 요소들에 클릭 이벤트 리스너 추가
      const mermaidSvgs = containerRef.current.querySelectorAll('p > svg');

      mermaidSvgs.forEach(svg => {
        // 클릭 가능함을 시각적으로 표시
        svg.style.cursor = 'zoom-in';
        svg.setAttribute('aria-label', '클릭하여 다이어그램 확대');
        svg.setAttribute('role', 'button');
        svg.setAttribute('tabindex', '0');

        const handleClick = () => {
          // SVG 크기 정보 분석
          const svgClone = svg.cloneNode(true);
          const rect = svg.getBoundingClientRect();
          const isVertical = rect.height > rect.width;

          // 세로형 다이어그램인 경우 추가 클래스 적용
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

        const handleKeyDown = event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        };

        svg.addEventListener('click', handleClick);
        svg.addEventListener('keydown', handleKeyDown);

        // Cleanup을 위해 이벤트 리스너를 저장
        svg.__mermaidZoomCleanup = () => {
          svg.removeEventListener('click', handleClick);
          svg.removeEventListener('keydown', handleKeyDown);
        };
      });

      // Cleanup 함수 반환
      return () => {
        mermaidSvgs.forEach(svg => {
          if (svg.__mermaidZoomCleanup) {
            svg.__mermaidZoomCleanup();
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
      <div
        ref={containerRef}
        className="post-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <MermaidZoom
        isOpen={isZoomOpen}
        onClose={handleCloseZoom}
        svgContent={selectedSvgContent}
      />
    </>
  );
};
