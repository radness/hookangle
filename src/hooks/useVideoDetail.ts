import useSWR, { KeyedMutator } from 'swr';

import { IVideo } from 'types/video';

import api from 'utils/api';
import errorHandler from 'utils/api/errorHandler';

const detailFetcher = async (url: string) => {
  try {
    const res = await api.get(url);

    return res.data?.data;
  } catch (err) {
    errorHandler(err);
  }
};

type ReturnType = {
  videoDetail?: IVideo;
  mutateVideo?: KeyedMutator<IVideo>;
  isLoading: boolean;
};

const useVideoDetail = (videoId?: string): ReturnType => {
  const {
    data: detailInfo,
    mutate,
    isLoading,
  } = useSWR<any>(videoId ? `/contents/videos/${videoId}` : null, detailFetcher, {
    dedupingInterval: 3600 * 1000,
  });

  if (!detailInfo) {
    return { videoDetail: undefined, mutateVideo: mutate, isLoading };
  }

  return {
    videoDetail: detailInfo.video,
    mutateVideo: mutate,
    isLoading,
  };
};

export default useVideoDetail;
