import useSWR, { KeyedMutator } from 'swr';
import api from '../utils/api';
import errorHandler from '../utils/api/errorHandler';
import { IChannel, IChannelInfo } from '../types/channel';
import { IChannelFilterMeta } from '../types/filter';
import format from 'date-fns/format';

const channelFetcher = ([url, roundNo]: [string, string]) => {
  return api
    .get(`/contents/channels/${roundNo}/mining`)
    .then((res) => {
      const channelInfo = res.data?.data;

      // if(channelInfo && channelInfo.channels) {
      // 	const midValue = getMidValue(channelInfo.channels);
      //
      // 	for(let i = 0 ; i < channelInfo.channels.length; i++) {
      // 		const channel = channelInfo.channels[i];
      // 		channel.cvrStr = getRate(channel.cvr, midValue.cvrMid, midValue.cvrTop);
      // 		channel.qualityStr = getRate(channel.quality, midValue.qualityMid, midValue.qualityTop);
      // 	}
      // }

      return channelInfo;
    })
    .catch(errorHandler);
};

type ReturnType = {
  channels: IChannel[];
  filterMeta: IChannelFilterMeta | undefined;
  mutateChannel: KeyedMutator<IChannelInfo>;
  loading: boolean;
  currentChannelSpeedDate: string | undefined;
};

const useChannels = (roundNo: string | undefined): ReturnType => {
  const {
    data: channelInfo,
    mutate,
    isLoading,
  } = useSWR<IChannelInfo>(roundNo ? ['channels', roundNo] : null, channelFetcher, {
    dedupingInterval: 3600 * 1000,
  });

  if (!channelInfo)
    return {
      channels: [],
      filterMeta: undefined,
      mutateChannel: mutate,
      loading: true,
      currentChannelSpeedDate: undefined,
    };

  const filter = Object.keys(channelInfo.filter || {}).length !== 0 ? channelInfo.filter : undefined;

  if (filter !== undefined) {
    filter.startDate = format(new Date(filter.startDate), 'yyyy-MM-dd');
    filter.endDate = format(new Date(filter.endDate), 'yyyy-MM-dd');
  }

  const channels: IChannel[] = channelInfo.channels || [];

  return {
    channels,
    filterMeta: filter,
    mutateChannel: mutate,
    loading: isLoading,
    currentChannelSpeedDate: channelInfo.speed_update_dt,
  };
};

export default useChannels;
