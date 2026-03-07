import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LoginPage } from './LoginPage';
import { renderWithProviders } from '../test/renderWithProviders';

describe('LoginPage', () => {
  it('logs in with mock credentials and navigates to the dashboard route', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, {
      initialEntries: ['/login'],
      routes: [
        { path: '/login', element: <LoginPage /> },
        { path: '/dashboard', element: <div>Dashboard Page</div> },
      ],
    });

    await user.type(screen.getByPlaceholderText('your.shit@email.com'), 'bukolosier@gmail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'mock123456');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /log in \/ 登录/i }));

    await screen.findByText('Dashboard Page');

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toContain('mock-token-');
    });
  });
});
