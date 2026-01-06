import { useState, useEffect, useRef } from 'react';
import * as Storage from '@shared/utils/storage';

export function useRenderedCount() {
  const initialCount = Storage.getCount(1);
  const [count, setCount] = useState<number>(initialCount);
  const countRef = useRef<number>(count);
  const increaseCount = () => setCount(prev => prev + 1);

  useEffect(() => {
    countRef.current = count;
    Storage.setCount(count);
  }, [count]);

  return [count, countRef, increaseCount] as const;
}

