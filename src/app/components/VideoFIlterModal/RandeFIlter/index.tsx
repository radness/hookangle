import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { BarWrapper, Bar, RangeControl, Slider, Track, Range, ThumbLeft, ThumbRight } from './styles';
import { Bound } from '../../../../types/filter';

type Props = {
  value: Bound;
  onChange: (bound: Bound) => void;
  min?: number;
  max?: number;
  heights?: number[];
  height?: number;
};

export type Bar = {
  active: boolean;
  height: number;
};

const RangeChart: FC<Props> = ({
  value,
  onChange,
  min = 0,
  max = 1000000,
  heights = Array(50).fill(50),
  height = 60,
}) => {
  const [leftRange, setLeftRange] = useState(0);
  const [rightRange, setRightRange] = useState(0);

  useEffect(() => {
    setLeftRange(value[0]);
    setRightRange(Math.min(value[1], max));
  }, [value]);

  const bars = useMemo<Bar[]>(() => {
    const maxLeftBarLength = leftRange / (max / 50);
    const maxRightBarLength = rightRange / (max / 50);
    const heightRatio = height / Math.max(...heights);
    return heights.map((h, i) => ({
      active: i >= maxLeftBarLength && i <= maxRightBarLength,
      height: Math.min(h * heightRatio, height),
    }));
  }, [leftRange, rightRange, heights, height]);

  const leftPercent = useMemo(() => {
    return ((leftRange - min) / (max - min)) * 100;
  }, [leftRange]);

  const rightPercent = useMemo(() => {
    return ((rightRange - min) / (max - min)) * 100;
  }, [rightRange]);

  const onInputLeftRange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLeftRange(Number(e.target.value));
      onChange([Number(e.target.value), rightRange]);
    },
    [rightRange, onChange],
  );

  const onInputRightRange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRightRange(Number(e.target.value));
      onChange([leftRange, Number(e.target.value)]);
    },
    [leftRange, onChange],
  );

  return (
    <div>
      <BarWrapper>
        {bars.map((b: Bar, i: number) => (
          <Bar key={i} className={b.active ? 'bg-dark-300' : 'bg-dark-800'} style={{ height: `${b.height}px` }}></Bar>
        ))}
      </BarWrapper>
      <RangeControl>
        <div>
          <input type="range" className="input-left" onInput={onInputLeftRange} min={min} max={max} value={leftRange} />
          <input
            type="range"
            className="input-right"
            onInput={onInputRightRange}
            min={min}
            max={max}
            value={rightRange}
          />
          <Slider className="slider">
            <Track></Track>
            <Range style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}>
              <ThumbLeft className="thumb left">
                <span></span>
                <span></span>
                <span></span>
              </ThumbLeft>
              <ThumbRight className="thumb right">
                <span></span>
                <span></span>
                <span></span>
              </ThumbRight>
            </Range>
          </Slider>
        </div>
      </RangeControl>
    </div>
  );
};

export default RangeChart;
