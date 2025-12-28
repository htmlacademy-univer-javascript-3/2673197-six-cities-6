import type { ReactNode } from 'react';

import { RatingStars } from '../rating-stars/rating-stars.tsx';
import type { Comment } from '../../types/comment.ts';

type CommentProps = {
  comment: Comment;
}

export function CommentComponent({ comment }: CommentProps): ReactNode {
  const date = new Date(comment.date);
  return (
    <>
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={comment.user.avatarUrl}
            width={54}
            height={54}
            alt="Reviews avatar"
          />
        </div>
        <span
          className="reviews__user-name"
          style={{wordBreak: 'normal'}}
        >
          {comment.user.name}
        </span>
      </div>
      <div className="reviews__info">
        <RatingStars rating={comment.rating} blockClassName="reviews" />
        <p className="reviews__text">
          {comment.comment}
        </p>
        <time className="reviews__time" dateTime={comment.date}>
          {date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </time>
      </div>
    </>
  );
}
