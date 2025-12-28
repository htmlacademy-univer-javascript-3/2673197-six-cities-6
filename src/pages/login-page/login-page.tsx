import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState, useMemo, ChangeEvent, FormEvent, ReactNode } from 'react';

import { useAppDispatch } from '../../hooks/use-app-dispatch.ts';
import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { login } from '../../store/api-actions.ts';
import { resetError } from '../../store/error/error-slice.ts';
import { AuthStatus } from '../../enums/auth-status.ts';
import { AppRoute } from '../../enums/app-route.ts';
import { ServerErrorType } from '../../enums/server-error-type.ts';
import { Header } from '../../components/header/header.tsx';
import { switchCity } from '../../store/cities/cities-slice.ts';
import { getAuthStatus } from '../../store/user/user-selectors.ts';
import { getError } from '../../store/error/error-selectors.ts';
import { getCities } from '../../store/cities/cities-selectors.ts';
import type { City } from '../../types/city.ts';

import style from './login-page.module.css';

type CurrentLocationProps = {
  city: City;
  onCityClick: (city: City) => void;
}

function CurrentLocation({ city, onCityClick }: CurrentLocationProps): ReactNode {
  const handleCityClick = () => {
    onCityClick(city);
  };

  return (
    <section className="locations locations--login locations--current">
      <div className="locations__item">
        <Link
          className="locations__item-link"
          to={AppRoute.Main}
          onClick={handleCityClick}
        >
          <span>{city.name}</span>
        </Link>
      </div>
    </section>
  );
}

export function LoginPage(): ReactNode {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const authState = useAppSelector(getAuthStatus);
  const error = useAppSelector(getError);
  const cities = useAppSelector(getCities);

  const randomCity = useMemo(() => {
    if (cities.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
  }, [cities]);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (error && error.errorType === ServerErrorType.ValidationError) {
      const errorMessages = error.details.map(
        (detail) => `${detail.property}: ${detail.messages.join(', ')}`
      );
      if (isMounted) {
        setErrors(errorMessages);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [error]);

  if (authState === AuthStatus.Authorized) {
    return <Navigate to={AppRoute.Main} />;
  }

  const validatePassword = (value: string) => {
    let hasLatinLetter = false;
    let hasDigit = false;

    for (const char of value) {
      if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
        hasLatinLetter = true;
      } else if (char >= '0' && char <= '9') {
        hasDigit = true;
      }
    }

    return hasLatinLetter && hasDigit;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors([]);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors([]);
  };
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setErrors(['Password must contain at least one Latin letter and one digit']);
      return;
    }
    dispatch(login({ email: email, password: password }));
  };
  const handleCityClick = (city: City) => {
    dispatch(switchCity(city));
  };

  return (
    <div className="page page--gray page--login">
      <Header withNav={false} />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={handleFormSubmit}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label htmlFor="email" className="visually-hidden">E-mail</label>
                <input
                  onChange={handleEmailChange}
                  id="email"
                  className="login__input form__input"
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label htmlFor="password" className="visually-hidden">Password</label>
                <input
                  onChange={handlePasswordChange}
                  id="password"
                  className="login__input form__input"
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  required
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
              >
                Sign in
              </button>
            </form>
            <div className={style['auth-errors']}>
              <ul>
                {errors.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          </section>
          {randomCity && (
            <CurrentLocation
              city={randomCity}
              onCityClick={handleCityClick}
            />
          )}
        </div>
      </main>
    </div>
  );
}
