import { render, screen } from '@testing-library/react';
import { datatype } from 'faker';

import { OfferFeatures } from './offer-features.tsx';
import { HotelType } from '../../enums/hotel-type.ts';

describe('Component: OfferFeatures', () => {
  it('should render plural labels when values are greater than 1', () => {
    const type = HotelType.Apartment;
    const bedrooms = datatype.number({ min: 2, max: 5 });
    const maxAdults = datatype.number({ min: 2, max: 20 });

    render(
      <OfferFeatures
        type={type}
        bedrooms={bedrooms}
        maxAdults={maxAdults}
      />
    );

    expect(screen.getByText(new RegExp(`${bedrooms} Bedrooms`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Max ${maxAdults} adults`, 'i'))).toBeInTheDocument();
  });

  it('should render singular labels when values are equal to 1', () => {
    const type = HotelType.Room;
    const bedrooms = 1;
    const maxAdults = 1;

    render(
      <OfferFeatures
        type={type}
        bedrooms={bedrooms}
        maxAdults={maxAdults}
      />
    );

    expect(screen.getByText(/1 Bedroom/i)).toBeInTheDocument();
    expect(screen.getByText(/Max 1 adult/i)).toBeInTheDocument();
  });

  it('should render hotel type', () => {
    const type = HotelType.Apartment;
    const bedrooms = datatype.number({ min: 1, max: 5 });
    const maxAdults = datatype.number({ min: 1, max: 20 });

    render(
      <OfferFeatures
        type={type}
        bedrooms={bedrooms}
        maxAdults={maxAdults}
      />
    );

    expect(screen.getByText(new RegExp(type, 'i'))).toBeInTheDocument();
  });
});
