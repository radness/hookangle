import errorImage from 'assets/images/error/error.png';
import { isRouteErrorResponse, Link, useLocation, useRouteError } from 'react-router-dom';
import { useEffect } from 'react';
import useTitle from '../../../hooks/useTitle';
import api from '../../../utils/api';

const ERROR404 = () => {
  const error: any = useRouteError();
  const location = useLocation();

  useTitle('Error');
  useEffect(() => {
    let message = '';
    let method = 'GET';
    let url = location.pathname;
    let logTp = '';

    const sendError = async () => {
      if (process.env.NODE_ENV === 'production') {
        await api.post('/commons/front-end/logs', {
          logTp,
          url,
          method,
          message,
        });
      }
    };

    if (url !== '/errors/404') {
      if (isRouteErrorResponse(error)) {
        // page not found
        logTp = 'NF';
        message = error.statusText;
        sendError();
      } else {
        logTp = 'FE';
        message = error + '' + '\n' + error?.stack + '\n';
        sendError();
      }
    }
  }, []);

  return (
    <div className="h-screen text-center">
      <div className="inline-block mt-[160px]">
        <h2 className="text-[36px] font-black text-error">Oops!</h2>
        {/*font-size:60px;*/}
        {/*font-weight:800;*/}
        {/*color:#FF6060;*/}
        {/*margin-top:120px;*/}

        <div className="mt-[30px] text-base font-normal text-dark-300">
          {isRouteErrorResponse(error)
            ? 'Sorry, we could not find the page.'
            : 'Please try again later or feel free to contact us if the problem persists.'}
        </div>
        {/*<Text>{error.statusText || error.message}</Text>*/}

        <img src={errorImage} alt="404 error" className="inline-block mt-[40px]" />
        {/*<ErrorImage src={errorImage} alt="404 에러" title="error" />*/}
        <div className="mt-[40px]">
          <a href="/">
            <button className="text-sm font-medium text-primary-200 border border-primary-200 rounded-full px-[60px] py-4">
              메인으로 가기
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ERROR404;
