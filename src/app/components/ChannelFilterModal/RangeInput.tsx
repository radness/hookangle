import React, { FC, useCallback, useEffect, useState } from 'react';
import { comma } from 'utils/stringUtils';
import { Bound } from '../../../types/filter';

type Props = {
  value: Bound;
  onChange: (bound: Bound) => void;
  min?: number;
  max?: number;
};

const RangeInput: FC<Props> = ({ value, onChange, min = 0, max = 1000000 }) => {
  const [leftInputValue, setLeftInputValue] = useState('');
  const [rightInputValue, setRightInputValue] = useState('');

  useEffect(() => {
    const isMax = value[1] >= max;
    setLeftInputValue(comma(value[0]));
    setRightInputValue(comma(Math.min(value[1], max)) + (isMax ? '+' : ''));
  }, [value]);

  const onLeftInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,|[^0-9]/gi, '');
    setLeftInputValue(comma(Number(value)));
  }, []);

  const onLeftInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,|[^0-9]/gi, '');
      const rightValue = +rightInputValue.replace(/,|[^0-9]/gi, '');

      let numberLeftValue = Number(value);
      let numberRightValue = Number(rightValue);

      if (numberLeftValue > numberRightValue) {
        numberLeftValue = rightValue;
      }

      if (numberLeftValue > max) numberLeftValue = max;

      onChange([numberLeftValue, numberRightValue]);
    },
    [rightInputValue, onChange],
  );

  const onRightInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,|[^0-9]/gi, '');
    setRightInputValue(comma(Number(value)));
  }, []);

  const onRightInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,|[^0-9]/gi, '');
      const leftValue = leftInputValue.replace(/,|[^0-9]/gi, '');

      let numberLeftValue = Number(leftValue);
      let numberRightValue = Number(value);

      if (numberRightValue < numberLeftValue) {
        numberRightValue = numberLeftValue;
      }

      if (numberRightValue >= max) {
        numberRightValue = max;
      }
      onChange([numberLeftValue, numberRightValue]);
    },
    [leftInputValue, onChange],
  );

  return (
    <div className="flex justify-between items-center mt-8">
      <div className="flex-1">
        <input
          type="text"
          className="form-input border border-dark-600 rounded-md bg-dark-850 text-center text-xs w-full"
          onChange={onLeftInputChange}
          onBlur={onLeftInputBlur}
          value={leftInputValue}
        />
      </div>
      <span className="ml-6 mr-6 text-dark-600">-</span>
      <div className="flex-1">
        <input
          type="text"
          className="form-input border border-dark-600 rounded-md bg-dark-850 text-center text-xs w-full"
          onChange={onRightInputChange}
          onBlur={onRightInputBlur}
          value={rightInputValue}
        />
      </div>
    </div>
  );
};

export default RangeInput;
