import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SortingType } from '../../enums/sorting-type.ts';
import { ActionNamespace } from '../../enums/action-namespace.ts';
import { switchCity } from '../cities/cities-slice.ts';
import { getFavoriteOffers, getOffer, getOffers, logout, sendComment, setFavoriteStatus } from '../api-actions.ts';
import { CITIES } from '../../const.ts';
import type { OfferPreviewInfo } from '../../types/offer-preview-info.ts';
import type { OfferFullInfo } from '../../types/offer-full-info.ts';
import type { Comment } from '../../types/comment.ts';

export type OffersState = {
  offer: OfferFullInfo | null;
  nearbyOffers: OfferPreviewInfo[];
  favoriteOffers: OfferPreviewInfo[];
  comments: Comment[];
  offersInCity: OfferPreviewInfo[];
  allOffers: OfferPreviewInfo[];
  currentSortingType: SortingType;
  isOffersLoading: boolean;
  isOfferLoading: boolean;
};

const initialState: OffersState = {
  offer: null,
  comments: [],
  nearbyOffers: [],
  favoriteOffers: [],
  offersInCity: [],
  allOffers: [],
  currentSortingType: SortingType.Popular,
  isOffersLoading: true,
  isOfferLoading: true
};

function sortOffers(offersToSort: OfferPreviewInfo[], sortingType: SortingType): OfferPreviewInfo[] {
  switch (sortingType) {
    case SortingType.PriceLowToHigh:
      return [...offersToSort].sort((a, b) => a.price - b.price);
    case SortingType.PriceHighToLow:
      return [...offersToSort].sort((a, b) => b.price - a.price);
    case SortingType.TopRatedFirst:
      return [...offersToSort].sort((a, b) => b.rating - a.rating);
    case SortingType.Popular:
      return [...offersToSort];
    default:
      return offersToSort;
  }
}

function updateOfferInList(list: OfferPreviewInfo[], updatedOffer: OfferPreviewInfo): OfferPreviewInfo[] {
  return list.map((item) => item.id === updatedOffer.id ? { ...item, isFavorite: updatedOffer.isFavorite } : item);
}

function setFavoriteToFalse(offers: OfferPreviewInfo[]) {
  offers.forEach((o) => {
    o.isFavorite = false;
  });
}

export const offersSlice = createSlice({
  name: ActionNamespace.Offers,
  initialState,
  reducers: {
    switchSortingType(state, action: PayloadAction<SortingType>) {
      state.currentSortingType = action.payload;
      state.offersInCity = sortOffers(state.offersInCity, action.payload);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getOffers.pending, (state) => {
        state.isOffersLoading = true;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.allOffers = sortOffers(action.payload, state.currentSortingType);

        const initialCity = CITIES[0];
        if (initialCity) {
          state.offersInCity = sortOffers(
            state.allOffers.filter((o) => o.city.name === initialCity.name),
            state.currentSortingType
          );
        }
        state.isOffersLoading = false;
      })
      .addCase(getOffers.rejected, (state) => {
        state.isOffersLoading = false;
      })
      .addCase(getOffer.pending, (state) => {
        state.isOfferLoading = true;
      })
      .addCase(getOffer.fulfilled, (state, action) => {
        state.offer = action.payload.offer;
        state.comments = action.payload.comments;
        state.nearbyOffers = action.payload.nearbyOffers;
        state.isOfferLoading = false;
      })
      .addCase(getOffer.rejected, (state) => {
        state.isOfferLoading = false;
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(getFavoriteOffers.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
      })
      .addCase(setFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;

        state.allOffers = updateOfferInList(state.allOffers, updatedOffer);
        state.offersInCity = sortOffers(updateOfferInList(state.offersInCity, updatedOffer), state.currentSortingType);
        state.nearbyOffers = updateOfferInList(state.nearbyOffers, updatedOffer);

        if (state.offer && state.offer.id === updatedOffer.id) {
          state.offer.isFavorite = updatedOffer.isFavorite;
        }

        if (updatedOffer.isFavorite) {
          state.favoriteOffers.push(updatedOffer);
        } else {
          state.favoriteOffers = state.favoriteOffers.filter((o) => o.id !== updatedOffer.id);
        }
      })
      .addCase(switchCity, (state, action) => {
        state.offersInCity = sortOffers(
          state.allOffers.filter((o) => o.city.name === action.payload.name),
          state.currentSortingType
        );
      })
      .addCase(logout.fulfilled, (state) => {
        state.favoriteOffers = [];
        setFavoriteToFalse(state.allOffers);
        setFavoriteToFalse(state.offersInCity);
        if (state.offer) {
          state.offer.isFavorite = false;
        }
      });
  }
});

export const { switchSortingType } = offersSlice.actions;
