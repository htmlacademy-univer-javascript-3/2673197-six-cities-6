import type { PropsWithChildren, ReactNode } from 'react';

import type { RatingScore } from '../../types/rating-score.ts';

const MIN_RATING = 0;
const MAX_RATING = 5;
const WIDTH_PERCENT_PER_POINT = 20;

type RatingStarsProps = PropsWithChildren<{
  rating: RatingScore;
  blockClassName?: 'offer' | 'reviews' | 'place-card';
}>

export function RatingStars({ rating, children, blockClassName = 'place-card' }: RatingStarsProps): ReactNode {
  const clampedRating = Math.min(MAX_RATING, Math.max(MIN_RATING, rating));
  const roundedRating = Math.round(clampedRating);
  return (
    <div className={`${blockClassName}__rating rating`}>
      <div className={`${blockClassName}__stars rating__stars`}>
        <span style={{ width: `${roundedRating * WIDTH_PERCENT_PER_POINT}%` }} />
        <span className="visually-hidden">Rating</span>
      </div>
      {children}
    </div>
  );
}
