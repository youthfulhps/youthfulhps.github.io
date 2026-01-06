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
      // Mermaid SVG 요소들에 클릭 이벤트 리스너 추가
      const mermaidSvgs = containerRef.current.querySelectorAll('p > svg');

      mermaidSvgs.forEach(element => {
        const svg = element as SVGElement;
        // 클릭 가능함을 시각적으로 표시
        svg.style.cursor = 'zoom-in';
        svg.setAttribute('aria-label', '클릭하여 다이어그램 확대');
        svg.setAttribute('role', 'button');
        svg.setAttribute('tabindex', '0');

        const handleClick = () => {
          // SVG 크기 정보 분석
          const svgClone = svg.cloneNode(true) as SVGElement;
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

        const handleKeyDown = (event: Event) => {
          const keyboardEvent = event as KeyboardEvent;
          if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
            keyboardEvent.preventDefault();
            handleClick();
          }
        };

        svg.addEventListener('click', handleClick);
        svg.addEventListener('keydown', handleKeyDown);

        // Cleanup을 위해 이벤트 리스너를 저장
        (svg as any).__mermaidZoomCleanup = () => {
          svg.removeEventListener('click', handleClick);
          svg.removeEventListener('keydown', handleKeyDown);
        };
      });

      // Cleanup 함수 반환
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
}

export default PostContainer;
