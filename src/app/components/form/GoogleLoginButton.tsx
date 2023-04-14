import React, { useRef, useState } from 'react';
import useScript from 'hooks/useScript';
import api from '../../../utils/api';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import useConfirm from '../../../hooks/useConfirm';
import errorHandler from '../../../utils/api/errorHandler';

declare global {
  const google: typeof import('google-one-tap');
}

const GoogleLoginButton = ({ onGoogleSignIn = () => {}, text = 'signin_with' }) => {
  const { open: confirm } = useConfirm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const googleSignInButton = useRef<HTMLDivElement>(null);

  const join = async (email: string, platformId: string) => {
    try {
      await api.post('/users', {
        phone: '-',
        email,
        nickname: '-',
        platformId,
        marketing_agree: 'Y',
        education_agree: 'Y',
      });

      window.location.href = '/';
    } catch (err) {
      errorHandler(err);
    }
  };

  const handleCredentialResponse = (response: any) => {
    const id_token = response.credential;
    const loginUser = async () => {
      try {
        setLoading(true);

        const { data } = await api.post('/auth/login', { id_token });
        localStorage.setItem('id_token', id_token as string);

        window.location.href = '/';
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data?.data?.code === 'C0000') {
            //회원가입 안되어있음 해야함
            navigate('/auth/join?type=1&data=' + id_token);
            // const { sub: platformId, email } = parseJwt(id_token);
            // console.log(platformId, email);
            // confirm('확인을 누르시면 회원가입이 됩니다.', () => {
            //   join(platformId, email);
            // });
          }
        } else {
          toast.error('시스템 오류입니다. 관리자에게 문의바랍니다.');
        }
        setLoading(false);
      }
    };
    loginUser();
  };

  useScript('https://accounts.google.com/gsi/client', () => {
    google.accounts.id.initialize({
      client_id: '78334059859-hmnv0ca07rketnru2ljsd23rk61kddi6.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      googleSignInButton.current as HTMLElement,
      { theme: 'filled_black', size: 'large', shape: 'square', width: 368 }, // customization attributes
    );

    // window.google.accounts.id.prompt(); // also display the One Tap dialog
  });

  return (
    <>
      <div ref={googleSignInButton} style={{ display: loading ? 'none' : 'block' }}></div>
      {loading && (
        <div className="flex items-center justify-center w-[370px]">
          <ClipLoader />
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
