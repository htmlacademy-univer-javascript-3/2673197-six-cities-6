import { useMemo, type ReactNode } from 'react';

import { CommentsList } from '../comments-list/comments-list.tsx';
import { CommentForm } from '../comment-form/comment-form.tsx';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import { getAuthStatus } from '../../store/user/user-selectors.ts';
import type { Comment } from '../../types/comment.ts';

const MAX_REVIEWS_COUNT = 10;

type OfferReviewsProps = {
  comments: Comment[];
}

export function OfferReviews({ comments }: OfferReviewsProps): ReactNode {
  const authStatus = useAppSelector(getAuthStatus);

  const displayedComments = useMemo(() =>
    [...comments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_REVIEWS_COUNT),
  [comments]);

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{comments.length}</span>
      </h2>
      <CommentsList comments={displayedComments} />
      {authStatus === AuthStatus.Authorized && <CommentForm />}
    </section>
  );
}
