import { ActionNamespace } from '../../enums/action-namespace.ts';
import type { State } from '../../types/state.ts';
import type { City } from '../../types/city.ts';

export const getCity = (state: State): City => state[ActionNamespace.Cities].city;
export const getCities = (state: State): City[] => state[ActionNamespace.Cities].cities;
