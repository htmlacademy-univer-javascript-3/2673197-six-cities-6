import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CommentForm } from './comment-form.tsx';
import { withStore } from '../../utils/component-mocks.tsx';
import { makeStore, makeOfferFullInfo } from '../../utils/mocks.ts';

describe('Component: CommentForm', () => {
  it('should render correctly with initial state', () => {
    const { withStoreComponent } = withStore(
      <CommentForm />,
      makeStore({ offers: { ...makeStore().offers, offer: makeOfferFullInfo() } })
    );

    render(withStoreComponent);

    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const { withStoreComponent } = withStore(
      <CommentForm />,
      makeStore({ offers: { ...makeStore().offers, offer: makeOfferFullInfo() } })
    );
    render(withStoreComponent);
    const validCommentText = 'This is a long enough comment to pass the validation check which requires at least 50 characters.';

    await userEvent.type(screen.getByPlaceholderText(/Tell how was your stay/i), validCommentText);
    const ratingInputs = screen.getAllByRole('radio');
    await userEvent.click(ratingInputs[4]);

    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  it('should disable inputs and button when form is being submitted', async () => {
    const offer = makeOfferFullInfo();
    const { withStoreComponent, mockAxiosAdapter } = withStore(
      <CommentForm />,
      makeStore({ offers: { ...makeStore().offers, offer } })
    );

    mockAxiosAdapter.onPost(new RegExp(`/comments/${offer.id}`)).reply(() =>
      new Promise((resolve) => setTimeout(() => resolve([200, {}]), 100))
    );

    render(withStoreComponent);
    const validCommentText = 'This is a long enough comment to pass the validation check which requires at least 50 characters.';

    await userEvent.type(screen.getByPlaceholderText(/Tell how was your stay/i), validCommentText);
    const ratingInputs = screen.getAllByRole('radio');
    await userEvent.click(ratingInputs[0]);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    ratingInputs.forEach((input) => expect(input).toBeDisabled());
  });
});
