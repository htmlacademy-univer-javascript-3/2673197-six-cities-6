import type { RatingScore } from './types/rating-score.ts';
import type { City } from './types/city.ts';

export const AUTH_TOKEN_KEY_NAME = 'six-cities-token';

export const AUTH_HEADER_NAME = 'X-Token';

type RatingWithDescription = {
  rating: RatingScore;
  description: string;
}

export const RATINGS: RatingWithDescription[] = [
  { rating: 5, description: 'perfect' },
  { rating: 4, description: 'good' },
  { rating: 3, description: 'not bad' },
  { rating: 2, description: 'badly' },
  { rating: 1, description: 'terribly' },
];

export const CITIES: City[] = [
  {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13
    }
  },
  {
    name: 'Cologne',
    location: {
      latitude: 50.938361,
      longitude: 6.959974,
      zoom: 13
    }
  },
  {
    name: 'Brussels',
    location: {
      latitude: 50.846557,
      longitude: 4.351697,
      zoom: 13
    }
  },
  {
    name: 'Amsterdam',
    location: {
      latitude: 52.37454,
      longitude: 4.897976,
      zoom: 13
    }
  },
  {
    name: 'Hamburg',
    location: {
      latitude: 53.550341,
      longitude: 10.000654,
      zoom: 13
    }
  },
  {
    name: 'Dusseldorf',
    location: {
      latitude: 51.225402,
      longitude: 6.776314,
      zoom: 13
    }
  }
];
