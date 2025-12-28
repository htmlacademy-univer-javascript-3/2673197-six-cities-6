import { createSlice } from '@reduxjs/toolkit';

import { ActionNamespace } from '../../enums/action-namespace.ts';
import { getFavoriteOffers, getOffer, getOffers, login, sendComment, setFavoriteStatus } from '../api-actions.ts';
import type { ServerError } from '../../types/server-error.ts';

type ErrorState = ServerError | null;

const initialState: ErrorState = null;

export const errorSlice = createSlice<ErrorState, { resetError: () => void }, ActionNamespace.Error>({
  name: ActionNamespace.Error,
  initialState,
  reducers: {
    resetError() {
      return null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getOffer.rejected, (_state, action) => action.payload ?? null)
      .addCase(getOffers.rejected, (_state, action) => action.payload ?? null)
      .addCase(sendComment.rejected, (_state, action) => action.payload ?? null)
      .addCase(login.rejected, (_state, action) => action.payload ?? null)
      .addCase(getFavoriteOffers.rejected, (_state, action) => action.payload ?? null)
      .addCase(setFavoriteStatus.rejected, (_state, action) => action.payload ?? null);
  }
});

export const { resetError } = errorSlice.actions;
