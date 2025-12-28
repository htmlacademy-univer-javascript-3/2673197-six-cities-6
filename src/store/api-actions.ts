import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, type AxiosInstance } from 'axios';
import { generatePath } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';

import { ActionNamespace } from '../enums/action-namespace.ts';
import { ApiRoute } from '../enums/api-route.ts';
import { FavoriteAction } from '../enums/favorite-action.ts';
import { ServerErrorType } from '../enums/server-error-type.ts';
import { removeToken, saveToken } from '../services/token.ts';
import type { AppDispatch } from '../types/app-dispatch.ts';
import type { State } from '../types/state.ts';
import type { OfferPreviewInfo } from '../types/offer-preview-info.ts';
import type { OfferFullInfo } from '../types/offer-full-info.ts';
import type { Comment } from '../types/comment.ts';
import type { CommentContent } from '../types/comment-content.ts';
import type { UserInfo } from '../types/user-info.ts';
import type { ServerError } from '../types/server-error.ts';

type ThunkApiConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
};

type LoginPayload = {
  email: string;
  password: string;
};

type GetOfferResponse = {
  offer: OfferFullInfo;
  comments: Comment[];
  nearbyOffers: OfferPreviewInfo[];
};

export const getOffers = createAsyncThunk<OfferPreviewInfo[], undefined, ThunkApiConfig & { rejectValue: ServerError }>(
  `${ActionNamespace.Offers}/getOffers`,
  async (_arg, { extra: api, rejectWithValue }) => {
    try {
      const response = await api.get<OfferPreviewInfo[]>(ApiRoute.Offers);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          status: error.response?.status,
          errorType: ServerErrorType.CommonError,
          message: error.message
        });
      }
      throw error;
    }
  }
);

export const getOffer = createAsyncThunk<GetOfferResponse, string, ThunkApiConfig & { rejectValue: ServerError }>(
  `${ActionNamespace.Offers}/getOffer`,
  async (id, { extra: api, rejectWithValue }) => {
    try {
      const [offerResponse, commentsResponse, nearbyResponse] = await Promise.all([
        api.get<OfferFullInfo>(generatePath(ApiRoute.Offer, { id })),
        api.get<Comment[]>(generatePath(ApiRoute.Comments, { id })),
        api.get<OfferPreviewInfo[]>(generatePath(ApiRoute.NearbyOffers, { id }))
      ]);
      return {
        offer: offerResponse.data,
        comments: commentsResponse.data,
        nearbyOffers: nearbyResponse.data
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === StatusCodes.NOT_FOUND) {
        return rejectWithValue(error.response.data as ServerError);
      }
      throw error;
    }
  }
);

export const sendComment = createAsyncThunk<Comment, { comment: CommentContent; offerId: string }, ThunkApiConfig & { rejectValue: ServerError }>(
  `${ActionNamespace.Offers}/sendComment`,
  async ({ comment, offerId }, { extra: api, rejectWithValue }) => {
    try {
      const response = await api.post<Comment>(
        generatePath(ApiRoute.Comments, { id: offerId }),
        comment
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data as ServerError);
      }
      throw error;
    }
  }
);

export const getFavoriteOffers = createAsyncThunk<OfferPreviewInfo[], undefined, ThunkApiConfig & { rejectValue: ServerError }>(
  `${ActionNamespace.Offers}/getFavoriteOffers`,
  async (_arg, { extra: api, rejectWithValue }) => {
    try {
      const response = await api.get<OfferPreviewInfo[]>(ApiRoute.Favorite);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data as ServerError);
      }
      throw error;
    }
  }
);

export const setFavoriteStatus = createAsyncThunk<OfferPreviewInfo, { offerId: string; status: FavoriteAction }, ThunkApiConfig & { rejectValue: ServerError }>(
  `${ActionNamespace.Offers}/setFavoriteStatus`,
  async ({ offerId, status }, { extra: api, rejectWithValue }) => {
    try {
      const response = await api.post<OfferPreviewInfo>(
        generatePath(ApiRoute.FavoriteStatus, { offerId, status })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data as ServerError);
      }
      throw error;
    }
  }
);

export const checkAuthStatus = createAsyncThunk<UserInfo, undefined, ThunkApiConfig>(
  `${ActionNamespace.User}/checkAuthStatus`,
  async (_arg, { extra: api }) => {
    const response = await api.get<UserInfo>(ApiRoute.Login);
    return response.data;
  }
);

export const login = createAsyncThunk<UserInfo, LoginPayload, ThunkApiConfig & { rejectValue: ServerError }>(
  `${ActionNamespace.User}/login`,
  async ({ email, password }, { extra: api, rejectWithValue }) => {
    try {
      const response = await api.post<UserInfo>(ApiRoute.Login, { email, password });
      saveToken(response.data.token);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === StatusCodes.BAD_REQUEST) {
        return rejectWithValue(error.response.data as ServerError);
      }
      throw error;
    }
  }
);

export const logout = createAsyncThunk<void, void, ThunkApiConfig>(
  `${ActionNamespace.User}/logout`,
  async (_arg, { extra: api }) => {
    await api.delete(ApiRoute.Logout);
    removeToken();
  }
);
