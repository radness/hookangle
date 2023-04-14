import { IVideo } from '../../../types/video';
import { FilterToggle, IVideoFilter, IVideoFilterParam, SearchType, VideoToggleCounts } from '../../../types/filter';
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

const checkVideoActiveToggle = (str: string, toggle: [boolean, boolean, boolean, boolean, boolean]) => {
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
export const checkSearchText = (video: IVideo, searchType: SearchType, searchText: string) => {
  if (searchText.trim() === '') return true;

  searchText = searchText.toLowerCase();

  if (searchType === SearchType.TITLE_CHANNEL) {
    if (video.title.toLowerCase().indexOf(searchText) > -1 || video.channelTitle.toLowerCase().indexOf(searchText) > -1)
      return true;
  } else if (searchType === SearchType.TITLE) {
    if (video.title.toLowerCase().indexOf(searchText) > -1) return true;
  } else if (searchType === SearchType.CHANNEL) {
    if (video.channelTitle.toLowerCase().indexOf(searchText) > -1) return true;
  } else if (searchType === SearchType.EXCLUDE_TITLE) {
    if (video.title.toLowerCase().indexOf(searchText) === -1) return true;
  }
  return false;
};

export const filterBoundsVideos = (video: IVideo, filter: IVideoFilter) => {
  return (
    checkBound(Math.min(video.viewCount, 1000000), filter.viewCountBound) &&
    checkBound(Math.min(video.subscriberCount, 1000000), filter.subscriberBound) &&
    checkBound(Math.min(video.likeCount, 100000), filter.likeCountBound) &&
    checkDateBound(video.publishedAt, filter.publishedAtBound) &&
    checkShorts(video.shorts, filter.shorts, filter.ignoreShorts)
  );
};

export const filterToggleVideos = (video: IVideo, filter: IVideoFilter) => {
  return (
    checkToggle(video.contributionRateStr, filter.contributionToggle) &&
    checkToggle(video.performanceRateStr, filter.performanceToggle) &&
    checkVideoActiveToggle(video.videoActiveRateStr, filter.videoActiveToggle)
  );
};

export const filterToFilterParam = (filterData: IVideoFilter): IVideoFilterParam => {
  const contributionRateList: string[] = [];
  const performanceRateList: string[] = [];

  filterData.contributionToggle.forEach((b, index) => {
    if (b) {
      if (index === 0) contributionRateList.push('매우 나쁨');
      else if (index === 1) contributionRateList.push('나쁨');
      else if (index === 2) contributionRateList.push('보통');
      else if (index === 3) contributionRateList.push('좋음');
      else if (index === 4) contributionRateList.push('매우 좋음');
    }
  });

  filterData.performanceToggle.forEach((b, index) => {
    if (b) {
      if (index === 0) performanceRateList.push('매우 나쁨');
      else if (index === 1) performanceRateList.push('나쁨');
      else if (index === 2) performanceRateList.push('보통');
      else if (index === 3) performanceRateList.push('좋음');
      else if (index === 4) performanceRateList.push('매우 좋음');
    }
  });

  const filterParam: IVideoFilterParam = {
    viewCountMin: filterData.viewCountBound[0],
    viewCountMax: filterData.viewCountBound[1] === 1000000 ? 999999999999 : filterData.viewCountBound[1],
    likeCountMin: filterData.likeCountBound[0],
    likeCountMax: filterData.likeCountBound[1] === 100000 ? 999999999999 : filterData.likeCountBound[1],
    subscriberCountMin: filterData.subscriberBound[0],
    subscriberCountMax: filterData.subscriberBound[1] === 1000000 ? 999999999999 : filterData.subscriberBound[1],
    contributionRateList: contributionRateList,
    performanceRateList: performanceRateList,
    shortsFilter: filterData.shorts ? 'shorts' : filterData.ignoreShorts ? 'antiShorts' : 'all',
    publishedDtBegin: filterData.publishedAtBound[0],
    publishedDtEnd: filterData.publishedAtBound[1],
    searchTitle: filterData.searchType === SearchType.TITLE ? filterData.searchText : '',
    exceptTitle: filterData.searchType === SearchType.EXCLUDE_TITLE ? filterData.searchText : '',
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

export const getToggleCounts = (videos: IVideo[]) => {
  const toggleCounts: VideoToggleCounts = {
    contribution: [0, 0, 0, 0, 0],
    performance: [0, 0, 0, 0, 0],
    videoActive: [0, 0, 0, 0, 0],
  };
  videos.forEach((video: IVideo) => {
    if (video.contributionRateStr === '매우 나쁨') toggleCounts.contribution[0] += 1;
    else if (video.contributionRateStr === '나쁨') toggleCounts.contribution[1] += 1;
    else if (video.contributionRateStr === '보통') toggleCounts.contribution[2] += 1;
    else if (video.contributionRateStr === '좋음') toggleCounts.contribution[3] += 1;
    else if (video.contributionRateStr === '매우 좋음') toggleCounts.contribution[4] += 1;

    if (video.performanceRateStr === '매우 나쁨') toggleCounts.performance[0] += 1;
    else if (video.performanceRateStr === '나쁨') toggleCounts.performance[1] += 1;
    else if (video.performanceRateStr === '보통') toggleCounts.performance[2] += 1;
    else if (video.performanceRateStr === '좋음') toggleCounts.performance[3] += 1;
    else if (video.performanceRateStr === '매우 좋음') toggleCounts.performance[4] += 1;

    if (video.videoActiveRateStr === '매우 낮음') toggleCounts.videoActive[0] += 1;
    else if (video.videoActiveRateStr === '낮음') toggleCounts.videoActive[1] += 1;
    else if (video.videoActiveRateStr === '보통') toggleCounts.videoActive[2] += 1;
    else if (video.videoActiveRateStr === '높음') toggleCounts.videoActive[3] += 1;
    else if (video.videoActiveRateStr === '매우 높음') toggleCounts.videoActive[4] += 1;
  });

  return toggleCounts;
};
