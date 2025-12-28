import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { internet } from 'faker';
import { userEvent } from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { withStore } from '../../utils/component-mocks.tsx';
import { LoginPage } from './login-page.tsx';
import { makeStore } from '../../utils/mocks.ts';
import { ServerErrorType } from '../../enums/server-error-type.ts';
import { login } from '../../store/api-actions.ts';

describe('Component: LoginPage', () => {
  it('should render correctly', () => {
    const { withStoreComponent } = withStore(<LoginPage />, makeStore());
    const withMemoryRouterComponent = <MemoryRouter>{withStoreComponent}</MemoryRouter>;

    render(withMemoryRouterComponent);

    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it(
    'should render correctly when user entered email and valid password (has at least 1 letter and 1 digit)',
    async () => {
      const { withStoreComponent } = withStore(<LoginPage />, makeStore());
      const withMemoryRouterComponent = <MemoryRouter>{withStoreComponent}</MemoryRouter>;
      const expectedEmail = internet.email();
      const expectedPassword = 'a1';

      render(withMemoryRouterComponent);
      await userEvent.type(
        screen.getByPlaceholderText(/Email/i),
        expectedEmail
      );
      await userEvent.type(
        screen.getByPlaceholderText(/Password/i),
        expectedPassword
      );

      expect(screen.getByDisplayValue(expectedEmail)).toBeInTheDocument();
      expect(screen.getByDisplayValue(expectedPassword)).toBeInTheDocument();
    }
  );

  it('should display validation error when password contains only letters', async () => {
    const { withStoreComponent, mockStore } = withStore(<LoginPage />, makeStore());
    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);
    const invalidPassword = 'password';

    await userEvent.type(screen.getByPlaceholderText(/Email/i), internet.email());
    await userEvent.type(screen.getByPlaceholderText(/Password/i), invalidPassword);
    await userEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    expect(screen.getByText(/Password must contain at least one Latin letter and one digit/i)).toBeInTheDocument();
    expect(mockStore.getActions()).not.toContainEqual(expect.objectContaining({ type: login.pending.type }));
  });

  it('should display validation error when password contains only digits', async () => {
    const { withStoreComponent, mockStore } = withStore(<LoginPage />, makeStore());
    render(<MemoryRouter>{withStoreComponent}</MemoryRouter>);
    const invalidPassword = '12345';

    await userEvent.type(screen.getByPlaceholderText(/Email/i), internet.email());
    await userEvent.type(screen.getByPlaceholderText(/Password/i), invalidPassword);
    await userEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    expect(screen.getByText(/Password must contain at least one Latin letter and one digit/i)).toBeInTheDocument();
    expect(mockStore.getActions()).not.toContainEqual(expect.objectContaining({ type: login.pending.type }));
  });

  it('should display validation errors from store', () => {
    const validationError = {
      status: StatusCodes.BAD_REQUEST,
      message: 'Validation error',
      errorType: ServerErrorType.ValidationError,
      details: [
        { property: 'email', value: 'bad', messages: ['Invalid email'] }
      ]
    };

    const { withStoreComponent } = withStore(
      <LoginPage />,
      makeStore({ error: validationError })
    );
    const withMemoryRouterComponent = <MemoryRouter>{withStoreComponent}</MemoryRouter>;

    render(withMemoryRouterComponent);

    expect(screen.getByText(/email: Invalid email/i)).toBeInTheDocument();
  });
});
