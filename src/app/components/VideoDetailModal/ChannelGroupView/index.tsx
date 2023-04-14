import React, { FC, useMemo } from 'react';
import InfoPanel from '../Panel/InfoPanel';
import useSWR from 'swr';
import fetcher from '../../../../utils/fetcher';
import { ISearch } from '../../../../types/channel';
import GenderChart, { GenderData } from './GenderChart';
import AgeChart, { AgeData } from './AgeChart';
import CountryChart, { CountryData } from './CountryChart';
import SkeletonWrapper from '../../Skeleton/SkeletonWrapper';
import Skeleton from 'react-loading-skeleton';
type Props = {
  channelId?: string;
};

export const CHART_COLORS = ['#9DBDD5', '#FB9487', '#B5D183', '#F1B974', '#C192C1', '#AEADAB'];

const ChannelGraphView: FC<Props> = ({ channelId }) => {
  const { data, isLoading } = useSWR(channelId ? `/contents/channels/${channelId}/viewer` : null, fetcher);
  const graphData: ISearch | undefined = data?.viewer;
  const hasChart = useMemo(() => {
    return graphData && Object.keys(graphData.local).length === 0 && graphData.female === 0 && graphData.male === 0;
  }, [graphData]);

  const countryData: CountryData[] = Object.keys(graphData?.local || {}).map((key) => ({
    name: key,
    value: graphData?.local?.[key],
  }));

  const genderData: GenderData[] = [
    { name: '남성', male: graphData?.male },
    { name: '여성', female: graphData?.female },
  ];

  const ageData: AgeData[] = [
    { name: '10대', '10': graphData?.age[10] || 0 },
    { name: '20대', '20': graphData?.age[20] || 0 },
    { name: '30대', '30': graphData?.age[30] || 0 },
    { name: '40대', '40': graphData?.age[40] || 0 },
    { name: '50대', '50': graphData?.age[50] || 0 },
    { name: '60대', '60': graphData?.age[60] || 0 },
  ];

  return (
    <>
      <InfoPanel title="시청자 분포" className="md:col-span-4" isBeta={true}>
        <div className="w-full h-[200px]">
          {isLoading ? (
            <SkeletonWrapper>
              <Skeleton height="100%" />
            </SkeletonWrapper>
          ) : (
            <CountryChart data={countryData} noData={countryData.length === 0} />
          )}
        </div>
      </InfoPanel>
      <InfoPanel title="시청자 성비" className="md:col-span-4" isBeta={true}>
        <div className="w-full h-[200px]">
          {isLoading ? (
            <SkeletonWrapper>
              <Skeleton height="100%" />
            </SkeletonWrapper>
          ) : (
            <GenderChart data={genderData} noData={!!hasChart} />
          )}
        </div>
      </InfoPanel>
      <InfoPanel title="시청자 연령대" className="md:col-span-4" isBeta={true}>
        <div className="w-full h-[200px]">
          {isLoading ? (
            <SkeletonWrapper>
              <Skeleton height="100%" />
            </SkeletonWrapper>
          ) : (
            <AgeChart data={ageData} noData={!!hasChart} />
          )}
        </div>
      </InfoPanel>
    </>
  );
};

export default ChannelGraphView;
s