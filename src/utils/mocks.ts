import { address, commerce, company, datatype, image, internet, lorem, random } from 'faker';

import { HotelType } from '../enums/hotel-type.ts';
import { Good } from '../enums/good.ts';
import { AuthStatus } from '../enums/auth-status.ts';
import { SortingType } from '../enums/sorting-type.ts';
import { CITIES } from '../const.ts';
import type { UserInfo } from '../types/user-info.ts';
import type { Location } from '../types/location.ts';
import type { City } from '../types/city.ts';
import type { Comment } from '../types/comment.ts';
import type { OfferPreviewInfo } from '../types/offer-preview-info.ts';
import type { OfferFullInfo } from '../types/offer-full-info.ts';
import type { State } from '../types/state.ts';
import type { OffersState } from '../store/offers/offers-slice.ts';

export const makeComment = (initial?: Partial<Comment>): Comment => ({
  id: datatype.uuid(),
  user: {
    avatarUrl: image.avatar(),
    name: internet.userName(),
    isPro: datatype.boolean()
  },
  date: datatype.datetime().toISOString(),
  comment: lorem.sentence(51),
  rating: datatype.number({min: 1, max: 5}),
  ...initial
});

export const makeLocation = (initial?: Partial<Location>): Location => ({
  latitude: +address.latitude(),
  longitude: +address.longitude(),
  zoom: datatype.number({ min: 1, max: 15 }),
  ...initial
});

export const makeCity = (initial?: Partial<City>): City => ({
  name: address.cityName(),
  location: makeLocation(),
  ...initial
});

export const makeOfferPreviewInfo = (initial?: Partial<OfferPreviewInfo>): OfferPreviewInfo => ({
  city: makeCity(),
  id: datatype.uuid(),
  previewImage: `${image.imageUrl()}?${datatype.uuid()}`,
  isFavorite: datatype.boolean(),
  isPremium: datatype.boolean(),
  location: makeLocation(),
  price: +commerce.price(),
  rating: datatype.number({min: 1, max: 5}),
  title: `${company.companyName()}'s hotel`,
  type: random.arrayElement(Object.values(HotelType)),
  ...initial
});

export const makeOfferFullInfo = (initial?: Partial<OfferFullInfo>): OfferFullInfo => {
  const previewInfo = makeOfferPreviewInfo();
  const rest = { ...previewInfo };
  delete (rest as Partial<OfferPreviewInfo>).previewImage;
  return ({
    bedrooms: datatype.number({min: 1, max: 3}),
    description: commerce.productDescription(),
    goods: random.arrayElements(Object.values(Good)),
    host: {
      name: internet.userName(),
      avatarUrl: image.avatar(),
      isPro: datatype.boolean()
    },
    images: Array.from({length: 6}, () => `${image.imageUrl()}?${datatype.uuid()}`),
    maxAdults: datatype.number({min: 1, max: 10}),
    ...rest,
    ...initial
  });
};

export const makeOfferPreviewInfos = () => Array.from({ length: datatype.number({ min: 3, max: 6 }) }, () =>
  makeOfferPreviewInfo());

export const makeOffersState = (initial?: Partial<OffersState>): OffersState => ({
  allOffers: Array.from({ length: 5 }, () => makeOfferPreviewInfo()),
  comments: Array.from({ length: 5 }, () => makeComment()),
  currentSortingType: SortingType.Popular,
  favoriteOffers: makeOfferPreviewInfos().map((o) => {
    o.isFavorite = true;
    return o;
  }),
  isOfferLoading: false,
  isOffersLoading: false,
  nearbyOffers: makeOfferPreviewInfos(),
  offer: makeOfferFullInfo(),
  offersInCity: makeOfferPreviewInfos(),
  ...initial
});

const makeToken = () =>
  `${random.alphaNumeric(10)}.${random.alphaNumeric(10)}.${random.alphaNumeric(10)}`;

export const makeUserInfo = (): UserInfo => ({
  avatarUrl: internet.avatar(),
  email: internet.email(),
  isPro: datatype.boolean(),
  name: internet.userName(),
  token: makeToken()
});

export const makeStore = (initial?: Partial<State>): State => ({
  user: {
    authStatus: AuthStatus.Unknown,
    info: null
  },
  cities: {
    city: CITIES[0],
    cities: CITIES
  },
  offers: makeOffersState(),
  error: null,
  ...initial
});
