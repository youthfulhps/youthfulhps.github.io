import { useEffect, useCallback } from 'react';
import * as Dom from '@shared/utils/dom';
import * as EventManager from '@shared/utils/event-manager';

const BASE_LINE = 80;

function getDistance(currentPos: number): number {
  return Dom.getDocumentHeight() - currentPos;
}

export function useInfiniteScroll(
  callback: () => void,
  condition: () => boolean
) {
  const onScroll = useCallback(() => {
    const currentPos = window.scrollY + window.innerHeight;
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE;

    return EventManager.toFit(callback, {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && condition(),
    })();
  }, [callback, condition]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, {
      passive: false,
    } as AddEventListenerOptions);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);
}
