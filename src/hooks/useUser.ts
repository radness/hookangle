import useSWR, { KeyedMutator } from 'swr';
import { IUser } from '../types/user';
import api from '../utils/api';
import errorHandler from '../utils/api/errorHandler';

export const userFetcher = () => {
  return api
    .get('/auth/users', {
      // query URL without using browser cache
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    .then((res) => res.data?.data)
    .catch((err) => {
      errorHandler(err);
      // api.post('/auth/logout').then(() => {
      //   window.location.href = '/';
      // });
    });
};
type ReturnType = {
  user: IUser;
  mutate: KeyedMutator<any>;
  anonymous: boolean;
  isLoading: boolean;
  error: boolean;
  useLimit: {
    ca_channel_count: number;
    ca_channel_use_count: number;
    ca_use_count: number;
    km_use_count: number;
    cm_use_count: number;
    wt_use_count: number;
    algorithm_use_count: number;
  };
};
const useUser = (): ReturnType => {
  const { data, error, isLoading, mutate } = useSWR(`users`, userFetcher, { dedupingInterval: 5000 });

  const userTp = Number(data?.user?.user_tp || 0);

  const useLimit = {
    ca_channel_count: data?.membershipLimit?.ca_channel_count[userTp],
    ca_channel_use_count: data?.membershipLimit?.ca_channel_use_count[userTp],
    ca_use_count: data?.membershipLimit?.ca_use_count[userTp],
    km_use_count: data?.membershipLimit?.km_use_count[userTp],
    cm_use_count: data?.membershipLimit?.cm_use_count[userTp],
    wt_use_count: data?.membershipLimit?.wt_use_count[userTp],
    algorithm_use_count: data?.membershipLimit?.algorithm_use_count[userTp],
  };

  return {
    user: data?.user,
    mutate: mutate,
    anonymous: data?.user?.uid === '000000',
    isLoading,
    error: error,
    useLimit,
  };
};

export default useUser;
