import React, { FC } from 'react';
import { PulseLoader, SyncLoader } from 'react-spinners';

const getString = (str: string, isDark: boolean, fontSizeClass?: string) => {
  if (str === '매우 높음') {
    return (
      <div
        className={`leading-4 ${fontSizeClass ?? 'text-xs'} font-black ${isDark ? 'text-dark-900' : 'text-[#00FFF0]'}`}
        data-tooltip-id="tooltip"
        data-tooltip-content="Viewtrap이 'Great'이라고 판단한 영상입니다."
      >
        <div>.....</div>
        <div>Great</div>
      </div>
    );
  } else if (str === '높음') {
    return (
      <div
        className={`leading-4 ${fontSizeClass ?? 'text-xs'} font-black ${isDark ? 'text-dark-900' : 'text-[#00DA7C]'}`}
        data-tooltip-id="tooltip"
        data-tooltip-content="Viewtrap이 'Good'이라고 판단한 영상입니다."
      >
        <div>....</div>
        <div>Good</div>
      </div>
    );
  } else if (str === '보통') {
    return (
      <div
        className={`leading-4 ${fontSizeClass ?? 'text-xs'} font-black ${isDark ? 'text-dark-900' : 'text-[#D0D0D0]'}`}
        data-tooltip-id="tooltip"
        data-tooltip-content="Viewtrap이 'Normal'이라고 판단한 영상입니다."
      >
        <div>...</div>
        <div>Normal</div>
      </div>
    );
  } else if (str === '낮음') {
    return (
      <div
        className={`leading-4 ${fontSizeClass ?? 'text-xs'} font-black ${isDark ? 'text-dark-900' : 'text-[#FE595E]'}`}
        data-tooltip-id="tooltip"
        data-tooltip-content="Viewtrap이 'Bad'이라고 판단한 영상입니다."
      >
        <div>..</div>
        <div>Bad</div>
      </div>
    );
  } else if (str === '매우 낮음') {
    return (
      <div
        className={`leading-4 ${fontSizeClass ?? 'text-xs'} font-black ${isDark ? 'text-dark-900' : 'text-[#C14D51]'}`}
        data-tooltip-id="tooltip"
        data-tooltip-content="Viewtrap이 'Worst'이라고 판단한 영상입니다."
      >
        <div>.</div>
        <div>Worst</div>
      </div>
    );
  } else {
    return <div>-</div>;
  }
};

type Props = {
  label: string;
  value: number;
  isLoading: boolean;
  isDark?: boolean;
  fontSizeClass?: string;
};

const VideoActiveRate: FC<Props> = ({ label, value, isLoading, isDark = false, fontSizeClass }) => {
  if (isLoading) {
    return (
      <span>
        <PulseLoader size={8} margin={2} speedMultiplier={0.8} color="#00FFC2" />
      </span>
    );
  }

  if (value === 0 || value === undefined) {
    return <span>-</span>;
  }

  return getString(label, isDark, fontSizeClass);
};

export default VideoActiveRate;
