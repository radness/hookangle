import React, { PropsWithChildren } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

const SkeletonWrapper = ({ children }: PropsWithChildren) => {
  return (
    <SkeletonTheme baseColor="#505050" highlightColor="#8A8A8A">
      {children}
    </SkeletonTheme>
  );
};

export default SkeletonWrapper;
