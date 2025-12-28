import { ActionNamespace } from '../../enums/action-namespace.ts';
import type { State } from '../../types/state.ts';
import type { ServerError } from '../../types/server-error.ts';

export const getError = (state: State): ServerError | null => state[ActionNamespace.Error];
