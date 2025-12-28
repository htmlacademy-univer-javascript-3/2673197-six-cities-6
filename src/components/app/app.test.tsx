import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import { generatePath, MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { StatusCodes } from 'http-status-codes';
import type { Action } from 'redux';
import type { ReactNode } from 'react';

import { App } from './app.tsx';
import { AuthStatus } from '../../enums/auth-status.ts';
import { AppRoute } from '../../enums/app-route.ts';
import { SortingType } from '../../enums/sorting-type.ts';
import { makeCity, makeComment, makeOfferFullInfo, makeOfferPreviewInfo } from '../../utils/mocks.ts';
import { ServerErrorType } from '../../enums/server-error-type.ts';
import { CITIES } from '../../const.ts';
import type { State } from '../../types/state.ts';

function withMemoryHistory(component: ReactNode, initialEntries: string[] = [AppRoute.Main]): ReactNode {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
}

function makeState(initial?: Partial<State>): State {
  return {
    user: {
      authStatus: AuthStatus.Unknown,
      info: null
    },
    offers: {
      isOfferLoading: false,
      favoriteOffers: [],
      offersInCity: [],
      offer: null,
      nearbyOffers: [],
      comments: [],
      allOffers: [],
      currentSortingType: SortingType.Popular,
      isOffersLoading: false
    },
    cities: {
      city: CITIES[0],
      cities: CITIES
    },
    error: null,
    ...initial
  };
}

describe('Application routing', () => {
  const middleware = [thunk];
  const mockStoreCreator = configureMockStore<State, Action>(middleware);

  it('should render "Loading Screen" when isOffersLoading is true', () => {
    const defaultState = makeState();
    const store = mockStoreCreator({
      ...defaultState,
      offers: {
        ...defaultState.offers,
        isOffersLoading: true
      }
    });

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />)}
      </Provider>
    );

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('should render "Main Page" with empty list when no offers loaded', () => {
    const store = mockStoreCreator(makeState());

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />)}
      </Provider>
    );

    expect(screen.getByText(/no places to stay available/i)).toBeInTheDocument();
  });

  it('should render "Main Page" with offers when offers are loaded', () => {
    const city = makeCity();
    const offer = makeOfferPreviewInfo({ city });
    const defaultState = makeState();
    const store = mockStoreCreator({
      ...defaultState,
      cities: {
        city: city,
        cities: [city]
      },
      offers: {
        ...defaultState.offers,
        offersInCity: [offer],
        allOffers: [offer]
      }
    });

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />)}
      </Provider>
    );

    expect(screen.getAllByText(new RegExp(`${city.name}`, 'i')).length).toBeGreaterThan(0);
  });

  it('should render "Login Page" when user navigate to "/login"', () => {
    const store = mockStoreCreator(
      makeState({ user: { authStatus: AuthStatus.Unauthorized, info: null } })
    );

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />, [AppRoute.Login])}
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should render "Favorites Page" when user navigate to "/favorites" and is authorized', () => {
    const defaultState = makeState();
    const store = mockStoreCreator({
      ...defaultState,
      user: {
        authStatus: AuthStatus.Authorized,
        info: { name: 'user', avatarUrl: '', isPro: false, email: 'user@test.ru', token: '' }
      },
      offers: {
        ...defaultState.offers,
        favoriteOffers: [makeOfferPreviewInfo()]
      }
    });

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />, [AppRoute.Favorites])}
      </Provider>
    );

    expect(screen.getByText(/saved listing/i)).toBeInTheDocument();
  });

  it('should redirect to "Login Page" from "/favorites" if not logged in', () => {
    const store = mockStoreCreator(
      makeState({ user: { authStatus: AuthStatus.Unauthorized, info: null } })
    );

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />, [AppRoute.Favorites])}
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render "Offer Page" when user navigate to "/offer/:id"', () => {
    const offer = makeOfferFullInfo();

    const defaultState = makeState();
    const store = mockStoreCreator({
      ...defaultState,
      offers: {
        ...defaultState.offers,
        offer: offer,
        nearbyOffers: [makeOfferPreviewInfo()],
        comments: [makeComment()]
      }
    });

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />, [`/offer/${offer.id}`])}
      </Provider>
    );

    expect(screen.getByText(offer.title)).toBeInTheDocument();
    expect(screen.getByText(/meet the host/i)).toBeInTheDocument();
    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
  });

  it('should render "Error Page" when navigating to non-existent route', () => {
    const store = mockStoreCreator(makeState());

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />, ['/unknown'])}
      </Provider>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('should render "Error Page" when global error exists in state', () => {
    const defaultState = makeState();
    const errorMessage = 'Something went wrong';
    const offer = makeOfferFullInfo();
    const store = mockStoreCreator({
      ...defaultState,
      error: {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: errorMessage,
        errorType: ServerErrorType.CommonError
      },
      offers: {
        ...defaultState.offers,
        offer: offer
      }
    });

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />, [generatePath(AppRoute.Offer, { id: offer.id })])}
      </Provider>
    );

    expect(screen.getByText(StatusCodes.INTERNAL_SERVER_ERROR)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render "Error Page" with 500 status when getOffers fails with 500', () => {
    const defaultState = makeState();
    const store = mockStoreCreator({
      ...defaultState,
      error: {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        errorType: ServerErrorType.CommonError
      },
      offers: {
        ...defaultState.offers,
        isOffersLoading: false
      }
    });

    render(
      <Provider store={store}>
        {withMemoryHistory(<App />)}
      </Provider>
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
  });
});
