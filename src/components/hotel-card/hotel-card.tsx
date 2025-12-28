import { generatePath, Link } from 'react-router-dom';
import { memo } from 'react';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { AppRoute } from '../../enums/app-route.ts';
import { PremiumLabel } from '../premium-label/premium-label.tsx';
import { BookmarkButton } from '../bookmark-button/bookmark-button.tsx';
import { RatingStars } from '../rating-stars/rating-stars.tsx';
import type { OfferPreviewInfo } from '../../types/offer-preview-info.ts';

type HotelInfoProps = {
  offer: OfferPreviewInfo;
  onBookmarkClick: (offerId: string) => void;
  blockClassName?: 'cities' | 'favorites';
  offerPreviewImageWidth?: number;
  offerPreviewImageHeight?: number;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
};

function HotelCardComponent({
  offer,
  blockClassName = 'cities',
  offerPreviewImageWidth = 260,
  offerPreviewImageHeight = 200,
  onBookmarkClick,
  onMouseOver,
  onMouseLeave
}: HotelInfoProps): ReactNode {
  const handleBookmarkClick = () => {
    onBookmarkClick(offer.id);
  };
  const handleMouseOver = () => {
    if (onMouseOver) {
      onMouseOver();
    }
  };
  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };
  return (
    <article className={`${blockClassName}__card place-card`}>
      {offer.isPremium && <PremiumLabel />}
      <div className={`${blockClassName}__image-wrapper place-card__image-wrapper`}>
        <Link to={generatePath(AppRoute.Offer, { id: offer.id })}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width={offerPreviewImageWidth}
            height={offerPreviewImageHeight}
            alt="Place image"
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
          />
        </Link>
      </div>
      <div className={classNames(
        'place-card__info',
        { 'favorites__card-info': blockClassName === 'favorites' }
      )}
      >
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{offer.price}</b>
            <span className="place-card__price-text">/&nbsp;night</span>
          </div>
          <BookmarkButton active={offer.isFavorite ?? false} onClick={handleBookmarkClick} />
        </div>
        <RatingStars rating={offer.rating} />
        <h2 className="place-card__name">
          <Link to={generatePath(AppRoute.Offer, { id: offer.id })}>
            {offer.title}
          </Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
}

export const HotelCard = memo(HotelCardComponent);
