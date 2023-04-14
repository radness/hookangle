import React, { FC, useMemo, useState } from 'react';
import useSWR from 'swr';
import api from '../../../utils/api';
import errorHandler from '../../../utils/api/errorHandler';
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { comma } from '../../../utils/stringUtils';
import Skeleton from 'react-loading-skeleton';
import SkeletonWrapper from '../Skeleton/SkeletonWrapper';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const chartDummyData = [
  { name: '22.01.11', value: 10 },
  { name: '22.02.11', value: 20 },
  { name: '22.03.11', value: 25 },
  { name: '22.04.11', value: 40 },
  { name: '22.05.11', value: 70 },
  { name: '22.06.11', value: 75 },
];

type Props = {
  videoId?: string;
};

const chartFetcher = async (url: string) => {
  try {
    const res = await api.get(url);
    // console.log(res.data)

    return res.data?.data;
  } catch (err) {
    errorHandler(err);
  }
};
const GrowthLineChart: FC<Props> = ({ videoId }) => {
  const { t } = useTranslation();
  const [showChart, setShowChart] = useState(false);
  const { data, isLoading } = useSWR(videoId && showChart ? `/contents/videos/${videoId}/graph` : null, chartFetcher);

  const chartData = useMemo(() => {
    if (data) {
      return data.graph.keys.map((key: string, i: number) => ({
        name: key,
        value: data.graph.values[i],
      }));
    } else {
      return [];
    }
  }, [data]);

  if (!showChart) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center w-[300px] h-[128px] bg-dark-850 border border-primary-200 rounded-md">
          <div>
            <PresentationChartLineIcon className="text-primary-200 w-7 h-7" />
          </div>
          <div className="mt-4">
            <button
              className="p-px rounded-full bg-gradient-to-r from-[#00FFC2] to-[#A269FF] w-40 hover:cursor-pointer"
              onClick={() => {
                setShowChart(true);
              }}
            >
              <div className="block text-white px-2 py-1.5 font-semibold rounded-full bg-dark-850">
                <span className="bg-gradient-to-r from-[#00FFC2] to-[#A269FF] bg-clip-text text-transparent">
                  {t('checkout_graph')}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <SkeletonWrapper>
        <Skeleton height={'15rem'} />
      </SkeletonWrapper>
    );
  }

  if (chartData.length <= 0) {
    return (
      <div className="relative w-full h-full">
        <ResponsiveContainer>
          <LineChart data={chartDummyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tickFormatter={(value) => {
                return value.split(' ')[0];
              }}
            />
            <YAxis dataKey="value" />
            <Line type="basis" dataKey="value" stroke="#00ffc2" dot={false} animationDuration={0} />
          </LineChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 bg-dark-800/70 flex items-center justify-center">
          <p className="text-sm font-normal">
            데이터가 부족하여 확인할 수 없습니다.
            <br />
            영상에 대한 충분한 데이터가 쌓인 후 확인 가능합니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tickFormatter={(value) => {
            return value.split(' ')[0];
          }}
        />
        <YAxis dataKey="value" />
        <Tooltip content={CustomTooltip} />
        <Line type="basis" dataKey="value" stroke="#00ffc2" dot={false} animationDuration={3000} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GrowthLineChart;

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-850">
        <p className="label">{`${label} : ${comma(Math.floor(Number(payload[0].value)))}`}</p>
      </div>
    );
  }

  return null;
};
