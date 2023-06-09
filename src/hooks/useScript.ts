import { useEffect } from 'react';

const useScript = (url: string, onload: () => void) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.onload = onload;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [url, onload]);
};

export default useScript;
