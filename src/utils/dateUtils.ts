import i18next from 'i18next';

/**
 * @param date
 * 2022-03-02 ... -> 1년 전
 */
export const getGapStringFromDate = (date: Date) => {
  let serverTime = new Date();
  let dateGap = serverTime.getTime() - date.getTime();
  // let timeGap = serverTime.getTime() - date.getTime();

  let diffDay = Math.floor(dateGap / (1000 * 60 * 60 * 24)); // 일수
  let diffYear = Math.round(dateGap / (1000 * 60 * 60 * 24 * 365));
  let diffMonth = Math.round(dateGap / (1000 * 60 * 60 * 24 * 30));
  let diffHour = Math.floor(dateGap / (1000 * 60 * 60)); // 시간
  let diffMin = Math.floor(dateGap / (1000 * 60)); // 분
  let gap =
    diffYear > 0
      ? diffYear + i18next.t('year_ago')
      : diffMonth > 0
      ? diffMonth + i18next.t('month_ago')
      : diffDay > 0
      ? diffDay + i18next.t('day_ago')
      : diffHour > 0
      ? diffHour + i18next.t('hour_ago')
      : diffMin + i18next.t('minute_ago');
  if (isNaN(diffMin)) {
    gap = '';
  }
  return gap;
};

export const getGapStringFromDate2 = (date: Date) => {
  let serverTime = new Date();
  let dateGap = serverTime.getTime() - date.getTime();
  // let timeGap = serverTime.getTime() - date.getTime();

  let diffDay = Math.floor(dateGap / (1000 * 60 * 60 * 24)); // 일수
  let diffYear = Math.round(dateGap / (1000 * 60 * 60 * 24 * 365));
  let diffMonth = Math.round(dateGap / (1000 * 60 * 60 * 24 * 30));
  let diffHour = Math.floor(dateGap / (1000 * 60 * 60)); // 시간
  let diffMin = Math.floor(dateGap / (1000 * 60)); // 분
  let gap =
    (diffYear > 0 ? diffYear + '년 ' : '') +
    (diffMonth > 0 ? diffMonth + '달 ' : '') +
    (diffDay > 0 ? diffDay + '일 ' : '') +
    (diffHour > 0 ? diffHour + '시간 ' : '') +
    (diffMin > 0 ? diffMin + '분 ' : '') +
    '전';
  if (isNaN(diffMin)) {
    gap = '';
  }
  return gap;
};

export const openDateDiff = (openDate: string) => {
  const today = new Date();
  const oDate = new Date(openDate);
  const diff = today.getTime() - oDate.getTime();
  const elapsedDay = diff / 1000 / 60 / 60 / 24;

  return Math.ceil(elapsedDay);
};

export const secondToTime = (second: number) => {
  let _sec = Math.max((second % 60) - 1, 0);
  let _minute = Math.floor(second / 60) % 60;
  let _hour = Math.floor(second / 60 / 60) % 24;

  const sec = _sec < 10 ? '0' + _sec : _sec + '';
  const minute = _minute < 10 ? '0' + _minute : _minute + '';
  const hour = _hour < 10 ? '0' + _hour : _hour + '';

  return {
    sec,
    minute,
    hour: second < 3600 ? undefined : hour,
  };
};
