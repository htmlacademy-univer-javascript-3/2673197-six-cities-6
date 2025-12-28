import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { NearPlaces } from './near-places.tsx';
import { makeOfferPreviewInfo } from '../../utils/mocks.ts';

describe('Component: NearPlaces', () => {
  it('should render title and offers list', () => {
    const count = 3;
    const offers = Array.from({ length: count }, () => makeOfferPreviewInfo());

    render(
      <MemoryRouter>
        <NearPlaces
          offers={offers}
          onBookmarkClick={() => {}}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Other places in the neighbourhood/i)).toBeInTheDocument();
    expect(screen.getAllByRole('article').length).toBe(count);
  });
});
