import React, { FC, PropsWithChildren, useCallback } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { SortingDirection } from 'types/table';

type Props = PropsWithChildren & {
  className?: string;
  onClickSorting?: () => void;
  sortingDirection: SortingDirection | null;
  tooltip?: string;
};

const SortingTh: FC<Props> = ({ className, sortingDirection, onClickSorting, children, tooltip }) => {
  const handleClickSorting = useCallback(() => {
    if (onClickSorting) {
      onClickSorting();
    }
  }, [onClickSorting]);

  return (
    <th
      className={'relative bg-dark-800 border-dark-600 h-[46px] pr-3 font-medium ' + (className ? `${className}` : '')}
    >
      {children}
      <div
        className="absolute right-0 top-0 h-full w-4 cursor-pointer flex flex-col items-center justify-center"
        onClick={handleClickSorting}
      >
        <ChevronUpIcon className={'w-3 h-3' + (sortingDirection === SortingDirection.ASC ? ' text-primary-200' : '')} />
        <ChevronDownIcon
          className={'w-3 h-3' + (sortingDirection === SortingDirection.DES ? ' text-primary-200' : '')}
        />
      </div>
    </th>
  );
};

export default SortingTh;
