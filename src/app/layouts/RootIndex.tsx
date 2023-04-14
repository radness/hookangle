import React from 'react';
import useUser from '../../hooks/useUser';
import { Navigate } from 'react-router-dom';
import { HOME_PATH, KEYWORD_MINING_PATH, LOGIN_PATH } from '../../types/menu';

const RootIndex = () => {
  const { anonymous } = useUser();

  if (anonymous) {
    return <Navigate to={HOME_PATH} />;
  }

  return <Navigate to={KEYWORD_MINING_PATH} />;
};

export default RootIndex;
