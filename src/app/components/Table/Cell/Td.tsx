import React, { FC, PropsWithChildren } from 'react';
type Props = PropsWithChildren & {
  className?: string;
};
const Td: FC<Props> = ({ className, children }) => {
  return <td className={'border-dark-600 border-b text-xs' + (className ? ` ${className}` : '')}>{children}</td>;
};

export default Td;
