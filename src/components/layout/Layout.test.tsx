import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { SearchPage } from '../../pages/SearchPage';
import { Layout } from './Layout';

vi.mock('../../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api')>('../../lib/api');
  return {
    ...actual,
    API: {
      ...actual.API,
      notifications: {
        ...actual.API.notifications,
        getUnreadCount: vi.fn().mockResolvedValue({ count: 0 }),
      },
    },
  };
});

describe('Layout search toggle', () => {
  it('closes the existing search panel when the header search button is clicked again', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Layout>
        <div>Page Content</div>
      </Layout>,
    );

    await user.click(screen.getByRole('button', { name: /open search panel/i }));

    expect(screen.getByRole('region', { name: 'Expanded search panel' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入搜索词')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close search panel/i }));

    expect(screen.queryByRole('region', { name: 'Expanded search panel' })).not.toBeInTheDocument();
  });

  it('does not render the global search overlay on the search page route', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Layout><SearchPage /></Layout>, {
      initialEntries: ['/search?q=测试&type=article'],
      routes: [{ path: '/search', element: <Layout><SearchPage /></Layout> }],
    });

    expect(screen.queryByRole('region', { name: 'Expanded search panel' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open search panel/i }));

    expect(screen.queryByRole('region', { name: 'Expanded search panel' })).not.toBeInTheDocument();
    expect(screen.getAllByText(/Search The Journal \/ 搜索期刊/).length).toBeGreaterThan(0);
  });
});
