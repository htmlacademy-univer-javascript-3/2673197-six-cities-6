import classNames from 'classnames';
import { ReactNode } from 'react';

type BookmarkButtonProps = {
  active: boolean;
  onClick: () => void;
  blockClassName?: string;
  width?: number;
  height?: number;
};

export function BookmarkButton(
  { active, onClick, blockClassName = 'place-card', width = 18, height = 19 }: BookmarkButtonProps
): ReactNode {
  return (
    <button
      className={classNames(
        `${blockClassName}__bookmark-button button`,
        { [`${blockClassName}__bookmark-button--active`]: active }
      )}
      type="button"
      onClick={onClick}
    >
      <svg className={`${blockClassName}__bookmark-icon`} width={width} height={height}>
        <use xlinkHref="#icon-bookmark"></use>
      </svg>
      <span className="visually-hidden">{active ? 'In' : 'To'} bookmarks</span>
    </button>
  );
}
