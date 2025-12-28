import { datatype } from 'faker';
import { describe, it, expect } from 'vitest';

import {
  makeComment,
  makeOfferFullInfo,
  makeOfferPreviewInfo,
  makeOffersState,
  makeOfferPreviewInfos
} from '../../utils/mocks.ts';
import { SortingType } from '../../enums/sorting-type.ts';
import { getFavoriteOffers, getOffer, getOffers, logout, sendComment, setFavoriteStatus } from '../api-actions.ts';
import { offersSlice, switchSortingType, } from './offers-slice.ts';
import { FavoriteAction } from '../../enums/favorite-action.ts';
import { switchCity } from '../cities/cities-slice.ts';
import { CITIES } from '../../const.ts';

describe('Offers slice', () => {
  it('should set isOffersLoading to true on getOffers.pending', () => {
    const initialState = makeOffersState({ isOffersLoading: false });
    const result = offersSlice.reducer(initialState, getOffers.pending('', undefined));
    expect(result.isOffersLoading).toBe(true);
  });

  it('should set isOffersLoading to false on getOffers.rejected', () => {
    const initialState = makeOffersState({ isOffersLoading: true });
    const result = offersSlice.reducer(initialState, getOffers.rejected(null, '', undefined));
    expect(result.isOffersLoading).toBe(false);
  });

  it('should load offers on getOffers.fulfilled', () => {
    const initialState = makeOffersState({ allOffers: [], offersInCity: [], isOffersLoading: true });
    const city = CITIES[0];
    const offersToLoad = makeOfferPreviewInfos()
      .map((o) => {
        o.city = city;
        return o;
      });

    const result = offersSlice.reducer(
      initialState,
      getOffers.fulfilled(offersToLoad, 'requestId', undefined)
    );

    expect(result.allOffers.length).toBe(offersToLoad.length);
    expect(result.offersInCity.length).toBe(offersToLoad.length);
    expect(result.isOffersLoading).toBe(false);
  });

  it('should set isOfferLoading to true on getOffer.pending', () => {
    const initialState = makeOffersState({ isOfferLoading: false });
    const result = offersSlice.reducer(initialState, getOffer.pending('', '1'));
    expect(result.isOfferLoading).toBe(true);
  });

  it('should set isOfferLoading to false on getOffer.rejected', () => {
    const initialState = makeOffersState({ isOfferLoading: true });
    const result = offersSlice.reducer(initialState, getOffer.rejected(null, '', '1'));
    expect(result.isOfferLoading).toBe(false);
  });

  it('should load offer on getOffer.fulfilled', () => {
    const initialState = makeOffersState({ offer: null, nearbyOffers: [], comments: [], isOfferLoading: true });
    const offerToLoad = {
      offer: makeOfferFullInfo(),
      comments: Array.from({ length: 5 }, () => makeComment()),
      nearbyOffers: makeOfferPreviewInfos(),
    };

    const result = offersSlice.reducer(
      initialState,
      getOffer.fulfilled(offerToLoad, 'requestId', offerToLoad.offer.id)
    );

    expect(result.offer).toEqual(offerToLoad.offer);
    expect(result.comments).toEqual(offerToLoad.comments);
    expect(result.nearbyOffers).toEqual(offerToLoad.nearbyOffers);
    expect(result.isOfferLoading).toBe(false);
  });

  it('should reset favorite states on logout.fulfilled', () => {
    const offer = makeOfferFullInfo({ isFavorite: true });
    const initialState = makeOffersState({
      favoriteOffers: [makeOfferPreviewInfo({ isFavorite: true })],
      allOffers: [makeOfferPreviewInfo({ isFavorite: true })],
      offersInCity: [makeOfferPreviewInfo({ isFavorite: true })],
      offer: offer
    });

    const result = offersSlice.reducer(
      initialState,
      logout.fulfilled(undefined, 'requestId', undefined)
    );

    expect(result.favoriteOffers).toEqual([]);
    expect(result.allOffers.every((o) => !o.isFavorite)).toBe(true);
    expect(result.offersInCity.every((o) => !o.isFavorite)).toBe(true);
    expect(result.offer?.isFavorite).toBe(false);
  });

  it('should add comment on sendComment.fulfilled', () => {
    const initialState = makeOffersState({ comments: [] });
    const commentToAdd = makeComment();

    const result = offersSlice.reducer(
      initialState,
      sendComment.fulfilled(
        commentToAdd,
        'requestId',
        { comment: { comment: commentToAdd.comment, rating: commentToAdd.rating }, offerId: datatype.uuid() }
      )
    );

    expect(result.comments).toContainEqual(commentToAdd);
  });

  it('should add favorite on setFavoriteStatus.fulfilled', () => {
    const offerToFavorite = makeOfferPreviewInfo({ isFavorite: false });
    const initialState = makeOffersState({
      favoriteOffers: [],
      allOffers: [offerToFavorite],
    });
    const updatedOffer = { ...offerToFavorite, isFavorite: true };

    const result = offersSlice.reducer(
      initialState,
      setFavoriteStatus.fulfilled(
        updatedOffer,
        'requestId',
        { offerId: updatedOffer.id, status: FavoriteAction.Add }
      )
    );

    expect(result.favoriteOffers).toContainEqual(updatedOffer);
    expect(result.allOffers.find((o) => o.id === updatedOffer.id)?.isFavorite).toBe(true);
  });

  it('should load favorites on getFavoriteOffers.fulfilled', () => {
    const favorites = [makeOfferPreviewInfo({ isFavorite: true })];
    const initialState = makeOffersState({ favoriteOffers: [] });

    const result = offersSlice.reducer(
      initialState,
      getFavoriteOffers.fulfilled(favorites, 'requestId', undefined)
    );

    expect(result.favoriteOffers).toEqual(favorites);
  });

  it('should switch sorting type and sort offers', () => {
    const offers = [
      makeOfferPreviewInfo({ price: 100 }),
      makeOfferPreviewInfo({ price: 50 }),
    ];
    const initialState = makeOffersState({
      offersInCity: offers,
      currentSortingType: SortingType.Popular
    });

    const result = offersSlice.reducer(initialState, switchSortingType(SortingType.PriceLowToHigh));

    expect(result.currentSortingType).toBe(SortingType.PriceLowToHigh);
    expect(result.offersInCity[0].price).toBe(50);
  });

  it('should update offersInCity when city is switched', () => {
    const paris = CITIES[0];
    const amsterdam = CITIES[3];
    const offerParis = makeOfferPreviewInfo({ city: paris });
    const offerAmsterdam = makeOfferPreviewInfo({ city: amsterdam });

    const initialState = makeOffersState({
      allOffers: [offerParis, offerAmsterdam],
      offersInCity: []
    });

    const result = offersSlice.reducer(initialState, switchCity(amsterdam));

    expect(result.offersInCity).toHaveLength(1);
    expect(result.offersInCity[0].id).toBe(offerAmsterdam.id);
  });
});
