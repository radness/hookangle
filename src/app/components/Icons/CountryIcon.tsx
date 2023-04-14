import React, { FC, useMemo } from 'react';
import AUImage from 'assets/images/country/icon-search-au.svg';
import CAImage from 'assets/images/country/icon-search-ca.svg';
import CNImage from 'assets/images/country/icon-search-cn.svg';
import GBImage from 'assets/images/country/icon-search-gb.svg';
import IDImage from 'assets/images/country/icon-search-id.svg';
import IEImage from 'assets/images/country/icon-search-ie.svg';
import INImage from 'assets/images/country/icon-search-in.svg';
import JPImage from 'assets/images/country/icon-search-jp.svg';
import KRImage from 'assets/images/country/icon-search-kr.svg';
import NZImage from 'assets/images/country/icon-search-nz.svg';
import USImage from 'assets/images/country/icon-search-us.svg';
// import { Country } from 'types/keyword';

export enum Lang {
  KO = 'ko',
  EN = 'en',
  JA = 'ja',
  CN = 'zh-CN',
}

// const CountryIcon: FC<{ country: Country }> = ({ country }) => {
//   const imageSrc = useMemo(() => {
//     if (country === Country.AU) {
//       return AUImage;
//     } else if (country === Country.CA) {
//       return CAImage;
//     } else if (country === Country.CN) {
//       return CNImage;
//     } else if (country === Country.GB) {
//       return GBImage;
//     } else if (country === Country.ID) {
//       return IDImage;
//     } else if (country === Country.IE) {
//       return IEImage;
//     } else if (country === Country.IN) {
//       return INImage;
//     } else if (country === Country.JP) {
//       return JPImage;
//     } else if (country === Country.KR) {
//       return KRImage;
//     } else if (country === Country.NZ) {
//       return NZImage;
//     } else if (country === Country.US) {
//       return USImage;
//     }
//   }, [country]);

//   return (
//     <i className="inline-block border rounded-full">
//       <img src={imageSrc} className="w-4 h-4" alt={country} />
//     </i>
//   );
// };

// export default CountryIcon;

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
