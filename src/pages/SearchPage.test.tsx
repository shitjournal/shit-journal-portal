import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/node';
import { renderWithProviders } from '../test/renderWithProviders';
import { SearchPage } from './SearchPage';

describe('SearchPage', () => {
  it('renders results returned from the search API', async () => {
    renderWithProviders(<SearchPage />, {
      initialEntries: ['/search?q=Flush&type=author&limit=12'],
      routes: [{ path: '/search', element: <SearchPage /> }],
    });

    await waitFor(() => {
      expect(
        screen.getByText('Benchmarking Latrine Throughput Under Conference Deadline Stress'),
      ).toBeInTheDocument();
    });

    expect(screen.getAllByText(/dr\. flush/i).length).toBeGreaterThan(0);
    expect(screen.getByText('2 results / 条，范围 作者昵称')).toBeInTheDocument();
  });

  it('updates the query and reruns search from the page controls', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchPage />, {
      initialEntries: ['/search?q=peer&type=article&limit=12'],
      routes: [{ path: '/search', element: <SearchPage /> }],
    });

    await user.clear(screen.getByPlaceholderText('搜索标题、作者与标签'));
    await user.type(screen.getByPlaceholderText('搜索标题、作者与标签'), 'Fiber');
    await user.selectOptions(screen.getByRole('combobox'), 'author');
    await user.click(screen.getByRole('button', { name: 'Search / 搜索' }));

    await waitFor(() => {
      expect(screen.getAllByText(/prof\. fiber/i).length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/范围 作者昵称/)).toBeInTheDocument();
  });

  it('caps the live search request limit at the backend maximum', async () => {
    server.use(
      http.get('*/api/search/article', async ({ request }) => {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get('limit') ?? '0');

        if (limit > 30) {
          return HttpResponse.json({ detail: 'Input should be less than or equal to 30' }, { status: 422 });
        }

        return HttpResponse.json({
          data: [
            {
              id: 'limit-check-result',
              title: 'Limit Clamp Result',
              tag: 'hardcore',
              zones: 'latrine',
              status: 'passed',
              discipline: 'engineering',
              created_at: '2026-03-09T00:00:00.000Z',
              rating_count: 0,
              avg_score: 0,
              weighted_score: 0,
              author: {
                display_name: 'Clamp Tester',
                institution: 'API Contract Lab',
              },
            },
          ],
        });
      }),
    );

    renderWithProviders(<SearchPage />, {
      initialEntries: ['/search?q=Clamp&type=article'],
      routes: [{ path: '/search', element: <SearchPage /> }],
    });

    await waitFor(() => {
      expect(screen.getByText('Limit Clamp Result')).toBeInTheDocument();
    });

    expect(screen.queryByText('Input should be less than or equal to 30')).not.toBeInTheDocument();
  });

  it('supports tag search for meme and hardcore chips', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchPage />, {
      initialEntries: ['/search'],
      routes: [{ path: '/search', element: <SearchPage /> }],
    });

    await user.click(screen.getByRole('button', { name: '纯享整活 / Meme' }));

    await waitFor(() => {
      expect(screen.getByText(/探究林黛玉的真实武力值/)).toBeInTheDocument();
    });

    expect(screen.getByText(/范围 标签/)).toBeInTheDocument();
  });

  it('supports fuzzy bilingual tag search', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchPage />, {
      initialEntries: ['/search?q=me&type=tag&limit=12'],
      routes: [{ path: '/search', element: <SearchPage /> }],
    });

    await waitFor(() => {
      expect(screen.getByText(/探究林黛玉的真实武力值/)).toBeInTheDocument();
    });

    await user.clear(screen.getByPlaceholderText('搜索标题、作者与标签'));
    await user.type(screen.getByPlaceholderText('搜索标题、作者与标签'), '硬核');
    await user.click(screen.getByRole('button', { name: 'Search / 搜索' }));

    await waitFor(() => {
      expect(screen.getByText(/Benchmarking Latrine Throughput Under Conference Deadline Stress/)).toBeInTheDocument();
    });
  });

  it('paginates search results in groups of 10 with preprint-style controls', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchPage />, {
      initialEntries: ['/search?q=me&type=tag'],
      routes: [{ path: '/search', element: <SearchPage /> }],
    });

    await waitFor(() => {
      expect(screen.getByText(/13 results \/ 条，范围 标签，第 1 \/ 2 页/)).toBeInTheDocument();
    });

    expect(screen.queryByText('Negative Externalities of Over-Flushing Draft Manuscripts')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(screen.getByText(/13 results \/ 条，范围 标签，第 2 \/ 2 页/)).toBeInTheDocument();
    });

    expect(screen.getByText('Negative Externalities of Over-Flushing Draft Manuscripts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prev' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
