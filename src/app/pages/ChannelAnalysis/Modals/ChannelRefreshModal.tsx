import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import InfoModal from '../../../components/Modal/InfoModal';
import useAlert from '../../../../hooks/useAlert';
import errorHandler from '../../../../utils/api/errorHandler';
import { IChannel } from '../../../../types/channel';
import { dailyMissionTimer } from '../../../../utils/commonUtils';
import { ClockIcon } from '@heroicons/react/24/outline';
import api from '../../../../utils/api';
import BasicModal from '../../../components/Modal/BasicModal';

type Props = {
  show: boolean;
  onCloseModal: () => void;
  currentChannel?: IChannel;
  onUpdated: () => void;
};

const ChannelRefreshModal: FC<Props> = ({ show, onCloseModal, currentChannel, onUpdated }) => {
  const { open: alert } = useAlert();
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [timeText, setTimeText] = useState('99:99');

  const handleCloseModal = useCallback(() => {
    onCloseModal();
  }, [onCloseModal]);

  const handleClickRefreshChannel = useCallback(async () => {
    try {
      setLoading(true);
      await api.put(`/contents/channels/${currentChannel?.id}/refresh`);
      dailyMissionTimer(Math.max(Math.ceil((currentChannel?.videoCount || 1) / 30), 10) / 60, setTimeText, () => {
        onUpdated();
        handleCloseModal();
      });
    } catch (err) {
      errorHandler(err);
    }
  }, [currentChannel, alert, handleCloseModal]);

  useEffect(() => {
    if (show) {
      setLoading(false);
      setTimeText('99:99');
    }
  }, [show]);

  return (
    <BasicModal show={show} onCloseModal={handleCloseModal} initialFocus={buttonRef} showCloseButton={false}>
      <div className="py-14 bg-dark-900 text-center border border-primary-200 rounded-md w-[460px]">
        <h2 className="text-base text-primary-200">최신 데이터 업데이트</h2>
        <div className="mt-8 text-primary-200 text-sm font-normal">
          {loading ? (
            <div>
              <div>
                '{currentChannel?.title}'<br />
                채널 데이터를 최신화하고 있습니다.
                <br />
                채널의 영상수에 따라 소요시간이 달라질 수 있습니다.
                <br /> 이 화면을 떠나셔도 데이터 최신화는 진행됩니다.
              </div>
              <div className="flex items-center justify-center mt-2">
                <ClockIcon className="w-4 h-4" />
                <span className="ml-2 text-sm">
                  <b>{timeText}</b>
                </span>
              </div>
              <div className="mt-8">
                <button
                  className="px-6 py-3 text-xs border border-primary-200 text-primary-200 rounded-md"
                  onClick={handleCloseModal}
                >
                  닫기
                </button>
              </div>
            </div>
          ) : (
            <div>
              최신화 버튼을 누르시면 해당 채널의 데이터가 최신화 됩니다.
              <div className="mt-8">
                <button className="cancel-btn" onClick={handleCloseModal}>
                  취소
                </button>
                <button className="ml-4 confirm-btn" onClick={handleClickRefreshChannel} ref={buttonRef}>
                  최신화
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BasicModal>
  );
};

export default ChannelRefreshModal;
