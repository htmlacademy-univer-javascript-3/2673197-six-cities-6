import { render, screen } from '@testing-library/react';
import { image } from 'faker';

import { OfferGallery } from './offer-gallery.tsx';

describe('Component: OfferGallery', () => {
  it('should render correct number of images when count is less than or equal to 6', () => {
    const imagesCount = 4;
    const images = Array.from({ length: imagesCount }, () => `${image.imageUrl()}?${Math.random()}`);

    render(<OfferGallery images={images} />);

    const imageElements = screen.getAllByAltText(/Photo studio/i);
    expect(imageElements.length).toBe(imagesCount);
  });

  it('should render only 6 images when count is greater than 6', () => {
    const imagesCount = 10;
    const images = Array.from({ length: imagesCount }, () => `${image.imageUrl()}?${Math.random()}`);

    render(<OfferGallery images={images} />);

    const imageElements = screen.getAllByAltText(/Photo studio/i);
    expect(imageElements.length).toBe(6);
  });
});
