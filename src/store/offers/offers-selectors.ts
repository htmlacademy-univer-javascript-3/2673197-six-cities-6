import { ActionNamespace } from '../../enums/action-namespace.ts';
import { SortingType } from '../../enums/sorting-type.ts';
import type { State } from '../../types/state.ts';
import type { OfferPreviewInfo } from '../../types/offer-preview-info.ts';
import type { OfferFullInfo } from '../../types/offer-full-info.ts';
import type { Comment } from '../../types/comment.ts';

export const getOffers = (state: State): OfferPreviewInfo[] => state[ActionNamespace.Offers].allOffers;
export const getOffersInCity = (state: State): OfferPreviewInfo[] => state[ActionNamespace.Offers].offersInCity;
export const getOffer = (state: State): OfferFullInfo | null => state[ActionNamespace.Offers].offer;
export const getNearbyOffers = (state: State): OfferPreviewInfo[] => state[ActionNamespace.Offers].nearbyOffers;
export const getFavoriteOffers = (state: State): OfferPreviewInfo[] => state[ActionNamespace.Offers].favoriteOffers;
export const getComments = (state: State): Comment[] => state[ActionNamespace.Offers].comments;
export const getCurrentSortingType = (state: State): SortingType => state[ActionNamespace.Offers].currentSortingType;
export const isOffersLoading = (state: State): boolean => state[ActionNamespace.Offers].isOffersLoading;
export const isOfferLoading = (state: State): boolean => state[ActionNamespace.Offers].isOfferLoading;
