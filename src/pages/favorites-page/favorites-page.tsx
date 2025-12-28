import { ReactNode } from 'react';
import classNames from 'classnames';

import { FavoritesSection } from '../../components/favorites-section/favorites-section.tsx';
import { useAppDispatch } from '../../hooks/use-app-dispatch.ts';
import { setFavoriteStatus } from '../../store/api-actions.ts';
import { Header } from '../../components/header/header.tsx';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { Footer } from '../../components/footer/footer.tsx';
import { FavoriteAction } from '../../enums/favorite-action.ts';
import { getFavoriteOffers } from '../../store/offers/offers-selectors.ts';
import type { OfferPreviewInfo } from '../../types/offer-preview-info.ts';

function groupOffersByCityName(offers: OfferPreviewInfo[]): Record<string, OfferPreviewInfo[]> {
  return offers.reduce((acc, item) => {
    const cityName = item.city.name;
    (acc[cityName] ||= []).push(item);
    return acc;
  }, {} as Record<string, OfferPreviewInfo[]>);
}

function getFavoritesSections(
  offersByCityName: Record<string, OfferPreviewInfo[]>,
  handleBookmarkClick: (offerId: string) => void
): ReactNode[] {
  const sections: ReactNode[] = [];
  for (const [cityName, cityOffers] of Object.entries(offersByCityName)) {
    sections.push(
      <FavoritesSection
        key={cityName}
        city={cityName}
        offers={cityOffers}
        onBookmarkClick={handleBookmarkClick}
      />
    );
  }
  return sections;
}

export function FavoritesPage(): ReactNode {
  const favoriteOffers = useAppSelector(getFavoriteOffers);
  const dispatch = useAppDispatch();
  const handleBookmarkClick = (offerId: string) => {
    dispatch(setFavoriteStatus({ offerId, status: FavoriteAction.Remove }));
  };
  const offersByCity = groupOffersByCityName(favoriteOffers);
  const sections = getFavoritesSections(offersByCity, handleBookmarkClick);
  const isEmpty = favoriteOffers.length === 0;
  return (
    <div className="page">
      <Header />
      <main
        className={classNames(
          'page__main',
          'page__main--favorites',
          { 'page__main--favorites-empty': isEmpty }
        )}
      >
        <div className="page__favorites-container container">
          {isEmpty ? (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
              </div>
            </section>
          ) : (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {sections}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
