import { useEffect } from 'react';
import { throttle } from 'lodash';

const useWindowScrollEnd = (onEnd: () => void) => {
  useEffect(() => {
    const scrollEvent = throttle((e: Event) => {
      e.preventDefault();
      const htmlElement = document.querySelector('html') as HTMLElement;
      const root = document.querySelector('#root') as HTMLDivElement;
      const rate = (htmlElement.scrollTop / (root.clientHeight - htmlElement.clientHeight + 80)) * 100;

      if (rate > 90 && onEnd) {
        onEnd();
      }
    }, 100);

    window.addEventListener('scroll', scrollEvent);

    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, [onEnd]);
};

export default useWindowScrollEnd;
