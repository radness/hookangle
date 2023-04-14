import React, { FC, useMemo } from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export interface AgeData {
  name: string;
  '10'?: number;
  '20'?: number;
  '30'?: number;
  '40'?: number;
  '50'?: number;
  '60'?: number;
}

type Props = {
  data: AgeData[];
  noData: boolean;
};
const dummyData: AgeData[] = [
  { name: '10', '10': 10 },
  { name: '20', '20': 20 },
  { name: '30', '30': 30 },
  { name: '40', '40': 40 },
  { name: '50', '50': 50 },
  { name: '60', '60': 60 },
];

const AgeChart: FC<Props> = ({ data, noData }) => {
  const graphData = noData ? dummyData : data;

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={500} height={300} layout="vertical" barSize={20} data={graphData}>
          <XAxis type="number" />
          <YAxis interval={0} type="category" dataKey="name" />
          <Bar key={`bar-1`} fill="#FB9487" dataKey={'10'} stackId="stack" />
          <Bar key={`bar-2`} fill="#B5D183" dataKey={'20'} stackId="stack" />
          <Bar key={`bar-3`} fill="#9DBDD5" dataKey={'30'} stackId="stack" />
          <Bar key={`bar-4`} fill="#F1B974" dataKey={'40'} stackId="stack" />
          <Bar key={`bar-5`} fill="#C192C1" dataKey={'50'} stackId="stack" />
          <Bar key={`bar-6`} fill="#AEADAB" dataKey={'60'} stackId="stack" />
          {/*<Legend formatter={renderLegendText} />*/}
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

export default AgeChart;
