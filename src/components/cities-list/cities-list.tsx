import classNames from 'classnames';
import { memo, useCallback } from 'react';
import type { ReactNode } from 'react';

import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { getCity } from '../../store/cities/cities-selectors.ts';
import type { City } from '../../types/city.ts';

type CitiesListProps = {
  cities: City[];
  onCityClick: (city: City) => void;
}

function CitiesListComponent({ cities, onCityClick }: CitiesListProps): ReactNode {
  const currentCity = useAppSelector(getCity);
  const handleCityClick = useCallback((city: City) => onCityClick(city), [onCityClick]);
  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((city) => (
          <li className="locations__item" key={city.name}>
            <a
              className={classNames(
                'locations__item-link',
                'tabs__item',
                { 'tabs__item--active': currentCity && city.name === currentCity.name }
              )}
              onClick={() => handleCityClick(city)}
            >
              <span>{city.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const CitiesList = memo(CitiesListComponent);
