import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import qs from 'qs';
import { parseJwt } from '../../../utils/jwtUtils';
import useUser from '../../../hooks/useUser';
import PhoneJoin from './PhoneJoin';
import { KEYWORD_MINING_PATH } from '../../../types/menu';

const Join = () => {
  const { search } = useLocation();
  const { data: token } = qs.parse(search);
  const { anonymous } = useUser();

  if (!token || !anonymous) {
    return <Navigate to={KEYWORD_MINING_PATH} />;
  }

  try {
    const { sub: platformId, email } = parseJwt(token);

    return <PhoneJoin email={email} platformId={platformId} />;
  } catch (err) {
    return <Navigate to={KEYWORD_MINING_PATH} />;
  }
};

export default Join;
