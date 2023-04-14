import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';

import Root from './app/layouts/Root';
import KeywordMining, { keywordLoader } from './app/pages/KeywordMining';
import Login from './app/pages/Login';
import './config/lang/i18n';
import Join from './app/pages/Join';
import App from './app/layouts/App';
import ChannelMining from './app/pages/ChannelMining';
import ClippedVideo from './app/pages/ClippedVideo';
import ChannelAnalysis from './app/pages/ChannelAnalysis';
import Membership from './app/pages/Membership';
import {
  CHANNEL_ANALYSIS_PATH,
  CHANNEL_MINING_PATH,
  CLIPPED_VIDEO_PATH,
  KEYWORD_MINING_PATH,
  PRICE_PATH,
  MEMBERSHIP_RESULT_PATH,
  MY_PAGE_PATH,
  PRIVACY_PATH,
  TERMS_PATH,
  FAQ_PATH,
  LECTURES_PATH,
  HOME_PATH,
} from './types/menu';
import TestPage from './app/pages/TestPage';
import MembershipResult from './app/pages/MembershipResult';
import Privacy from './app/pages/privacy';
import Terms from './app/pages/terms';
import FAQ from './app/pages/FAQ';
import ErrorPage from './app/pages/ErrorPage';
import WithAuth from './hoc/withAuth';
import Lectures from './app/pages/Lectures';
import Home from './app/pages/Home';
import RootIndex from './app/layouts/RootIndex';
import MyInfo from './app/pages/MyInfo';

const KeywordMiningPage = WithAuth(KeywordMining);
const ChannelMiningPage = WithAuth(ChannelMining);
const ClippedVideoPage = WithAuth(ClippedVideo);
const ChannelAnalysisPage = WithAuth(ChannelAnalysis);
const MembershipPage = WithAuth(Membership);
const MyInfoPage = WithAuth(MyInfo);
const LecturePage = WithAuth(Lectures);

const router = createBrowserRouter([
  { path: HOME_PATH, element: <Home /> },
  { path: '/errors/500', element: <ErrorPage /> },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'join',
            element: <Join />,
          },
        ],
      },
      {
        path: '/',
        element: <Root />,
        children: [
          { index: true, element: <RootIndex /> },
          {
            path: KEYWORD_MINING_PATH,
            element: <KeywordMiningPage />,
            loader: keywordLoader,
          },
          {
            path: CHANNEL_MINING_PATH,
            element: <ChannelMiningPage />,
            // loader: channelLoader,
          },
          {
            path: CHANNEL_ANALYSIS_PATH,
            element: <ChannelAnalysisPage />,
          },
          {
            path: CLIPPED_VIDEO_PATH,
            element: <ClippedVideoPage />,
          },
          {
            path: PRICE_PATH,
            element: <MembershipPage />,
          },
          {
            path: MEMBERSHIP_RESULT_PATH,
            element: <MembershipResult />,
          },
          {
            path: MY_PAGE_PATH,
            element: <MyInfoPage />,
          },
          {
            path: PRIVACY_PATH,
            element: <Privacy />,
          },
          {
            path: TERMS_PATH,
            element: <Terms />,
          },
          {
            path: FAQ_PATH,
            element: <FAQ />,
          },
          {
            path: LECTURES_PATH,
            element: <LecturePage />,
          },

          {
            path: 'test',
            element: <TestPage />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <SWRConfig
    value={{
      dedupingInterval: 5000,
      revalidateOnFocus: false,
    }}
  >
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </SWRConfig>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
