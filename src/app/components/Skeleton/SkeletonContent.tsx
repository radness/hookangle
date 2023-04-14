import React, { FC, PropsWithChildren } from 'react';
import SkeletonWrapper from './SkeletonWrapper';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

type Props = PropsWithChildren &
  SkeletonProps & {
    loading: boolean;
  };

const SkeletonContent: FC<Props> = (props) => {
  return (
    <div>
      {props.loading ? (
        <SkeletonWrapper>
          <Skeleton {...props} />
        </SkeletonWrapper>
      ) : (
        props.children
      )}
    </div>
  );
};

export default SkeletonContent;
