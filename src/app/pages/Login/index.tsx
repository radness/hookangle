import React from 'react';
import GoogleLogin from './GoogleLogin';
import { KEYWORD_MINING_PATH } from '../../../types/menu';
import useUser from '../../../hooks/useUser';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { anonymous } = useUser();

  if (!anonymous) {
    return <Navigate to={KEYWORD_MINING_PATH} />;
  }

  return <GoogleLogin />;
};

export default Login;
