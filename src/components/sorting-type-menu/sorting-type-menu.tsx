import classNames from 'classnames';
import { useState, type ReactNode } from 'react';

import { useAppDispatch } from '../../hooks/use-app-dispatch.ts';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { SortingType } from '../../enums/sorting-type.ts';
import { switchSortingType } from '../../store/offers/offers-slice.ts';
import { getCurrentSortingType } from '../../store/offers/offers-selectors.ts';

const sortingTypes = Object.values(SortingType) as SortingType[];

export function SortingTypeMenu(): ReactNode {
  const [isOpened, setIsOpened] = useState(false);
  const dispatch = useAppDispatch();
  const currentSortingType = useAppSelector(getCurrentSortingType);
  const handleCaptionClick = () => setIsOpened(!isOpened);
  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleCaptionClick}
        data-testid="sorting-caption"
      >
        {currentSortingType}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={classNames(
          'places__options',
          'places__options--custom',
          { 'places__options--opened': isOpened }
        )}
      >
        {sortingTypes.map((st) => {
          const handleOptionClick = () => {
            dispatch(switchSortingType(st));
            setIsOpened(false);
          };

          return (
            <li
              key={st}
              className={classNames(
                'places__option',
                { 'places__option--active': currentSortingType === st }
              )}
              tabIndex={0}
              onClick={handleOptionClick}
            >
              {st}
            </li>
          );
        })}
      </ul>
    </form>
  );
}
