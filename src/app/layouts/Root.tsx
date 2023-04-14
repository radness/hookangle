import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import 'react-toastify/dist/ReactToastify.css';
import useUser from '../../hooks/useUser';
import { ClipLoader } from 'react-spinners';
import { ChannelProcessor, KeywordProcessor } from '../components/HistoryProcessor';
import TopPatentNotice from '../components/TopPatentNotice';
import Tooltips from '../components/Tooltips';

const Root = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div>
        <ClipLoader />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <TopPatentNotice />
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <KeywordProcessor />
      <ChannelProcessor />
      <Tooltips />
    </div>
  );
};

export default Root;
