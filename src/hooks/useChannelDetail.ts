import useSWR, { KeyedMutator } from 'swr';

import { IVideo } from 'types/video';

import fetcher from '../utils/fetcher';
import { IChannelDetail } from '../types/channel';

type ReturnType = {
  channelDetail?: IChannelDetail;
  mutateVideo?: KeyedMutator<IVideo>;
  isLoading: boolean;
};

const useChannelDetail = (channelId?: string): ReturnType => {
  const {
    data: detailInfo,
    mutate,
    isLoading,
  } = useSWR<any>(channelId ? `/contents/channels/${channelId}/mining/detail` : null, fetcher, {
    dedupingInterval: 3600 * 1000,
  });

  if (!detailInfo) {
    return { channelDetail: undefined, mutateVideo: mutate, isLoading };
  }

  return {
    channelDetail: detailInfo.channelInfo,
    mutateVideo: mutate,
    isLoading,
  };
};

export default useChannelDetail;
