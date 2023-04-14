import React from 'react';

type PropsType = {
  children: React.ReactNode;
  className?: string;
  onClick?(): void;
};

const BasicButton = ({ children, className, onClick }: PropsType) => {
  return (
    <button className={`btn text-xs ${className ?? ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default BasicButton;
