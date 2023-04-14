import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SkeletonWrapper from '../Skeleton/SkeletonWrapper';
import { useTranslation } from 'react-i18next';
import { onImageError } from '../../../utils/commonUtils';

type CommentType = {
  nickname: string;
  profile: string;
  text: string;
};

type PropsType = {
  comment?: CommentType;
  showAllText?: boolean;
  isLoading?: boolean;
  onClickMore?: () => void;
};

const Comment: FC<PropsType> = ({ comment, isLoading = false, showAllText, onClickMore }) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <SkeletonWrapper>
        <div className="flex flex-row">
          <Skeleton circle width={50} height={50} />
          <div className="ml-2 flex-1">
            <Skeleton width="100%" count={3} />
          </div>
        </div>
      </SkeletonWrapper>
    );
  }

  if (!comment) {
    return <div>-</div>;
  }

  return (
    <>
      <div className="flex flex-row">
        <div className="overflow-hidden rounded-full w-10 h-10">
          <LazyLoadImage src={comment.profile} onError={onImageError} />
        </div>
        <div className="ml-4 flex-1">
          <div className="font-semibold text-xs font-normal">{comment.nickname}</div>
          <div>
            <p
              className={`${showAllText ? '' : 'line-clamp-2'} text-xs font-normal`}
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
          </div>
        </div>
      </div>
      <div className="ml-14 mt-1 text-primary-200 text-xs hover:cursor-pointer" onClick={onClickMore}>
        {t('more')}
      </div>
    </>
  );
};

export default Comment;
