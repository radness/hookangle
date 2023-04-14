import axios, { Axios, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

export const axiosFactory = () => {
  return axios.create({
    headers: {
      'Content-type': 'application/json',
      'x-access-token':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwMDAwMDAiLCJ1c2VyX3RwIjoiMTAiLCJuaWNrbmFtZSI6InRlc3QxMjMiLCJpYXQiOjE3NjMyOTMxMzUsImV4cCI6MTc2MzI5MzQzNSwiaXNzIjoidmlld3RyYXAuY29tIiwic3ViIjoidXNlckluZm8ifQ.b-sbQ1u9t7tUwUiBdHQ1pqCe7-GTdsdEB5B4sAePpT8',
    },
    baseURL: process.env.REACT_APP_API_HOST + '/api/v2',
    withCredentials: true,
    timeout: 600000,
  });
};

const axiosInstance = axiosFactory();

axiosInstance.interceptors.response.use(undefined, (err) => {
  // const navigate = useNavigate();
  const statusCode = err?.response?.status;

  if (statusCode == '412') {
    //로그아웃
    window.location.href = '/';
    localStorage.removeItem('id_token');
  }
  return Promise.reject(err);
});

axiosRetry(axiosInstance, {
  retries: 2,
  retryDelay: () => 100,
  shouldResetTimeout: true,
  retryCondition: (err) => {
    return err.code === AxiosError.ERR_NETWORK && err.config?.method === 'get'; //서버 오류 elb 502랑 cors 뜰 경우
  },
});

export default axiosInstance;
