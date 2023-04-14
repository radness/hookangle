import React, { FC, useCallback, useEffect, useState } from 'react';
import RangeChart from '../RangeChart';
import { debounce } from 'lodash';
import RangeInput from '../RangeInput';
import { Bound } from '../../../../types/filter';

type Props = {
  min: number;
  max: number;
  heights?: number[];
  value: Bound;
  onChange: (bound: Bound) => void;
};
export type Bar = {
  active: boolean;
  height: number;
};

const RangeFilter: FC<Props> = ({ min, max, value: bound, onChange, heights }) => {
  const [value, setValue] = useState<Bound>([0, 0]);

  useEffect(() => {
    setValue(bound);
  }, [bound]);

  const debounceChange = useCallback(
    debounce((bound: Bound) => {
      onChange(bound);
    }, 200),
    [onChange],
  );

  const handleChange = useCallback(
    (bound: Bound) => {
      setValue(bound);
      debounceChange(bound);
    },
    [debounceChange],
  );

  return (
    <div className="filter-wrapper-content">
      <RangeChart value={value} onChange={handleChange} heights={heights} min={min} max={max} />
      <RangeInput value={value} onChange={handleChange} min={min} max={max} />
    </div>
  );
};

RangeFilter.defaultProps = {
  min: 0,
  max: 0,
};

export default React.memo(RangeFilter);
