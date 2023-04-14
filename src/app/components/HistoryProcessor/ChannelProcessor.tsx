import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { filter } from 'lodash';
import api from '../../../utils/api';
import errorHandler from '../../../utils/api/errorHandler';
import useChannels from '../../../hooks/useChannels';
import { IHistory } from '../../../types/keyword';

const REFRESH_DURATION = 10000;

export const channelHistoryFetcher = () => {
  return api
    .get(`/contents/channels/mining`)
    .then((res) => {
      const histories = res.data?.data?.histories;

      if (histories) {
        return histories.sort((a: IHistory, b: IHistory) => {
          // 오름차순
          return Number(b.round_no) - Number(a.round_no);
        });
      } else {
        return [];
      }
    })
    .catch(errorHandler);
};

const ChannelProcessor = () => {
  const intervalId = useRef<NodeJS.Timer>();
  const { data: histories, mutate: mutateKeyword } = useSWR('/contents/channels/mining', channelHistoryFetcher, {
    fallbackData: [],
  });

  const processingKeyword = useMemo(() => {
    return filter(histories, ['status', '0'])[0] || null;
  }, [histories]);

  const { mutateChannel } = useChannels(processingKeyword?.round_no);

  useEffect(() => {
    if (processingKeyword !== null) {
      toast.loading(`"${processingKeyword.keyword}" 채널 검색이 진행중입니다.`, {
        toastId: 'channelProcess',
        position: 'top-right',
        closeButton: true,
      });
      clearInterval(intervalId.current);
      intervalId.current = setInterval(async () => {
        const channelInfo = await mutateChannel();

        const text =
          `"${processingKeyword.keyword}" 채널 검색이 진행중입니다.` +
          ((channelInfo?.channels.length || 0) > 0 ? `(${channelInfo?.channels.length || 0}개 찾음)` : '');
        toast.update('channelProcess', {
          render: text,
          draggable: true,
        });

        if (channelInfo?.history?.status === '1') {
          toast.success(`"${processingKeyword.keyword}" 채널 검색이 완료되었습니다.`, {
            toastId: 'channelProcess-complete',
            position: 'top-right',
            closeOnClick: true,
            closeButton: true,
          });
          clearInterval(intervalId.current);
          mutateKeyword();
        }
      }, REFRESH_DURATION);
    } else {
      toast.dismiss('channelProcess');
    }
  }, [processingKeyword]);

  return <></>;
};

export default ChannelProcessor;
