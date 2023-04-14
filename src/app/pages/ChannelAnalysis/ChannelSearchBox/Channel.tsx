import React, { FC, PropsWithChildren } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

type Props = {
  onClickChannel?: () => void;
  onClickChannelDelete?: () => void;
  showCloseButton?: boolean;
};
const Channel: FC<Props & PropsWithChildren> = ({
  onClickChannel,
  onClickChannelDelete,
  showCloseButton = true,
  children,
}) => {
  return (
    <div className="relative">
      {showCloseButton && (
        <button className="absolute -top-1 -right-3" onClick={onClickChannelDelete}>
          <XMarkIcon className="w-3 h-3 text-dark-300" />
        </button>
      )}
      <a className="cursor-pointer" onClick={onClickChannel}>
        {children}
      </a>
    </div>
  );
};

export default Channel;
