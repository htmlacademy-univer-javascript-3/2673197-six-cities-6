import { describe, it, expect } from 'vitest';
import { StatusCodes } from 'http-status-codes';

import { ServerErrorType } from '../../enums/server-error-type.ts';
import { errorSlice, resetError } from './error-slice.ts';
import { getFavoriteOffers, getOffer, getOffers, login, sendComment, setFavoriteStatus } from '../api-actions.ts';
import type { ServerError } from '../../types/server-error.ts';
import { FavoriteAction } from '../../enums/favorite-action.ts';

describe('Error slice', () => {
  const error: ServerError = {
    status: StatusCodes.NOT_FOUND,
    errorType: ServerErrorType.CommonError,
    message: 'resource not found'
  };

  const fallbackError = new Error('Test error');

  it('should return null by default', () => {
    const result = errorSlice.reducer(undefined, { type: '' });
    expect(result).toBeNull();
  });

  it('should reset error', () => {
    const result = errorSlice.reducer(error, resetError());
    expect(result).toBeNull();
  });

  it('should set error on getOffer.rejected', () => {
    const result = errorSlice.reducer(
      null,
      getOffer.rejected(fallbackError, 'requestId', '1', error)
    );
    expect(result).toEqual(error);
  });

  it('should set error on getOffers.rejected', () => {
    const result = errorSlice.reducer(
      null,
      getOffers.rejected(fallbackError, 'requestId', undefined, error)
    );
    expect(result).toEqual(error);
  });

  it('should set error on sendComment.rejected', () => {
    const args = { comment: { comment: '', rating: 5 }, offerId: '1' };
    const result = errorSlice.reducer(
      null,
      sendComment.rejected(fallbackError, 'requestId', args, error)
    );
    expect(result).toEqual(error);
  });

  it('should set error on login.rejected', () => {
    const args = { email: '', password: '' };
    const result = errorSlice.reducer(
      null,
      login.rejected(fallbackError, 'requestId', args, error)
    );
    expect(result).toEqual(error);
  });

  it('should set error on getFavoriteOffers.rejected', () => {
    const result = errorSlice.reducer(
      null,
      getFavoriteOffers.rejected(fallbackError, 'requestId', undefined, error)
    );
    expect(result).toEqual(error);
  });

  it('should set error on setFavoriteStatus.rejected', () => {
    const args = { offerId: '1', status: FavoriteAction.Add };
    const result = errorSlice.reducer(
      null,
      setFavoriteStatus.rejected(fallbackError, 'requestId', args, error)
    );
    expect(result).toEqual(error);
  });
});
