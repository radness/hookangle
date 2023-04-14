import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
  text?: string;
  buttonClass?: string;
  lineClampClass: string;
};

const LineClamp: FC<Props> = ({ text, lineClampClass, buttonClass }) => {
  const { t } = useTranslation();
  const [more, setMore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hasMore = useMemo(() => {
    if (ref.current) {
      const element: HTMLDivElement = ref.current;
      return element.scrollHeight > element.clientHeight + 1;
    } else {
      return false;
    }
  }, [ref.current]);

  return (
    <>
      <div className={more ? 'line-clamp-none' : `${lineClampClass}`} ref={ref}>
        {text}
      </div>
      {!more && hasMore && (
        <div className="mt-1">
          <button
            className="text-xs font-normal text-primary-200"
            onClick={() => {
              setMore((prev) => !prev);
            }}
          >
            {t('more')}
          </button>
        </div>
      )}
    </>
  );
};

export default LineClamp;
