import React from 'react';

type PropsType = {
  children: React.ReactNode;
  title: string;
  isRow?: boolean;
  className?: string;
};

const InfoPanel = ({ children, title, isRow, className }: PropsType) => {
  return (
    <div
      className={`border border-dark-800 bg-dark-800 rounded-md p-5 ${isRow ? 'flex flex-row items-center' : ''} ${
        className ?? ''
      }`}
    >
      <div className={`text-dark-300 text-sm font-medium ${isRow ? 'border-r border-dark-600 flex-1' : ''}`}>
        {title}
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
