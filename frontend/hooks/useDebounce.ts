import { useEffect, useCallback, DependencyList } from 'react';

export default function useDebounce(effect: any, dependencies: DependencyList, delay: number | undefined) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
