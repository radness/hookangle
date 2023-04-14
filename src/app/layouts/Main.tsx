import React, { FC, PropsWithChildren } from 'react';

const Main: FC<PropsWithChildren> = ({ children }) => {
  return <main className="min-w-7xl max-w-8xl mx-auto px-4">{children}</main>;
};

export default Main;
