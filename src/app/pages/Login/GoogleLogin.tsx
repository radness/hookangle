import React from 'react';
import GoogleLoginButton from '../../components/form/GoogleLoginButton';
import logoImage from 'assets/images/login-logo.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GoogleLogin = () => {
  const { t } = useTranslation();
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center justify-center w-[560px] h-[685px] border border-dark-600 rounded-md">
        <div className="flex flex-col items-center">
          <div>
            <Link to="/home">
              <img src={logoImage} alt="logo" width={176} height={55} />
            </Link>
          </div>
          <div className="mt-[100px]">
            <div className="border border-dark-600 rounded-md p-1">
              <GoogleLoginButton />
            </div>
          </div>
          {/*<div className="text-center mt-8">*/}
          {/*  <p className="text-xs font-normal leading-6">*/}
          {/*    By signing up, I agree to viewtrap’s{' '}*/}
          {/*    <Link to="/terms" className="underline">*/}
          {/*      Terms of Service*/}
          {/*    </Link>{' '}*/}
          {/*    and{' '}*/}
          {/*    <Link to="/privacy" className="underline">*/}
          {/*      Privacy Policy*/}
          {/*    </Link>{' '}*/}
          {/*    <br />*/}
          {/*    For copyright information, see{' '}*/}
          {/*    <a*/}
          {/*      className="underline"*/}
          {/*      href="https://www.youtube.com/howyoutubeworks/policies/copyright/"*/}
          {/*      target="_blank"*/}
          {/*    >*/}
          {/*      YouTube's Copyright and Fair Use Policy.*/}
          {/*    </a>*/}
          {/*  </p>*/}
          {/*</div>*/}

          <hr className="h-px mt-28 bg-dark-600 border-0 w-full" />

          <div className="mt-8">
            <ul className="flex text-sm text-dark-300 gap-6">
              <li>
                <Link to="/privacy">{t('privacy_policy')}</Link>
              </li>
              <li>
                <Link to="/terms">{t('terms_of_use')}</Link>
              </li>
              <li>
                <a href="mailto:help@viewtrap.com">{t('email_support')}</a>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="text-sm text-white mt-4">© 2023 view trend research. All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;
