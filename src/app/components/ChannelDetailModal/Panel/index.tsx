import React, { FC, useCallback, useState } from 'react';

import InfoModal from 'app/components/Modal/InfoModal';

import { IChannel } from '../../../types/channel';
import ChannelDetail from './ChannelDetail';
import { IVideo } from '../../../types/video';
import VideoDetail from '../VideoDetailModal/VideoDetail';

type Props = {
  channel: IChannel;
  isOpen: boolean;
  onCloseModal(): void;
  onClickAddChannel: () => void;
  onClickIgnoreChannel: () => void;
};

enum ModalState {
  CHANNEL,
  VIDEO,
}

const ChannelDetailModal: FC<Props> = ({ channel, isOpen, onCloseModal, onClickIgnoreChannel, onClickAddChannel }) => {
  const [modalState, setModalState] = useState<ModalState>(ModalState.CHANNEL);
  const [currentVideo, setCurrentVideo] = useState<IVideo>();
  const [currentChannel, setCurrentChannel] = useState<IChannel>(channel);

  const handleClickChannelVideo = useCallback((video: IVideo) => {
    setCurrentVideo(video);
    setModalState(ModalState.VIDEO);
  }, []);

  return (
    <InfoModal show={isOpen} onCloseModal={onCloseModal}>
      {modalState === ModalState.CHANNEL ? (
        <ChannelDetail
          channel={currentChannel}
          onClickVideo={handleClickChannelVideo}
          {...{
            onClickIgnoreChannel,
            onClickAddChannel,
          }}
        />
      ) : (
        <VideoDetail video={currentVideo} />
      )}
    </InfoModal>
  );
};

export default ChannelDetailModal;
