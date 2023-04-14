import api from './api';

const fetcher = (url: string) => {
  return api.get(url).then((res) => res.data?.data);
};

export default fetcher;
