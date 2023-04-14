import useSWR, { KeyedMutator } from 'swr';
import { IVideo, IVideoInfo } from 'types/video';
import api from '../utils/api';
import errorHandler from '../utils/api/errorHandler';
import { IVideoFilterMeta } from '../types/filter';
import format from 'date-fns/format';

const videoFetcher = ([url, roundNo]: [string, string]) => {
  return api
    .get(url, { params: { round_no: roundNo } })
    .then((res) => {
      // setLoading(false);
      return res.data?.data;
    })
    .catch(errorHandler);
};

type ReturnType = {
  videos: IVideo[];
  filterMeta: IVideoFilterMeta | undefined;
  mutateVideo: KeyedMutator<IVideoInfo>;
  isLoading: boolean;
  currentVideoActiveDate: string | undefined;
};

const useVideo = (roundNo: string | undefined): ReturnType => {
  const {
    data: videoInfo,
    mutate,
    isLoading,
  } = useSWR<IVideoInfo>(roundNo ? ['/contents/videos', roundNo] : null, videoFetcher, {
    dedupingInterval: 3600 * 1000,
  });

  if (!videoInfo)
    return { videos: [], filterMeta: undefined, mutateVideo: mutate, isLoading, currentVideoActiveDate: undefined };

  const filterMeta = Object.keys(videoInfo.filter || {}).length !== 0 ? videoInfo.filter : undefined;

  if (filterMeta) {
    filterMeta.startDate = format(new Date(filterMeta.startDate), 'yyyy-MM-dd');
    filterMeta.endDate = format(new Date(filterMeta.endDate), 'yyyy-MM-dd');
  }

  return {
    videos: videoInfo.videos || [],
    filterMeta: filterMeta,
    mutateVideo: mutate,
    isLoading,
    currentVideoActiveDate: videoInfo.videoActiveRate_update_dt,
  };
};

export default useVideo;
