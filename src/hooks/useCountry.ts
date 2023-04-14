import React, { useCallback } from 'react';
import useUser from './useUser';
import api from '../utils/api';
import errorHandler from '../utils/api/errorHandler';
import { Country } from '../types/keyword';

const useCountry = (): { country: Country; setCountry: (country: Country) => void } => {
  const { user, mutate: mutateUser } = useUser();

  const setCountry = useCallback(
    (country: Country) => {
      api
        .post(`/users/${user.uid}/countries/${country}`)
        .then((res) => {
          mutateUser();
        })
        .catch(errorHandler);

      // setCookies('country', country, {
      //   expires: addDays(new Date(), 30),
      //   secure: true
      // });
    },
    [user],
  );

  return {
    country: user?.country || Country.KR,
    setCountry: setCountry,
  };
};

export default useCountry;

export const getCountryName = (country: string): string => {
  if (country === 'KR') {
    return '한국';
  } else if (country === 'US') {
    return '미국';
  } else if (country === 'JP') {
    return '일본';
  } else if (country === 'CA') {
    return '캐나다';
  } else if (country === 'AU') {
    return '호주';
  } else if (country === 'NZ') {
    return '뉴질랜드';
  } else if (country === 'GB') {
    return '영국';
  } else if (country === 'IE') {
    return '아일랜드';
  } else if (country === 'IN') {
    return '인도';
  } else if (country === 'ID') {
    return '인도네시아';
  } else if (country === 'CN') {
    return '중국';
  } else {
    return '한국';
  }
};
