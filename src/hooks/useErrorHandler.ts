import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../utils/api';

const useErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const commonAxiosHandler = api.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response.status === 500 || error.code === 'ERR_NETWORK') {
          navigate('/errors/500', {
            state: {
              url: error.response.config.url,
              method: error.response.config.method?.toUpperCase(),
              message: `${error.response.data?.data?.code} : ${error.response.data?.data?.message}`,
            },
          });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(commonAxiosHandler);
    };
  }, []);
};
export default useErrorHandler;
