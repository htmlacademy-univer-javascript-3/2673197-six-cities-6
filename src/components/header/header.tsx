import { Link } from 'react-router-dom';
import { MouseEvent, ReactNode } from 'react';

import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { useAppDispatch } from '../../hooks/use-app-dispatch.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import { AppRoute } from '../../enums/app-route.ts';
import { logout } from '../../store/api-actions.ts';
import { getAuthStatus, getUserInfo } from '../../store/user/user-selectors.ts';
import { getFavoriteOffers } from '../../store/offers/offers-selectors.ts';

function NavigationItems(): ReactNode {
  const authStatus = useAppSelector(getAuthStatus);
  const userInfo = useAppSelector(getUserInfo);
  const favoriteOffers = useAppSelector(getFavoriteOffers);
  const dispatch = useAppDispatch();
  const handleLogoutClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(logout());
  };
  let navItems: ReactNode;
  switch (authStatus) {
    case AuthStatus.Authorized:
      navItems = (
        <>
          <li className="header__nav-item user">
            <Link
              className="header__nav-link header__nav-link--profile"
              to={AppRoute.Favorites}
            >
              <div className="header__avatar-wrapper user__avatar-wrapper"></div>
              <span className="header__user-name user__name">
                {userInfo?.email}
              </span>
              <span className="header__favorite-count">{favoriteOffers.length}</span>
            </Link>
          </li>
          <li className="header__nav-item">
            <a
              className="header__nav-link"
              href="#"
              onClick={handleLogoutClick}
            >
              <span className="header__signout">Sign out</span>
            </a>
          </li>
        </>
      );
      break;
    case AuthStatus.Unauthorized:
    case AuthStatus.Unknown:
      navItems = (
        <li className="header__nav-item">
          <Link
            className="header__nav-link"
            to={AppRoute.Login}
          >
            <span className="header__signout">Sign in</span>
          </Link>
        </li>
      );
      break;
    default:
      navItems = null;
      break;
  }

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        {navItems}
      </ul>
    </nav>
  );
}

export function Header({ withNav = true }: { withNav?: boolean }): ReactNode {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className="header__logo-link header__logo-link--active"
              to={AppRoute.Main}
            >
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width={81}
                height={41}
              />
            </Link>
          </div>
          {withNav && <NavigationItems />}
        </div>
      </div>
    </header>
  );
}
