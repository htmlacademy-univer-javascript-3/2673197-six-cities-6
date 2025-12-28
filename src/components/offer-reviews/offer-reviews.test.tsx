import { render, screen } from '@testing-library/react';
import { OfferReviews } from './offer-reviews.tsx';
import { withStore } from '../../utils/component-mocks.tsx';
import { makeStore, makeComment, makeOfferFullInfo, makeUserInfo } from '../../utils/mocks.ts';
import { AuthStatus } from '../../enums/auth-status.ts';

describe('Component: OfferReviews', () => {
  it('should render comments list', () => {
    const comments = [makeComment(), makeComment()];
    const { withStoreComponent } = withStore(
      <OfferReviews comments={comments} />,
      makeStore()
    );

    render(withStoreComponent);

    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText(comments.length.toString())).toBeInTheDocument();
    expect(screen.getAllByTestId('comment-item')).toHaveLength(comments.length);
  });

  it('should render maximum 10 comments', () => {
    const comments = Array.from({ length: 15 }, () => makeComment());
    const expectedCount = 10;
    const { withStoreComponent } = withStore(
      <OfferReviews comments={comments} />,
      makeStore()
    );

    render(withStoreComponent);

    expect(screen.getAllByTestId('comment-item')).toHaveLength(expectedCount);
  });

  it('should render comments sorted from newest to oldest', () => {
    const oldComment = makeComment({ date: '2023-01-01T00:00:00.000Z', comment: 'Old one' });
    const newComment = makeComment({ date: '2023-12-31T00:00:00.000Z', comment: 'New one' });
    const comments = [oldComment, newComment];
    const { withStoreComponent } = withStore(
      <OfferReviews comments={comments} />,
      makeStore()
    );

    render(withStoreComponent);

    const commentElements = screen.getAllByTestId('comment-item');
    expect(commentElements[0]).toHaveTextContent('New one');
    expect(commentElements[1]).toHaveTextContent('Old one');
  });

  it('should render comment form if user is authorized', () => {
    const { withStoreComponent } = withStore(
      <OfferReviews comments={[]} />,
      makeStore({
        user: { authStatus: AuthStatus.Authorized, info: makeUserInfo() },
        offers: { ...makeStore().offers, offer: makeOfferFullInfo() }
      })
    );

    render(withStoreComponent);

    expect(screen.getByText(/Your review/i)).toBeInTheDocument();
  });

  it('should not render comment form if user is unauthorized', () => {
    const { withStoreComponent } = withStore(
      <OfferReviews comments={[]} />,
      makeStore({ user: { authStatus: AuthStatus.Unauthorized, info: null } })
    );

    render(withStoreComponent);

    expect(screen.queryByText(/Your review/i)).not.toBeInTheDocument();
  });
});
