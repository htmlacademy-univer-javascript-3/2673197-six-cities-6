import { describe, it, expect } from 'vitest';

import { citiesSlice, switchCity } from './cities-slice.ts';
import { makeCity } from '../../utils/mocks.ts';
import { CITIES } from '../../const.ts';

describe('Cities slice', () => {
  const initialState = {
    city: CITIES[0],
    cities: CITIES
  };

  it('should have initial state with fixed cities', () => {
    const result = citiesSlice.reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should switch city', () => {
    const expectedCity = makeCity();

    const result = citiesSlice.reducer(initialState, switchCity(expectedCity));

    expect(result.city).toEqual(expectedCity);
  });
});
