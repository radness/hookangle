import {
  ChannelToggleCounts,
  FilterToggle,
  IChannelFilter,
  IChannelFilterMeta,
  IChannelFilterParam,
  IVideoFilter,
  IVideoFilterParam,
  SearchType,
  VideoToggleCounts,
} from '../../../types/filter';
import { IChannel } from '../../../types/channel';
import format from 'date-fns/format';

const checkToggle = (str: string, toggle: [boolean, boolean, boolean, boolean, boolean]) => {
  if (toggle.indexOf(true) < 0) {
    return true;
  } else if (
    (str === '매우 나쁨' && toggle[0]) ||
    (str === '나쁨' && toggle[1]) ||
    (str === '보통' && toggle[2]) ||
    (str === '좋음' && toggle[3]) ||
    (str === '매우 좋음' && toggle[4])
  ) {
    return true;
  } else {
    return false;
  }
};

const checkChannelSpeedToggle = (str: string, toggle: [boolean, boolean, boolean, boolean, boolean]) => {
  if (toggle.indexOf(true) < 0) {
    return true;
  } else if (
    (str === '매우 낮음' && toggle[0]) ||
    (str === '낮음' && toggle[1]) ||
    (str === '보통' && toggle[2]) ||
    (str === '높음' && toggle[3]) ||
    (str === '매우 높음' && toggle[4])
  ) {
    return true;
  } else {
    return false;
  }
};

const checkBound = (value: number, bound: [number, number]) => {
  return value >= bound[0] && value <= bound[1];
};

const checkDateBound = (value: string, bound: [string, string]) => {
  const date = format(new Date(value), 'yyyy-MM-dd');
  return date >= bound[0] && date <= bound[1];
};

const checkShorts = (value: boolean, shorts: boolean, ignoreShorts: boolean) => {
  if (!ignoreShorts && !shorts) return true;
  if (shorts && value) return true;
  if (ignoreShorts && !value) return true;
  return false;
};
export const checkSearchText = (channel: IChannel, searchType: SearchType, searchText: string) => {
  if (searchText.trim() === '') return true;

  searchText = searchText.toLowerCase();

  if (searchType === SearchType.TITLE_CHANNEL) {
    if (channel.title.toLowerCase().indexOf(searchText) > -1 || channel.title.toLowerCase().indexOf(searchText) > -1)
      return true;
  } else if (searchType === SearchType.TITLE) {
    if (channel.title.toLowerCase().indexOf(searchText) > -1) return true;
  } else if (searchType === SearchType.CHANNEL) {
    if (channel.title.toLowerCase().indexOf(searchText) > -1) return true;
  } else if (searchType === SearchType.EXCLUDE_TITLE) {
    if (channel.title.toLowerCase().indexOf(searchText) === -1) return true;
  }
  return false;
};

export const filterBoundsChannels = (channel: IChannel, filter: IChannelFilter) => {
  return (
    checkBound(Math.min(channel.viewCount, 1000000), filter.viewCountBound) &&
    checkBound(Math.min(channel.subscriberCount, 1000000), filter.subscriberBound) &&
    checkBound(Math.min(channel.videoCount, 100000), filter.videoCountBound) &&
    checkDateBound(channel.publishedAt, filter.publishedAtBound)
  );
};

export const filterToggleChannels = (channel: IChannel, filter: IChannelFilter) => {
  return (
    checkToggle(channel.cvrStr, filter.cvrToggle) &&
    checkToggle(channel.qualityStr, filter.qualityToggle) &&
    checkChannelSpeedToggle(channel.speedStr, filter.speedToggle)
  );
};

export const filterToFilterParam = (filterData: IChannelFilter): IChannelFilterParam => {
  const cvrRateList: string[] = [];
  const qualityRateList: string[] = [];

  filterData.cvrToggle.forEach((b, index) => {
    if (b) {
      if (index === 0) cvrRateList.push('매우 나쁨');
      else if (index === 1) cvrRateList.push('나쁨');
      else if (index === 2) cvrRateList.push('보통');
      else if (index === 3) cvrRateList.push('좋음');
      else if (index === 4) cvrRateList.push('매우 좋음');
    }
  });

  filterData.qualityToggle.forEach((b, index) => {
    if (b) {
      if (index === 0) qualityRateList.push('매우 나쁨');
      else if (index === 1) qualityRateList.push('나쁨');
      else if (index === 2) qualityRateList.push('보통');
      else if (index === 3) qualityRateList.push('좋음');
      else if (index === 4) qualityRateList.push('매우 좋음');
    }
  });

  const filterParam: IChannelFilterParam = {
    viewCountMin: filterData.viewCountBound[0],
    viewCountMax: filterData.viewCountBound[1] === 1000000 ? 999999999999 : filterData.viewCountBound[1],
    videoCountMin: filterData.videoCountBound[0],
    videoCountMax: filterData.videoCountBound[1] === 100000 ? 999999999999 : filterData.videoCountBound[1],
    subscriberCountMin: filterData.subscriberBound[0],
    subscriberCountMax: filterData.subscriberBound[1] === 1000000 ? 999999999999 : filterData.subscriberBound[1],
    cvrRateList: cvrRateList,
    qualityRateList: qualityRateList,
    publishedDtBegin: filterData.publishedAtBound[0],
    publishedDtEnd: filterData.publishedAtBound[1],
  };

  return filterParam;
};

