import { Fragment } from 'react';
import type { ReactNode } from 'react';

import { RATINGS } from '../../const.ts';
import type { RatingScore } from '../../types/rating-score.ts';

type ScoreStarsProps = {
  value: RatingScore | null;
  onChange: (score: RatingScore) => void;
  disabled?: boolean;
}

export function RatingStarsInput({ onChange, value, disabled = false }: ScoreStarsProps): ReactNode {
  return (
    <div className="reviews__rating-form form__rating">
      {RATINGS.map(({rating, description}) => (
        <Fragment key={rating}>
          <input
            className="form__rating-input visually-hidden"
            name="rating"
            value={rating}
            id={`${rating}-stars`}
            type="radio"
            checked={rating === value}
            onChange={() => onChange(rating)}
            disabled={disabled}
          />
          <label
            htmlFor={`${rating}-stars`}
            className="reviews__rating-label form__rating-label"
            title={description}
            aria-label={description}
          >
            <svg className="form__star-image" width="37" height="33">
              <use xlinkHref="#icon-star"></use>
            </svg>
          </label>
        </Fragment>
      ))}
    </div>
  );
}
