import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { API } from '../../lib/api';
import { server } from '../../mocks/node';
import { renderWithProviders } from '../../test/renderWithProviders';
import { AuthorDashboard } from './AuthorDashboard';

async function loginAsReader() {
  await API.auth.login('reader@shitjournal.org', 'mock123456');
}

describe('AuthorDashboard', () => {
  it('disables favorites tab and still shows rated articles for a regular user', async () => {
    await loginAsReader();
    const user = userEvent.setup();

    renderWithProviders(<AuthorDashboard />, {
      initialEntries: ['/dashboard'],
      routes: [{ path: '/dashboard', element: <AuthorDashboard /> }],
    });

    await waitFor(() => {
      expect(screen.getByText('My Excretions')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Favorites / 我的收藏' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Rated / 我的评价' }));

    await waitFor(() => {
      expect(screen.getByText('Benchmarking Latrine Throughput Under Conference Deadline Stress')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Rated 5/5 / 已评价 5/5').length).toBeGreaterThan(0);
  });

  it('falls back to visible zone articles when the ratings endpoint is unavailable', async () => {
    server.use(
      http.get('*/api/users/me/ratings', async () => HttpResponse.json({ detail: 'Not Found' }, { status: 404 })),
    );

    await loginAsReader();
    const user = userEvent.setup();

    renderWithProviders(<AuthorDashboard />, {
      initialEntries: ['/dashboard'],
      routes: [{ path: '/dashboard', element: <AuthorDashboard /> }],
    });

    await waitFor(() => {
      expect(screen.getByText('My Excretions')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Rated / 我的评价' }));

    await waitFor(() => {
      expect(screen.getByText('Benchmarking Latrine Throughput Under Conference Deadline Stress')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Rated 5/5 / 已评价 5/5').length).toBeGreaterThan(0);
  });

  it('renders rated articles when the live endpoint returns a ratings wrapper payload', async () => {
    server.use(
      http.get('*/api/users/me/ratings', async () => HttpResponse.json({
        ratings: [
          {
            score: 5,
            created_at: '2026-03-09T00:00:00.000Z',
            article: {
              id: 'rated-live-shape-1',
              title: 'Live Ratings Payload Compatibility Check',
              tag: 'hardcore',
              status: 'passed',
              created_at: '2026-03-08T00:00:00.000Z',
              topic: 'compat',
              author: {
                display_name: 'Compat Author',
                institution: 'API Contract Lab',
              },
            },
          },
        ],
      })),
    );

    await loginAsReader();
    const user = userEvent.setup();

    renderWithProviders(<AuthorDashboard />, {
      initialEntries: ['/dashboard'],
      routes: [{ path: '/dashboard', element: <AuthorDashboard /> }],
    });

    await waitFor(() => {
      expect(screen.getByText('My Excretions')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Rated / 我的评价' }));

    await waitFor(() => {
      expect(screen.getByText('Live Ratings Payload Compatibility Check')).toBeInTheDocument();
    });

    expect(screen.getByText('Compat Author · API Contract Lab')).toBeInTheDocument();
    expect(screen.getAllByText('Rated 5/5 / 已评价 5/5').length).toBeGreaterThan(0);
  });
});
