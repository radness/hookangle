import React, { FC, useMemo } from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from './index';
import { CountryData } from './CountryChart';

export interface GenderData {
  name: string;
  female?: number;
  male?: number;
}

type Props = {
  data: GenderData[];
  noData: boolean;
};
const dummyData: GenderData[] = [
  { name: '남성', male: 50 },
  { name: '여성', female: 50 },
];

const GenderChart: FC<Props> = ({ data, noData }) => {
  const graphData = noData ? dummyData : data;

  const renderLegendText = (value: string, entry: any) => {
    const { color } = entry;

    return <span style={{ color }}>{value === 'male' ? '남성' : '여성'}</span>;
  };

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} layout="vertical" barSize={20} data={graphData}>
          <XAxis type="number" />
          <YAxis interval={0} type="category" dataKey="name" />
          <Bar key={`bar-1`} fill="#9DBDD5" dataKey={'male'} stackId="stack" barSize={40} />
          <Bar key={`bar-2`} fill="#FB9487" dataKey={'female'} stackId="stack" barSize={40} />
          <Legend formatter={renderLegendText} />
        </BarChart>
      </ResponsiveContainer>
      {noData && (
        <div className="absolute inset-0 bg-dark-800/70 flex items-center justify-center">
          <div className="text-white text-sm font-normal">데이터 수집중</div>
        </div>
      )}
    </div>
  );
};

export default GenderChart;
