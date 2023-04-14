import React, { FC } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IVideo } from '../../../../../types/video';
import { secondToTime } from '../../../../../utils/dateUtils';
import { onImageError } from '../../../../../utils/commonUtils';

const Thumbnail: FC<{ video: IVideo }> = ({ video }) => {
  const time = secondToTime(video.durationSec);
  const timeStr = `${time.hour ? `${time.hour}:` : ''}${time.minute ? `${time.minute}:` : ''}${time.sec ?? ''}`;

  return (
    <div className="relative inline-block mx-auto">
      <LazyLoadImage
        src={video.thumbnail}
        width={120}
        height={68}
        alt="썸네일"
        className="rounded aspect-video"
        onError={onImageError}
      />
      {video.collected && (
        <div className="absolute right-1 top-1 text-2xs font-normal text-primary-200 flex items-center">
          Collect<div className="ml-1 inline-block h-1 w-1 rounded-full bg-primary-200"></div>
        </div>
      )}
      <div className="absolute bg-dark-900 text-xs px-1 rounded-md right-0.5 bottom-0.5 font-semibold">{timeStr}</div>
    </div>
  );
};

export default Thumbnail;
