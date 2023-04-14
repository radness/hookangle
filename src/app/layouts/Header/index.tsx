import { Link, NavLink } from 'react-router-dom';
import useUser from '../../../hooks/useUser';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import logoImg from 'assets/images/logo.svg';
import {
  CHANNEL_ANALYSIS_PATH,
  CHANNEL_MINING_PATH,
  CLIPPED_VIDEO_PATH,
  KEYWORD_MINING_PATH,
  LECTURES_PATH,
  PRICE_PATH,
} from '../../../types/menu';
import Remaining from './Remaining';
import Notification from './Notification';
import HelpSwitch from './HelpSwitch';
import youtubeIcon from 'assets/images/icon-youtube.svg';
import MyMenu from './MyMenu';
enum Menu {
  MY_PAGE = 'myPage',
  LOGOUT = 'logout',
}

const Header = () => {
  const { t } = useTranslation();
  const { user, isLoading, anonymous } = useUser();

  return (
    <header className="bg-dark-900 border-b border-primary-200 sticky top-0 z-header h-[60px]">
      <div className="min-w-7xl max-w-8xl mx-auto">
        <div className="py-4 px-4 border-b border-slate-900/10">
          <div className="relative flex items-center">
            <Link to="/home" className="text-teal-400 font-bold">
              <img src={logoImg} alt="logo" width={100} height={30} />
            </Link>
            <nav className="text-sm leading-6 font-medium text-dark-300 ml-[56px]">
              <ul className="flex space-x-8 h-[30px]">
                <li className="">
                  <NavLink
                    to={KEYWORD_MINING_PATH}
                    className={({ isActive }) =>
                      'group relative block h-full hover:text-primary-200' + (isActive ? ' text-primary-200' : '')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {t('video_search_title')}
                        <div
                          className={`absolute bottom-0 bg-primary-200 h-px pointer-events-none group-hover:left-0 group-hover:right-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ${
                            isActive ? 'visible opacity-100 left-0 right-0' : 'left-3/4 right-3/4 opacity-0 invisible'
                          }`}
                        ></div>
                      </>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={CHANNEL_MINING_PATH}
                    className={({ isActive }) =>
                      'group relative block h-full hover:text-primary-200' + (isActive ? ' text-primary-200' : '')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {t('channel_search_title')}
                        <div
                          className={`absolute bottom-0 bg-primary-200 h-px pointer-events-none group-hover:left-0 group-hover:right-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ${
                            isActive ? 'visible opacity-100 left-0 right-0' : 'left-3/4 right-3/4 opacity-0 invisible'
                          }`}
                        ></div>
                      </>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={CHANNEL_ANALYSIS_PATH}
                    className={({ isActive }) =>
                      'group relative block h-full hover:text-primary-200' + (isActive ? ' text-primary-200' : '')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {t('channel_analysis_title')}
                        <div
                          className={`absolute bottom-0 bg-primary-200 h-px pointer-events-none group-hover:left-0 group-hover:right-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ${
                            isActive ? 'visible opacity-100 left-0 right-0' : 'left-3/4 right-3/4 opacity-0 invisible'
                          }`}
                        ></div>
                      </>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={CLIPPED_VIDEO_PATH}
                    className={({ isActive }) =>
                      'group relative block h-full hover:text-primary-200' + (isActive ? ' text-primary-200' : '')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {t('video_storage_title')}
                        <div
                          className={`absolute bottom-0 bg-primary-200 h-px pointer-events-none group-hover:left-0 group-hover:right-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ${
                            isActive ? 'visible opacity-100 left-0 right-0' : 'left-3/4 right-3/4 opacity-0 invisible'
                          }`}
                        ></div>
                      </>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={PRICE_PATH}
                    className={({ isActive }) =>
                      'group relative block h-full hover:text-primary-200' +
                      (isActive ? ' text-primary-200' : ' text-white')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {t('price_title')}
                        <div
                          className={`absolute bottom-0 bg-primary-200 h-px pointer-events-none group-hover:left-0 group-hover:right-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ${
                            isActive ? 'visible opacity-100 left-0 right-0' : 'left-3/4 right-3/4 opacity-0 invisible'
                          }`}
                        ></div>
                      </>
                    )}
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="relative flex items-center ml-auto">
              <div className="flex items-center text-sm border-slate-200 ml-6 pl-6">
                {!isLoading &&
                  (anonymous ? (
                    <>
                      <Link to="/auth/login" className="ml-4">
                        {t('signin')}
                      </Link>
                      <Link to="/auth/login" className="ml-4">
                        {t('signup')}
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-2">
                        <Remaining />
                      </div>
                      {/*<div className="w-px h-[12px] border-l border-l-white"></div>*/}
                      <div className="px-2">
                        <HelpSwitch />
                      </div>
                      <div className="w-px h-[12px] border-l border-l-white"></div>
                      <div className="px-2">
                        <Link to={LECTURES_PATH} className="flex items-center">
                          <span className="text-xs">회원전용 무료 강의</span>
                          <img src={youtubeIcon} alt="youtube icon" className="ml-2" />
                        </Link>
                      </div>
                      <div className="px-2">
                        <Notification />
                      </div>
                      <div className="pl-2">
                        <MyMenu />
                      </div>
                    </>
                    // <button className="ml-4">
                    //   <div className="ring-amber-400 bg-amber-400 rounded-full w-6 h-6 text-sm">G</div>
                    // </button>
                  ))}
              </div>
            </div>
            {/*<SearchInput />*/}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
