import React, { useContext, ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { AuthContext } from '../context/auth';

interface AuthRouteProps extends RouteProps {
  component: ComponentType<any>;
}

function AuthRoute({ component: Component, ...rest }: AuthRouteProps) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;
