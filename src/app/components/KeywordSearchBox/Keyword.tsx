import React, { FC, PropsWithChildren } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

type Props = {
  onClickKeyword?: () => void;
  onClickKeywordDelete?: () => void;
  showCloseButton?: boolean;
};
const Keyword: FC<Props & PropsWithChildren> = ({
  onClickKeyword,
  onClickKeywordDelete,
  showCloseButton = true,
  children,
}) => {
  return (
    <div className="relative">
      {showCloseButton && (
        <button className="absolute -top-1 -right-3" onClick={onClickKeywordDelete}>
          <XMarkIcon className="w-3 h-3 text-dark-300" />
        </button>
      )}
      <a className="cursor-pointer" onClick={onClickKeyword}>
        {children}
      </a>
    </div>
  );
};

export default Keyword;
