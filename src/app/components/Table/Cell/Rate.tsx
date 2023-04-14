import React, { FC } from 'react';

const getString = (str: string, isDark: boolean, fontSizeClass?: string) => {
  if (str === '매우 좋음') {
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
  } else if (str === '좋음') {
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
  } else if (str === '나쁨') {
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
  } else if (str === '매우 나쁨') {
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
type RateProps = {
  label: string;
  isDark?: boolean;
  fontSizeClass?: string;
};

const Rate: FC<RateProps> = ({ label, isDark = false, fontSizeClass }) => {
  return getString(label, isDark, fontSizeClass);
};

export default Rate;
