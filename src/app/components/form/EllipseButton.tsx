import React from 'react';
import BasicButton from './BasicButton';

type PropsType = {
  children: React.ReactNode;
  onClick?(): void;
};

const EllipseButton = ({ children, onClick }: PropsType) => {
  return (
    <button
      className="p-px rounded-full bg-gradient-to-r from-[#00FFC2] to-[#A269FF] w-40 hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="block text-white px-2 py-1.5 font-semibold rounded-full bg-dark-800">
        <span className="bg-gradient-to-r from-[#00FFC2] to-[#A269FF] bg-clip-text text-transparent">{children}</span>
      </div>
    </button>
  );
};

export default EllipseButton;
