import { atomFamily } from 'recoil';
import { IChannelVideoFilter, IVideoFilter, IVideoFilterMeta, SearchType } from '../types/filter';
import addYears from 'date-fns/addYears';
import format from 'date-fns/format';

export const videoFilterMetaDefault: IVideoFilterMeta = {
  viewCountSum: 0,
  likeCountMedian: 0,
  likeCountAvg: 0,
  likeCountSum: 0,
  subscriberCountMedian: 0,
  subscriberCountAvg: 0,
  subscriberCountSum: 0,
  viewCountMedian: 0,
  viewCountAvg: 0,
  likeCountRange: [],
  subscriberCountRange: [],
  contributionRateRange: [20, 20, 20, 20, 20],
  performanceRateRange: [30, 30, 30, 30, 50],
  publishedAtRange: { keys: [], values: [] },
  viewCountRange: [],
  endDate: '2021-03-02',
  startDate: '2022-01-03',
};

export const channelVideoFilterDefault: IChannelVideoFilter = {
  viewCountBound: [0, 1000000],
  searchText: '',
  contributionToggle: [false, false, false, false, false],
  performanceToggle: [false, false, false, false, false],
  videoActiveToggle: [false, false, false, false, false],
  ignoreShorts: false,
  shorts: false,
  publishedAtBound: ['2000-03-02', format(addYears(new Date(), 1), 'yyyy-MM-dd')],
  searchType: SearchType.TITLE,
};

export const channelVideoFilterState = atomFamily<IChannelVideoFilter, string>({
  key: 'videoFilterState',
  default: channelVideoFilterDefault,
});
