import React, { FC } from 'react';
import InfoModal from 'app/components/Modal/InfoModal';
import { IVideo } from '../../../types/video';
import VideoDetail from './VideoDetail';

type Props = {
  video?: IVideo;
  isOpen: boolean;
  onCloseModal(): void;
  onClickClipVideo?: () => void;
  onClickAddChannel?: () => void;
  onClickIgnoreVideo?: () => void;
  onClickIgnoreChannel?: () => void;
  onClickClipFavoriteVideo?: (videoId: string) => void;
};

const VideoDetailModal: FC<Props> = ({
  video,
  isOpen,
  onCloseModal,
  onClickClipVideo,
  onClickIgnoreVideo,
  onClickIgnoreChannel,
  onClickAddChannel,
  onClickClipFavoriteVideo,
}) => {
  return (
    <InfoModal show={isOpen} onCloseModal={onCloseModal}>
      <VideoDetail
        video={video}
        {...{
          onClickClipFavoriteVideo,
          onClickClipVideo,
          onClickIgnoreVideo,
          onClickIgnoreChannel,
          onClickAddChannel,
        }}
      />
    </InfoModal>
  );
};

export default VideoDetailModal;
