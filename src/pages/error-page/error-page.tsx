import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { StatusCodes } from 'http-status-codes';

import { useAppSelector } from '../../hooks/use-app-selector.ts';
import { getError } from '../../store/error/error-selectors.ts';

type ErrorPageProps =
  | {
      statusCode?: null;
      message?: null;
    }
  | {
      statusCode: StatusCodes;
      message: string;
    }

export function ErrorPage({ statusCode, message }: ErrorPageProps): ReactNode {
  const errorFromState = useAppSelector(getError);

  const currentStatus = statusCode ?? errorFromState?.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const currentMessage = message ?? errorFromState?.message ?? 'Internal Server Error';

  return (
    <div className="page page--gray page--main">
      <main className="page__main">
        <div className="container error-container">
          <div className='error-info'>
            <h1 style={{margin: 0}}>{currentStatus}</h1>
            <span>{currentMessage}</span>
          </div>
          <Link to='/' className='main-page-button'>
            Go to main page
          </Link>
        </div>
      </main>
    </div>
  );
}
