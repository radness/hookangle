import React, { FC } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from './index';
export interface CountryData {
  name: string;
  value?: number;
}

type Props = {
  data: CountryData[];
  noData: boolean;
};
const dummyData: CountryData[] = [
  { name: '대한민국', value: 30 },
  { name: '베트남', value: 30 },
  { name: '미국', value: 30 },
];
const CountryChart: FC<Props> = ({ data, noData }) => {
  const graphData = noData ? dummyData : data;

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={200} height={200}>
          <Pie
            data={graphData}
            cx="50%"
            cy="50%"
            labelLine={false}
            // label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {graphData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                style={{ outline: 'none', border: 'none', stroke: 'rgb(99 99 99)' }}
              />
            ))}
          </Pie>
          <Legend align="right" verticalAlign="top" layout={'vertical'} />
        </PieChart>
      </ResponsiveContainer>
      {noData && (
        <div className="absolute inset-0 bg-dark-800/70 flex items-center justify-center">
          <div className="text-white text-sm font-normal">데이터 수집중</div>
        </div>
      )}
    </div>
  );
};

export default CountryChart;
