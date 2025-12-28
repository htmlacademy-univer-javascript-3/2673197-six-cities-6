import { Route, Routes } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { StatusCodes } from 'http-status-codes';

import { AppRoute } from '../../enums/app-route.ts';
import { FavoritesPage } from '../../pages/favorites-page/favorites-page.tsx';
import { LoginPage } from '../../pages/login-page/login-page.tsx';
import { MainPage } from '../../pages/main-page/main-page.tsx';
import { ErrorPage } from '../../pages/error-page/error-page.tsx';
import { OfferPage } from '../../pages/offer-page/offer-page.tsx';
import { PrivateRoute } from '../private-route/private-route.tsx';
import { useAppDispatch } from '../../hooks/use-app-dispatch.ts';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { LoadingScreen } from '../loading-screen/loading-screen.tsx';
import { getFavoriteOffers, getOffers } from '../../store/api-actions.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import { ServerErrorType } from '../../enums/server-error-type.ts';
import { getAuthStatus } from '../../store/user/user-selectors.ts';
import { isOffersLoading as getIsOffersLoading } from '../../store/offers/offers-selectors.ts';
import { getError } from '../../store/error/error-selectors.ts';

export function App(): ReactNode {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(getAuthStatus);
  const error = useAppSelector(getError);
  const isOffersLoading = useAppSelector(getIsOffersLoading);

  useEffect(() => {
    dispatch(getOffers());
  }, [dispatch]);

  useEffect(() => {
    if (authStatus === AuthStatus.Authorized) {
      dispatch(getFavoriteOffers());
    }
  }, [authStatus, dispatch]);

  if (error && error.errorType === ServerErrorType.CommonError) {
    return <ErrorPage />;
  }

  if (isOffersLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path={AppRoute.Main} element={<MainPage />} />
      <Route path={AppRoute.Login} element={<LoginPage />} />
      <Route path={AppRoute.Offer} element={<OfferPage />} />
      <Route
        path={AppRoute.Favorites}
        element={
          <PrivateRoute>
            <FavoritesPage />
          </PrivateRoute>
        }
      />
      <Route
        path={AppRoute.Unknown}
        element={<ErrorPage statusCode={StatusCodes.NOT_FOUND} message={'Not Found'} />}
      />
    </Routes>
  );
}
