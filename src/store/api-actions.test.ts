import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { datatype, internet, lorem } from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';

import { createApi } from '../services/api.ts';
import {
  checkAuthStatus,
  getFavoriteOffers,
  getOffer,
  getOffers,
  login,
  logout,
  sendComment,
  setFavoriteStatus
} from './api-actions.ts';
import { ApiRoute } from '../enums/api-route.ts';
import { AuthStatus } from '../enums/auth-status.ts';
import { FavoriteAction } from '../enums/favorite-action.ts';
import type { State } from '../types/state.ts';
import type { CommentContent } from '../types/comment-content.ts';

const extractActionTypes = (actions: Action<string>[]) => actions.map((action) => action.type);

describe('Async actions', () => {
  const axios = createApi();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<
    State,
    Action<string>,
    ThunkDispatch<State, typeof axios, Action>
  >(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({ user: { authStatus: AuthStatus.Unknown, info: null } });
  });

  describe('getOffers', () => {
    it('should dispatch "getOffers.pending" and "getOffers.fulfilled" when server response 200', async () => {
      mockAxiosAdapter.onGet(ApiRoute.Offers).reply(200, []);

      await store.dispatch(getOffers());

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        getOffers.pending.type,
        getOffers.fulfilled.type,
      ]);
    });

    it('should dispatch "getOffers.pending" and "getOffers.rejected" when server response 500', async () => {
      mockAxiosAdapter.onGet(ApiRoute.Offers).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      await store.dispatch(getOffers());

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        getOffers.pending.type,
        getOffers.rejected.type,
      ]);
    });
  });

  describe('getOffer', () => {
    it('should dispatch "getOffer.pending" and "getOffer.fulfilled" when server response 200', async () => {
      const mockId = '1';
      mockAxiosAdapter.onGet(`/offers/${mockId}`).reply(200, {});
      mockAxiosAdapter.onGet(`/comments/${mockId}`).reply(200, []);
      mockAxiosAdapter.onGet(`/offers/${mockId}/nearby`).reply(200, []);

      await store.dispatch(getOffer(mockId));

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        getOffer.pending.type,
        getOffer.fulfilled.type,
      ]);
    });

    it('should dispatch "getOffer.pending" and "getOffer.rejected" when server response 404', async () => {
      const offerId = datatype.uuid();
      mockAxiosAdapter.onGet(`/offers/${offerId}`).reply(404);

      await store.dispatch(getOffer(offerId));

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        getOffer.pending.type,
        getOffer.rejected.type,
      ]);
    });
  });

  describe('checkAuthStatus', () => {
    it('should dispatch "checkAuthStatus.pending" and "checkAuthStatus.fulfilled" when server response 200', async () => {
      mockAxiosAdapter.onGet(ApiRoute.Login).reply(200, {});

      await store.dispatch(checkAuthStatus());

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthStatus.pending.type,
        checkAuthStatus.fulfilled.type,
      ]);
    });

    it('should dispatch "checkAuthStatus.pending" and "checkAuthStatus.rejected" when server response 401', async () => {
      mockAxiosAdapter.onGet(ApiRoute.Login).reply(401);

      await store.dispatch(checkAuthStatus());

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthStatus.pending.type,
        checkAuthStatus.rejected.type,
      ]);
    });
  });

  describe('login', () => {
    it('should dispatch "login.pending" and "login.fulfilled" when server response 200', async () => {
      const user = { email: internet.email(), password: internet.password() };
      mockAxiosAdapter.onPost(ApiRoute.Login).reply(200, { token: 'secret' });

      await store.dispatch(login(user));

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        login.pending.type,
        login.fulfilled.type,
      ]);
    });
  });

  describe('logout', () => {
    it('should dispatch "logout.pending" and "logout.fulfilled" when server response 204', async () => {
      mockAxiosAdapter.onDelete(ApiRoute.Logout).reply(204);

      await store.dispatch(logout());

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        logout.pending.type,
        logout.fulfilled.type,
      ]);
    });
  });

  describe('sendComment', () => {
    it('should dispatch "sendComment.pending" and "sendComment.fulfilled" when server response 200', async () => {
      const offerId = datatype.uuid();
      const comment: CommentContent = {
        comment: lorem.sentence(),
        rating: datatype.number({ min: 1, max: 5 })
      };
      mockAxiosAdapter.onPost(`/comments/${offerId}`).reply(200, {});

      await store.dispatch(sendComment({ comment: comment, offerId: offerId }));

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        sendComment.pending.type,
        sendComment.fulfilled.type,
      ]);
    });
  });

  describe('getFavoriteOffers', () => {
    it('should dispatch "getFavoriteOffers.pending" and "getFavoriteOffers.fulfilled" when server response 200', async () => {
      mockAxiosAdapter.onGet(ApiRoute.Favorite).reply(200, []);

      await store.dispatch(getFavoriteOffers());

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        getFavoriteOffers.pending.type,
        getFavoriteOffers.fulfilled.type,
      ]);
    });
  });

  describe('setFavoriteStatus', () => {
    it('should dispatch "setFavoriteStatus.pending" and "setFavoriteStatus.fulfilled" when server response 200', async () => {
      const offerId = datatype.uuid();
      const mockStatus = FavoriteAction.Add;
      mockAxiosAdapter.onPost(`/favorite/${offerId}/${mockStatus}`).reply(200, {});

      await store.dispatch(setFavoriteStatus({ offerId: offerId, status: mockStatus }));

      const actions = extractActionTypes(store.getActions());

      expect(actions).toEqual([
        setFavoriteStatus.pending.type,
        setFavoriteStatus.fulfilled.type,
      ]);
    });
  });
});
