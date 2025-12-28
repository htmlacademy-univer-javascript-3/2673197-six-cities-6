import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { AuthStatus } from '../../enums/auth-status.ts';
import { AppRoute } from '../../enums/app-route.ts';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { getAuthStatus } from '../../store/user/user-selectors.ts';

type PrivateRouteProps = {
  children: ReactNode;
}

export function PrivateRoute({children}: PrivateRouteProps): ReactNode {
  const authStatus = useAppSelector(getAuthStatus);
  return (
    authStatus === AuthStatus.Authorized
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}
