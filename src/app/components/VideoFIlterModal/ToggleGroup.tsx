import React, { FC, useCallback } from 'react';
import { FilterToggle } from '../../../types/filter';
import Rate from '../Table/Cell/Rate';

enum TOGGLE {
  WORST,
  BAD,
  SOSO,
  GOOD,
  BEST,
}

type Props = {
  toggles: FilterToggle;
  toggleCounts: [number, number, number, number, number];
  onChange: (toggles: FilterToggle) => void;
  showCount?: boolean;
};

const ToggleGroup: FC<Props> = ({ toggles, toggleCounts, onChange, showCount = true }) => {
  const onClickToggle = useCallback(
    (toggle: TOGGLE) => {
      if (toggle === TOGGLE.WORST) {
        onChange([!toggles[0], toggles[1], toggles[2], toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.BAD) {
        onChange([toggles[0], !toggles[1], toggles[2], toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.SOSO) {
        onChange([toggles[0], toggles[1], !toggles[2], toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.GOOD) {
        onChange([toggles[0], toggles[1], toggles[2], !toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.BEST) {
        onChange([toggles[0], toggles[1], toggles[2], toggles[3], !toggles[4]]);
      }
    },
    [toggles, onChange],
  );

  return (
    <ul className="grid grid-cols-5 gap-2">
      <li>
        <ToggleButton
          count={toggleCounts[0]}
          onClick={() => {
            onClickToggle(TOGGLE.WORST);
          }}
          active={toggles[0]}
          label="매우 나쁨"
          labelClassName="text-[#FE595E]/70"
          showCount={showCount}
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[1]}
          onClick={() => {
            onClickToggle(TOGGLE.BAD);
          }}
          active={toggles[1]}
          label="나쁨"
          labelClassName="text-[#FE595E]"
          showCount={showCount}
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[2]}
          onClick={() => {
            onClickToggle(TOGGLE.SOSO);
          }}
          active={toggles[2]}
          label="보통"
          labelClassName="text-dark-300"
          showCount={showCount}
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[3]}
          onClick={() => {
            onClickToggle(TOGGLE.GOOD);
          }}
          active={toggles[3]}
          label="좋음"
          labelClassName="text-primary-100"
          showCount={showCount}
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[4]}
          onClick={() => {
            onClickToggle(TOGGLE.BEST);
          }}
          active={toggles[4]}
          label="매우 좋음"
          labelClassName="text-primary-200"
          showCount={showCount}
        />
      </li>
    </ul>
  );
};
export default ToggleGroup;

type ToggleProps = {
  active: boolean;
  label: string;
  labelClassName: string;
  count: number;
  onClick?: () => void;
  showCount?: boolean;
};

const ToggleButton: FC<ToggleProps> = ({ active, label, count, onClick, labelClassName, showCount = true }) => {
  return (
    <button
      type="button"
      className={'border border-dark-600 rounded-md text-center w-full h-full pb-2' + (active ? ' bg-primary-200' : '')}
      onClick={onClick}
    >
      {/*<div className={`${active ? 'text-black' : labelClassName} leading-4 font-bold`}>*/}
      {/*  <div>.....</div>*/}
      {/*  <div>{label}</div>*/}
      {/*</div>*/}
      <Rate label={label} isDark={active} />
      {showCount && <div className={`text-xs ${active ? 'text-black' : 'text-dark-300'}`}>({count})</div>}
    </button>
  );
};
