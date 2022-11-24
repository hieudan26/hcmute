import React from 'react';

function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement | null> {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
      // ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      // ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [dep]);
  return ref;
}

export default useChatScroll;
