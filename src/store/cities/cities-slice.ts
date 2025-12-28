import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ActionNamespace } from '../../enums/action-namespace.ts';
import { CITIES } from '../../const.ts';
import type { City } from '../../types/city.ts';

type CitiesState = {
  city: City;
  cities: City[];
};

const initialState: CitiesState = {
  city: CITIES[0],
  cities: CITIES
};

export const citiesSlice = createSlice({
  name: ActionNamespace.Cities,
  initialState,
  reducers: {
    switchCity(state, action: PayloadAction<City>) {
      state.city = action.payload;
    }
  }
});

export const { switchCity } = citiesSlice.actions;
