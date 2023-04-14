import SkeletonWrapper from 'app/components/Skeleton/SkeletonWrapper';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { secondToTime } from '../../../../utils/dateUtils';
import BasicButton from '../../form/BasicButton';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IVideo } from '../../../../types/video';
import { comma } from '../../../../utils/stringUtils';
import { useTranslation } from 'react-i18next';
import { onImageError } from '../../../../utils/commonUtils';
import format from 'date-fns/format';

// type VideoDetailType = {
//   description: string;
//   publishedAt: string;
//   player: string;
//   commentCount: number;
//   url: string;
//   thumbnail: string;
//   durationSec: number;
// };

type PropsType = {
  videoDetail?: IVideo;
  loading: boolean;
};

const ThumbnailPanel = ({ videoDetail, loading }: PropsType) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex mt-16 mb-8 text-sm">
        <SkeletonWrapper>
          <Skeleton height={114} width={200} />
          <div className="flex flex-col pl-10 flex-1">
            <Skeleton className="mb-2" width={700} count={2} />
            <Skeleton className="mb-3" width={200} />
            <Skeleton height={30} width={150} />
          </div>
        </SkeletonWrapper>
      </div>
    );
  }

  const { description, commentCount, publishedAt, url, thumbnail, durationSec, title } = videoDetail || {};

  const time = secondToTime(durationSec || 0);
  const timeStr = `${time.hour ? `${time.hour}:` : ''}${time.minute ? `${time.minute}:` : ''}${time.sec ?? ''}`;

  const goYoutubeLink = () => {
    window.open(url, '_blank', 'noopener, noreferrer');
  };

  const tags = description?.match(/#[^\s]+/g);

  return (
    <div className="flex mt-16 mb-8 text-sm">
      <div className="w-[200px] h-[114px] relative">
        <LazyLoadImage src={thumbnail} width={200} height={114} onError={onImageError} />
        {/*<img src={thumbnail} />*/}
        <div className="absolute bg-dark-600/[.8] px-0.5 rounded-md right-1 bottom-1 font-semibold">{timeStr}</div>
      </div>
      <div className="flex flex-col pl-10 flex-1">
        <div className="mb-2 text-primary-100">
          <p className="line-clamp-1">{tags ? tags.join(' ') : t('no_tag')}</p>
        </div>
        <div className="mb-2 h-4 max-w-2xl">
          <p className="truncate">{title}</p>
        </div>
        <div className="mb-3 text-dark-300">
          <div className="inline-block pr-2">
            {t('published_date')} {format(new Date(publishedAt || new Date()), 'yyyy.MM.dd')}
          </div>
          <div className="inline-block h-3 border-r border-r-dark-300"></div>
          <div className="inline-block pl-2">
            {t('comments')} {comma(commentCount || 0)}
          </div>
        </div>
        <div>
          <BasicButton className="text-primary-200 border border-primary-200 bg-inherit" onClick={goYoutubeLink}>
            {t('watch_video_on_youtube')}
          </BasicButton>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailPanel;
