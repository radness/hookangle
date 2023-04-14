export type DateRange = {
  keys: string[];
  values: number[];
};

export interface IVideoFilterMeta {
  startDate: string;
  endDate: string;
  contributionRateRange: [number, number, number, number, number];
  likeCountAvg: number;
  likeCountMedian: number;
  likeCountRange: number[];
  likeCountSum: number;
  performanceRateRange: [number, number, number, number, number];
  publishedAtRange: DateRange;
  subscriberCountAvg: number;
  subscriberCountMedian: number;
  subscriberCountRange: number[];
  subscriberCountSum: number;
  viewCountAvg: number;
  viewCountMedian: number;
  viewCountRange: number[];
  viewCountSum: number;
}

export interface IChannelVideoFilterMeta {
  startDate: string;
  endDate: string;
  contributionRateRange: [number, number, number, number, number];
  performanceRateRange: [number, number, number, number, number];
  publishedAtRange: DateRange;
  viewCountAvg: number;
  viewCountMedian: number;
  viewCountRange: number[];
  viewCountSum: number;
}

export interface IChannelFilterMeta {
  startDate: string;
  endDate: string;
  publishedAtRange: {
    keys: string[];
    values: number[];
  };
  cvrAvg: number;
  cvrMedian: number;
  cvrRange: number[];
  cvrSum: number;
  qualityAvg: number;
  qualityMedian: number;
  qualityRange: number[];
  qualitySum: number;
  speedAvg: number;
  speedMedian: number;
  speedRange: number[];
  speedSum: number;
  videoCountAvg: number;
  videoCountMedian: number;
  videoCountRange: number[];
  videoCountSum: number;
  subscriberCountAvg: number;
  subscriberCountMedian: number;
  subscriberCountRange: number[];
  subscriberCountSum: number;
  viewCountAvg: number;
  viewCountMedian: number;
  viewCountRange: number[];
  viewCountSum: number;
}

export enum SearchType {
  TITLE_CHANNEL = 'TC',
  TITLE = 'T',
  CHANNEL = 'C',
  EXCLUDE_TITLE = 'ET',
}

export type Bound = [number, number];
export type DateBound = [string, string];
export type FilterToggle = [boolean, boolean, boolean, boolean, boolean];

export type VideoToggleCounts = {
  contribution: [number, number, number, number, number];
  performance: [number, number, number, number, number];
  videoActive: [number, number, number, number, number];
};

export type ChannelToggleCounts = {
  cvr: [number, number, number, number, number];
  quality: [number, number, number, number, number];
  speed: [number, number, number, number, number];
};

export interface IVideoFilter {
  viewCountBound: Bound;
  subscriberBound: Bound;
  likeCountBound: Bound;
  publishedAtBound: DateBound;
  contributionToggle: FilterToggle;
  performanceToggle: FilterToggle;
  videoActiveToggle: FilterToggle;
  shorts: boolean;
  ignoreShorts: boolean;
  searchText: string;
  searchType: SearchType;
}

export interface IChannelVideoFilter {
  viewCountBound: Bound;
  publishedAtBound: DateBound;
  contributionToggle: FilterToggle;
  performanceToggle: FilterToggle;
  videoActiveToggle: FilterToggle;
  shorts: boolean;
  ignoreShorts: boolean;
  searchText: string;
  searchType: SearchType;
}

export interface IVideoFilterParam {
  likeCountMax: number;
  likeCountMin: number;
  shortsFilter: string;
  subscriberCountMax: number;
  subscriberCountMin: number;
  viewCountMax: number;
  viewCountMin: number;
  contributionRateList: string[];
  performanceRateList: string[];
  publishedDtBegin?: string;
  publishedDtEnd?: string;
  searchTitle?: string;
  exceptTitle?: string;
}

export interface IChannelVideoFilterParam {
  shortsFilter: string;
  viewCountMax: number;
  viewCountMin: number;
  contributionRateList: string[];
  performanceRateList: string[];
  publishedDtBegin?: string;
  publishedDtEnd?: string;
  searchTitle?: string;
  exceptTitle?: string;
}

export type IChannelFilter = {
  subscriberBound: Bound;
  viewCountBound: Bound;
  videoCountBound: Bound;
  speedToggle: FilterToggle;
  qualityToggle: FilterToggle;
  cvrToggle: FilterToggle;
  publishedAtBound: DateBound;
  searchText: string;
  searchType: SearchType;
};

export type IChannelFilterParam = {
  subscriberCountMax: number;
  subscriberCountMin: number;
  viewCountMax: number;
  viewCountMin: number;
  videoCountMax: number;
  videoCountMin: number;
  cvrRateList: string[];
  qualityRateList: string[];
  publishedDtBegin?: string;
  publishedDtEnd?: string;
};
