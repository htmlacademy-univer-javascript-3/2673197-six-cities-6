import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { datatype } from 'faker';

import { OfferPage } from './offer-page.tsx';
import { withStore } from '../../utils/component-mocks.tsx';
import { makeStore, makeOfferFullInfo, makeOfferPreviewInfo, makeComment } from '../../utils/mocks.ts';
import { AppRoute } from '../../enums/app-route.ts';
import { ServerErrorType } from '../../enums/server-error-type.ts';
import type { ServerError } from '../../types/server-error.ts';

vi.mock('../../components/map/map.tsx', () => ({
  Map: () => <div data-testid="map">Map Component</div>
}));

describe('Component: OfferPage', () => {
  it('should render loading screen when offer is loading', () => {
    const { withStoreComponent } = withStore(
      <MemoryRouter initialEntries={['/offer/1']}>
        <Routes>
          <Route path={AppRoute.Offer} element={<OfferPage />} />
        </Routes>
      </MemoryRouter>,
      makeStore({ offers: { ...makeStore().offers, isOfferLoading: true } })
    );

    render(withStoreComponent);

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('should render error page when common error occurs', () => {
    const error: ServerError = {
      status: StatusCodes.NOT_FOUND,
      message: 'Not Found',
      errorType: ServerErrorType.CommonError
    };
    const { withStoreComponent } = withStore(
      <MemoryRouter initialEntries={['/offer/1']}>
        <Routes>
          <Route path={AppRoute.Offer} element={<OfferPage />} />
        </Routes>
      </MemoryRouter>,
      makeStore({ error })
    );

    render(withStoreComponent);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render offer content and strictly 3 nearby offers when loaded', () => {
    const offer = makeOfferFullInfo();
    const nearbyOffers = Array.from(
      { length: datatype.number({ min: 5, max: 10 }) },
      () => makeOfferPreviewInfo()
    );
    const comments = [makeComment()];
    const MAX_NEAR_OFFERS_COUNT = 3;

    const { withStoreComponent } = withStore(
      <MemoryRouter initialEntries={[`/offer/${offer.id}`]}>
        <Routes>
          <Route path={AppRoute.Offer} element={<OfferPage />} />
        </Routes>
      </MemoryRouter>,
      makeStore({
        offers: {
          ...makeStore().offers,
          isOfferLoading: false,
          offer,
          nearbyOffers,
          comments
        }
      })
    );

    render(withStoreComponent);

    expect(screen.getByText(offer.title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${offer.price}`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/Meet the host/i)).toBeInTheDocument();
    expect(screen.getByText(/Other places in the neighbourhood/i)).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();

    const displayedNearbyOffers = screen.getAllByRole('article');
    expect(displayedNearbyOffers.length).toBe(MAX_NEAR_OFFERS_COUNT);
  });
});
