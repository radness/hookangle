import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const errorHandler = (err: any) => {
  if (err instanceof AxiosError) {
    toast.error(err.response?.data?.data?.message);
  } else {
    throw err;
  }
};
export default errorHandler;
