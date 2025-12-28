import { render, screen } from '@testing-library/react';

import { RatingStars } from './rating-stars.tsx';

describe('Component: RatingStars', () => {
  it('should render correctly with given rating', () => {
    const rating = 4;
    const expectedWidth = `${rating * 20}%`;

    render(<RatingStars rating={rating} />);

    const ratingValue = screen.getByText(/Rating/i);
    expect(ratingValue).toBeInTheDocument();

    const starsElement = ratingValue.previousSibling as HTMLElement;
    expect(starsElement).toHaveStyle({ width: expectedWidth });
  });

  it('should render children', () => {
    const testId = 'test-child';
    render(
      <RatingStars rating={5}>
        <span data-testid={testId}>Child</span>
      </RatingStars>
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should round rating', () => {
    const rating = 3.6;
    const roundedRating = Math.round(rating);
    const expectedWidth = `${roundedRating * 20}%`;

    render(<RatingStars rating={rating} />);

    const ratingValue = screen.getByText(/Rating/i);
    const starsElement = ratingValue.previousSibling as HTMLElement;
    expect(starsElement).toHaveStyle({ width: expectedWidth });
  });

  it('should clamp rating', () => {
    const rating = 20.6;
    const clampedRating = Math.min(5, Math.max(0, rating));
    const expectedWidth = `${clampedRating * 20}%`;

    render(<RatingStars rating={rating} />);

    const ratingValue = screen.getByText(/Rating/i);
    const starsElement = ratingValue.previousSibling as HTMLElement;
    expect(starsElement).toHaveStyle({ width: expectedWidth });
  });
});
