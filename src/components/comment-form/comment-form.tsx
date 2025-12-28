import { useState, ChangeEvent, FormEvent } from 'react';
import type { ReactNode } from 'react';

import { RatingStarsInput } from '../rating-stars-input/rating-stars-input.tsx';
import { useAppDispatch } from '../../hooks/use-app-dispatch.ts';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { ServerErrorType } from '../../enums/server-error-type.ts';
import { resetError } from '../../store/error/error-slice.ts';
import { sendComment } from '../../store/api-actions.ts';
import { getError } from '../../store/error/error-selectors.ts';
import { getOffer } from '../../store/offers/offers-selectors.ts';
import type { CommentContent } from '../../types/comment-content.ts';
import type { RatingScore } from '../../types/rating-score.ts';

const MIN_COMMENT_LENGTH = 50;
const MAX_COMMENT_LENGTH = 300;

type CommentContentState = Omit<CommentContent, 'rating'> & {
  rating: RatingScore | null;
}

export function CommentForm(): ReactNode {
  const [comment, setComment] = useState<CommentContentState>({ rating: null, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const error = useAppSelector(getError);
  const offer = useAppSelector(getOffer);
  const offerId = offer?.id;

  if (!offerId) {
    throw new Error('CommentForm can\'t be used without an offerId');
  }

  const isFormValid =
    comment.comment.length >= MIN_COMMENT_LENGTH &&
    comment.comment.length <= MAX_COMMENT_LENGTH &&
    comment.rating !== null;

  const handleRatingChange = (score: RatingScore) => {
    setComment({...comment, rating: score});
    dispatch(resetError());
  };
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment({...comment, comment: e.target.value});
    dispatch(resetError());
  };
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(sendComment({ comment: comment as CommentContent, offerId: offerId }))
      .unwrap()
      .then(() => setComment({ rating: null, comment: '' }))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form
      className="reviews__form form"
      action="#"
      method="post"
      onSubmit={handleFormSubmit}
    >
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <RatingStarsInput
        value={comment.rating}
        disabled={isSubmitting}
        onChange={handleRatingChange}
      />
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={comment.comment}
        disabled={isSubmitting}
        onChange={handleCommentChange}
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">{MIN_COMMENT_LENGTH} characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isFormValid || isSubmitting}
        >
          Submit
        </button>
      </div>
      {error && error.errorType === ServerErrorType.ValidationError && (
        <div>
          <ul>
            {error.details.map((detail) => {
              const errorMessage = `${detail.property}: ${detail.messages.join(', ')}`;
              return <li key={errorMessage}>{errorMessage}</li>;
            })}
          </ul>
        </div>
      )}
    </form>
  );
}
