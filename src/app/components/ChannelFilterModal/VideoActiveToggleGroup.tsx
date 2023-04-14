import React, { FC, useCallback } from 'react';
import { FilterToggle } from '../../../types/filter';
import VideoActiveRate from '../Table/Cell/VideoActiveRate';

enum TOGGLE {
  LOWER,
  LOW,
  NORMAL,
  HIGH,
  HIGHER,
}

type Props = {
  toggles: FilterToggle;
  toggleCounts: [number, number, number, number, number];
  onChange: (toggles: FilterToggle) => void;
};

const VideoActiveToggleGroup: FC<Props> = ({ toggles, toggleCounts, onChange }) => {
  const onClickToggle = useCallback(
    (toggle: TOGGLE) => {
      if (toggle === TOGGLE.LOWER) {
        onChange([!toggles[0], toggles[1], toggles[2], toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.LOW) {
        onChange([toggles[0], !toggles[1], toggles[2], toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.NORMAL) {
        onChange([toggles[0], toggles[1], !toggles[2], toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.HIGH) {
        onChange([toggles[0], toggles[1], toggles[2], !toggles[3], toggles[4]]);
      } else if (toggle === TOGGLE.HIGHER) {
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
            onClickToggle(TOGGLE.LOWER);
          }}
          active={toggles[0]}
          label="매우 낮음"
          labelClassName="text-[#FE595E]/70"
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[1]}
          onClick={() => {
            onClickToggle(TOGGLE.LOW);
          }}
          active={toggles[1]}
          label="낮음"
          labelClassName="text-[#FE595E]"
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[2]}
          onClick={() => {
            onClickToggle(TOGGLE.NORMAL);
          }}
          active={toggles[2]}
          label="보통"
          labelClassName="text-dark-300"
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[3]}
          onClick={() => {
            onClickToggle(TOGGLE.HIGH);
          }}
          active={toggles[3]}
          label="높음"
          labelClassName="text-primary-100"
        />
      </li>
      <li>
        <ToggleButton
          count={toggleCounts[4]}
          onClick={() => {
            onClickToggle(TOGGLE.HIGHER);
          }}
          active={toggles[4]}
          label="매우 높음"
          labelClassName="text-primary-200"
        />
      </li>
    </ul>
  );
};
export default VideoActiveToggleGroup;

type ToggleProps = {
  active: boolean;
  label: string;
  labelClassName: string;
  count: number;
  onClick?: () => void;
};

const ToggleButton: FC<ToggleProps> = ({ active, label, count, onClick, labelClassName }) => {
  return (
    <button
      type="button"
      className={'border border-dark-600 rounded-md text-center w-full h-full pb-2' + (active ? ' bg-primary-200' : '')}
      onClick={onClick}
    >
      <VideoActiveRate label={label} value={1} isLoading={false} isDark={active} />
      <div className={`text-xs ${active ? 'text-black' : 'text-dark-300'}`}>({count})</div>
    </button>
  );
};
