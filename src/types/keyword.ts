export interface IHistory {
  _id: string;
  keyword: string;
  newKeyword: boolean;
  channelId: string;
  country: string;
  lang: string;
  level: number;
  avgViewCount: string;
  subscriberCount: string;
  round_no: string;
  status: string;
  uid: string;
  use_yn: string;
  scheduler_yn: string;
  video_tp: string;
  example: boolean;
  create_user: string;
  create_dt: string;
  update_user: string;
  update_dt: string;
}

export interface IRecKeyword {
  count: number;
  keyword: string;
}

export enum Country {
  AU = 'AU',
  CA = 'CA',
  CN = 'CN',
  GB = 'GB',
  ID = 'ID',
  IE = 'IE',
  IN = 'IN',
  JP = 'JP',
  KR = 'KR',
  NZ = 'NZ',
  US = 'US',
}
