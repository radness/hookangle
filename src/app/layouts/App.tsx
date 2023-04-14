import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Alert from '../components/Modal/Alert';
import { ToastContainer } from 'react-toastify';
import Confirm from '../components/Modal/Confirm';
import useErrorHandler from '../../hooks/useErrorHandler';

const App = () => {
  useErrorHandler();
  return (
    <>
      <Outlet />
      <ToastContainer theme="dark" />
      <Alert />
      <Confirm />
      <ScrollRestoration />
    </>
  );
};

export default App;
