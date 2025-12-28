import { memo, useCallback } from 'react';
import type { ReactNode } from 'react';

import { HotelCard } from '../hotel-card/hotel-card.tsx';
import type { OfferPreviewInfo } from '../../types/offer-preview-info.ts';

type OffersListProps = {
  offers: OfferPreviewInfo[];
  onBookmarkClick: (offerId: string) => void;
  onOfferCardHover?: (hoveredOfferId: string) => void;
  onOfferCardUnhover?: () => void;
}

function OffersListComponent({offers, onOfferCardHover, onOfferCardUnhover, onBookmarkClick}: OffersListProps): ReactNode {
  const handleCardUnhover = useCallback(() => {
    if (onOfferCardUnhover) {
      onOfferCardUnhover();
    }
  }, [onOfferCardUnhover]);

  return (
    <>
      {offers.map((offer: OfferPreviewInfo) => {
        const handleCardHover = () => {
          if (onOfferCardHover) {
            onOfferCardHover(offer.id);
          }
        };
        return (
          <HotelCard
            key={offer.id}
            offer={offer}
            onMouseOver={handleCardHover}
            onMouseLeave={handleCardUnhover}
            onBookmarkClick={onBookmarkClick}
          />
        );
      })}
    </>
  );
}

export const OffersList = memo(OffersListComponent);