export const filterParamToFilter = (filterParam: IVideoFilterParam | null): IVideoFilter => {
  if (filterParam === null) {
    return {
      viewCountBound: [0, 1000000],
      subscriberBound: [0, 1000000],
      likeCountBound: [0, 100000],
      publishedAtBound: ['2022-03-02', '2022-03-02'],
      contributionToggle: [false, false, false, false, false],
      performanceToggle: [false, false, false, false, false],
      videoActiveToggle: [false, false, false, false, false],
      shorts: false,
      ignoreShorts: false,
      searchText: '',
      searchType: SearchType.TITLE_CHANNEL,
    };
  } else {
    const contributionInitToggle: FilterToggle = [
      filterParam.contributionRateList.indexOf('매우 나쁨') > -1,
      filterParam.contributionRateList.indexOf('나쁨') > -1,
      filterParam.contributionRateList.indexOf('보통') > -1,
      filterParam.contributionRateList.indexOf('좋음') > -1,
      filterParam.contributionRateList.indexOf('매우 좋음') > -1,
    ];

    const performanceInitToggle: FilterToggle = [
      filterParam.performanceRateList.indexOf('매우 나쁨') > -1,
      filterParam.performanceRateList.indexOf('나쁨') > -1,
      filterParam.performanceRateList.indexOf('보통') > -1,
      filterParam.performanceRateList.indexOf('좋음') > -1,
      filterParam.performanceRateList.indexOf('매우 좋음') > -1,
    ];

    return {
      viewCountBound: [filterParam.viewCountMin || 0, Math.min(filterParam.viewCountMax || 1000000, 1000000)],
      subscriberBound: [filterParam.subscriberCountMin || 0, Math.min(filterParam.subscriberCountMax || 1000000)],
      likeCountBound: [filterParam.likeCountMin || 0, Math.min(filterParam.likeCountMax || 100000)],
      contributionToggle: contributionInitToggle,
      performanceToggle: performanceInitToggle,
      videoActiveToggle: [false, false, false, false, false],
      publishedAtBound: ['2000-03-02', '2099-03-02'],
      searchText: '',
      searchType: SearchType.TITLE_CHANNEL,
      shorts: filterParam.shortsFilter === 'shorts',
      ignoreShorts: filterParam.shortsFilter === 'antiShorts',
    };
  }
};

export const getToggleCounts = (channels: IChannel[]) => {
  const toggleCounts: ChannelToggleCounts = {
    cvr: [0, 0, 0, 0, 0],
    quality: [0, 0, 0, 0, 0],
    speed: [0, 0, 0, 0, 0],
  };
  channels.forEach((channel: IChannel) => {
    if (channel.cvrStr === '매우 나쁨') toggleCounts.cvr[0] += 1;
    else if (channel.cvrStr === '나쁨') toggleCounts.cvr[1] += 1;
    else if (channel.cvrStr === '보통') toggleCounts.cvr[2] += 1;
    else if (channel.cvrStr === '좋음') toggleCounts.cvr[3] += 1;
    else if (channel.cvrStr === '매우 좋음') toggleCounts.cvr[4] += 1;

    if (channel.qualityStr === '매우 나쁨') toggleCounts.quality[0] += 1;
    else if (channel.qualityStr === '나쁨') toggleCounts.quality[1] += 1;
    else if (channel.qualityStr === '보통') toggleCounts.quality[2] += 1;
    else if (channel.qualityStr === '좋음') toggleCounts.quality[3] += 1;
    else if (channel.qualityStr === '매우 좋음') toggleCounts.quality[4] += 1;

    if (channel.speedStr === '매우 낮음') toggleCounts.speed[0] += 1;
    else if (channel.speedStr === '낮음') toggleCounts.speed[1] += 1;
    else if (channel.speedStr === '보통') toggleCounts.speed[2] += 1;
    else if (channel.speedStr === '높음') toggleCounts.speed[3] += 1;
    else if (channel.speedStr === '매우 높음') toggleCounts.speed[4] += 1;
  });

  return toggleCounts;
};
