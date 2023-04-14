import React, { FC, useCallback, useMemo, useRef } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, TooltipProps } from 'recharts';
import { DateBound, DateRange } from '../../../../types/filter';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { findIndex, findLastIndex } from 'lodash';

type Props = {
  minDate: string;
  maxDate: string;
  value: DateBound;
  onChange: (dateBound: DateBound) => void;
  dateRange: DateRange;
};

const RangeDate: FC<Props> = ({ minDate, maxDate, value, onChange, dateRange }) => {
  const chartData = useMemo(() => {
    const startDateMonth = `${value[0].split('-')[0]}.${value[0].split('-')[1]}`;
    const endDateMonth = `${value[1].split('-')[0]}.${value[1].split('-')[1]}`;

    const startIndex = findIndex(dateRange.keys, (dateStr) => startDateMonth <= dateStr);
    const endIndex = findLastIndex(dateRange.keys, (dateStr) => endDateMonth >= dateStr);

    return dateRange.keys
      .map((date, i) => ({
        name: date,
        value: dateRange.values[i],
      }))
      .slice(startIndex, endIndex + 1);
  }, [dateRange, value]);

  const handleChangeStartDate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange([e.target.value, value[1]]);
    },
    [value[1], onChange],
  );

  const handleChangeEndDate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange([value[0], e.target.value]);
    },
    [value[0], onChange],
  );

  return (
    <div>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" style={{ fontSize: '0.75em' }} />
            <YAxis dataKey="value" />
            <Tooltip content={CustomTooltip} />
            <Line type="monotone" dataKey="value" stroke="#00FFC2" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex-1">
          <input
            type="date"
            className="form-input border border-dark-600 rounded-md bg-dark-850 text-center text-xs w-full"
            onChange={handleChangeStartDate}
            value={value[0]}
            min={minDate}
            max={maxDate}
          />
        </div>
        <span className="ml-6 mr-6 text-dark-600">-</span>
        <div className="flex-1">
          <input
            type="date"
            className="form-input border border-dark-600 rounded-md bg-dark-850 text-center text-xs w-full"
            onChange={handleChangeEndDate}
            value={value[1]}
            min={minDate}
            max={maxDate}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(RangeDate);

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-850">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
