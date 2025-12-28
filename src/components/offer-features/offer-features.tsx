import type { ReactNode } from 'react';

import type { HotelType } from '../../enums/hotel-type.ts';

type OfferFeaturesProps = {
  type: HotelType;
  bedrooms: number;
  maxAdults: number;
}

export function OfferFeatures({ type, bedrooms, maxAdults }: OfferFeaturesProps): ReactNode {
  return (
    <ul className="offer__features">
      <li className="offer__feature offer__feature--entire">
        {type}
      </li>
      <li className="offer__feature offer__feature--bedrooms">
        {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
      </li>
      <li className="offer__feature offer__feature--adults">
        Max {maxAdults} {maxAdults === 1 ? 'adult' : 'adults'}
      </li>
    </ul>
  );
}
