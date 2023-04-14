import React from 'react';

type PropsType = {
  children: React.ReactNode;
  title: string;
  isRow?: boolean;
  className?: string;
  tooltip?: string;
  isBeta?: boolean;
};

const InfoPanel = ({ children, title, isRow, className, tooltip, isBeta = false }: PropsType) => {
  const tooltipProps = tooltip
    ? {
        'data-tooltip-id': 'tooltip',
        'data-tooltip-content': tooltip,
      }
    : {};

  return (
    <div
      className={`border border-dark-800 bg-dark-800 rounded-md p-5 ${isRow ? 'flex flex-row items-center' : ''} ${
        className ?? ''
      }`}
    >
      <div className={`text-dark-300 text-sm font-medium ${isRow && 'border-r border-dark-600 flex-1'}`}>
        <span {...tooltipProps}>
          {title} {isBeta && <span className="text-[#FF3D00]">Beta</span>}
        </span>
      </div>
      {isRow ? (
        <div className="text-sm flex-1">
          <div className="ml-5 text-center">{children}</div>
        </div>
      ) : (
        <div className="text-sm mt-2">{children}</div>
      )}
    </div>
  );
};

export default InfoPanel;
