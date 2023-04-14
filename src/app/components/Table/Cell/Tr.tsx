import React, { FC, HTMLAttributes, PropsWithChildren, ThHTMLAttributes } from 'react';

const Th: FC<{ className?: string } & PropsWithChildren> = ({ className, children }) => {
  return (
    <th className={'bg-dark-800 border-dark-600 py-1 font-medium ' + (className ? `${className}` : '')}>{children}</th>
  );
};

export default Th;
