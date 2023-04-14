import React, { FC, useState } from 'react';

import { IComment } from 'types/comment';

import InfoModal from 'app/components/Modal/InfoModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTranslation } from 'react-i18next';
import { onImageError } from '../../../../utils/commonUtils';
import { ChevronDownIcon, ChevronUpIcon, HandThumbUpIcon } from '@heroicons/react/20/solid';
import BasicModal from '../../Modal/BasicModal';

type PropsType = {
  isOpen: boolean;
  comments: IComment[];
  closeModal(): void;
};

const CommentsModal = ({ isOpen, closeModal, comments }: PropsType) => {
  const { t } = useTranslation();
  return (
    <BasicModal show={isOpen} onCloseModal={closeModal}>
      <div className="max-w-[500px] bg-dark-850 p-5 text-left rounded-md border border-dark-600">
        <div className="mb-4 font-medium text-sm">{t('comments')}</div>
        <div className="max-h-[55vh] overflow-y-scroll -mx-5 v-scrollbar">
          {comments.map((comment, i) => (
            <Comment key={i} comment={comment} />
          ))}
        </div>
      </div>
    </BasicModal>
  );
};

export default CommentsModal;

const Comment: FC<{ comment: IComment }> = ({ comment }) => {
  const [showReply, setShowReply] = useState(false);
  return (
    <div className="mb-5 mx-5">
      <div className="flex flex-row">
        <div className="overflow-hidden rounded-full w-10 h-10">
          <LazyLoadImage src={comment.profile} onError={onImageError} />
        </div>
        <div className="ml-4 flex-1">
          <div className="text-sm font-medium">{comment.nickname}</div>
          <div className="mt-1">
            <p className="text-xs font-normal" dangerouslySetInnerHTML={{ __html: comment.text }} />
          </div>
        </div>
      </div>
      <div className="pl-14 mt-2">
        <div className="flex items-center text-xs">
          <HandThumbUpIcon className="w-3 h-3" />
          <div className="ml-1">{`${comment.likeCount}`}</div>
          {comment.replies?.length > 0 ? (
            <div className="ml-2 flex items-center text-primary-200 cursor-pointer">
              {showReply ? (
                <ChevronUpIcon className="w-3 h-3 inline-block" />
              ) : (
                <ChevronDownIcon className="w-3 h-3 inline-block" />
              )}
              <button
                onClick={() => {
                  setShowReply((prev) => !prev);
                }}
              >
                답글
              </button>
            </div>
          ) : null}
        </div>
        {comment.replies?.length > 0 && showReply && (
          <div className="mt-4">
            {comment.replies.map((comment) => (
              <div className="mb-5">
                <div className="flex flex-row">
                  <div className="overflow-hidden rounded-full w-10 h-10">
                    <LazyLoadImage src={comment.profile} onError={onImageError} />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium">{comment.nickname}</div>
                    <div className="mt-1">
                      <p className="text-xs font-normal" dangerouslySetInnerHTML={{ __html: comment.text }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-xs pl-14 mt-2">
                  <HandThumbUpIcon className="w-3 h-3" />
                  <div className="ml-1">{`${comment.likeCount}`}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
