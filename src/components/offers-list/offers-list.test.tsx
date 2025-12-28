import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { datatype } from 'faker';

import { OffersList } from './offers-list.tsx';
import { makeOfferPreviewInfo } from '../../utils/mocks.ts';

describe('Component: OffersList', () => {
  it('should render correct number of cards', () => {
    const count = datatype.number({ min: 3, max: 6 });
    const offers = Array.from({ length: count }, () => makeOfferPreviewInfo());

    render(
      <MemoryRouter>
        <OffersList
          offers={offers}
          onBookmarkClick={() => {}}
        />
      </MemoryRouter>
    );

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBe(count);
  });
});
