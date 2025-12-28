import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { CitiesList } from '../../components/cities-list/cities-list.tsx';
import { Map } from '../../components/map/map.tsx';
import { OffersList } from '../../components/offers-list/offers-list.tsx';
import { useAppDispatch } from '../../hooks/use-app-dispatch.ts';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { SortingTypeMenu } from '../../components/sorting-type-menu/sorting-type-menu.tsx';
import { Header } from '../../components/header/header.tsx';
import { switchCity } from '../../store/cities/cities-slice.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import { AppRoute } from '../../enums/app-route.ts';
import { setFavoriteStatus } from '../../store/api-actions.ts';
import { FavoriteAction } from '../../enums/favorite-action.ts';
import { getOffersInCity } from '../../store/offers/offers-selectors.ts';
import { getCities, getCity } from '../../store/cities/cities-selectors.ts';
import { getAuthStatus } from '../../store/user/user-selectors.ts';
import type { Point } from '../../types/point.ts';
import type { OfferPreviewInfo } from '../../types/offer-preview-info.ts';
import type { City } from '../../types/city.ts';

function mapOfferPreviewInfoToPoint(offer: OfferPreviewInfo): Point {
  return ({
    latitude: offer.location.latitude,
    longitude: offer.location.longitude,
    key: offer.id
  });
}

function NoPlacesAvailable({ city }: { city: string }): ReactNode {
  return (
    <div className="cities">
      <div className="cities__places-container cities__places-container--empty container">
        <section className="cities__no-places">
          <div className="cities__status-wrapper tabs__content">
            <b className="cities__status">No places to stay available</b>
            <p className="cities__status-description">
              We could not find any property available at the moment in {city}
            </p>
          </div>
        </section>
        <div className="cities__right-section" />
      </div>
    </div>
  );
}

export function MainPage(): ReactNode {
  const dispatch = useAppDispatch();

  const currentOffers = useAppSelector(getOffersInCity);
  const currentCity = useAppSelector(getCity);
  const cities = useAppSelector(getCities);
  const authStatus = useAppSelector(getAuthStatus);
  const navigate = useNavigate();

  const [hoveredOfferId, setHoveredOfferId] = useState<string | null>(null);
  const selectedPoint = useMemo<Point | null>(() => {
    if (!hoveredOfferId) {
      return null;
    }
    const hoveredOffer = currentOffers.find((o) => o.id === hoveredOfferId);
    return hoveredOffer ? mapOfferPreviewInfoToPoint(hoveredOffer) : null;
  }, [hoveredOfferId, currentOffers]);

  const mapPoints = useMemo<Point[]>(() => currentOffers.map<Point>(mapOfferPreviewInfoToPoint), [currentOffers]);

  const handleCityClick = useCallback((city: City) => {
    dispatch(switchCity(city));
  }, [dispatch]);

  const handleBookmarkClick = (offerId: string) => {
    if (authStatus !== AuthStatus.Authorized) {
      navigate(AppRoute.Login);
      return;
    }
    const offer = currentOffers.find((o) => o.id === offerId);
    if (!offer) {
      throw new Error('Bookmark button pressed for an offer that does not exist on the page');
    }

    dispatch(setFavoriteStatus({ offerId, status: offer.isFavorite ? FavoriteAction.Remove : FavoriteAction.Add }));
  };

  const handleOfferUnhover = useCallback(() => {
    setHoveredOfferId(null);
  }, []);

  const isEmpty = currentOffers.length === 0;

  return (
    <div className="page page--gray page--main">
      <Header />
      <main className={classNames(
        'page__main',
        'page__main--index',
        { 'page__main--index-empty': isEmpty }
      )}
      >
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList cities={cities} onCityClick={handleCityClick}/>
        </div>
        {isEmpty
          ? <NoPlacesAvailable city={currentCity.name}></NoPlacesAvailable>
          : (
            <div className="cities">
              <div className="cities__places-container container">
                <section className="cities__places places">
                  <h2 className="visually-hidden">Places</h2>
                  <b className="places__found">{currentOffers.length} places to stay in {currentCity.name}</b>
                  <SortingTypeMenu/>
                  <div className="cities__places-list places__list tabs__content">
                    <OffersList
                      offers={currentOffers}
                      onOfferCardHover={setHoveredOfferId}
                      onOfferCardUnhover={handleOfferUnhover}
                      onBookmarkClick={handleBookmarkClick}
                    />
                  </div>
                </section>
                <div className="cities__right-section">
                  <section className="cities__map map" style={{backgroundImage: 'none'}}>
                    <Map
                      city={currentCity}
                      points={mapPoints}
                      selectedPoint={selectedPoint}
                    />
                  </section>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
