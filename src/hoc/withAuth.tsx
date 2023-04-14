import React, { ComponentType } from 'react';
import useUser from '../hooks/useUser';
import { Navigate } from 'react-router-dom';

function WithAuth<P extends object>(Component: ComponentType<P>): React.FC<P> {
  return function WihLoadingComponent(props) {
    const { anonymous, isLoading } = useUser();

    if (isLoading) {
      return null;
    }

    if (anonymous) {
      return <Navigate to="/auth/login" />;
    }

    // if (loading) return <Placeholder>Loading...</Placeholder>;
    // if (error) return <Placeholder>Error</Placeholder>;
    return <Component {...(props as P)} />;
  };
}

export default WithAuth;
