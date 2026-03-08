import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { SearchOverlay } from './SearchOverlay';

describe('SearchOverlay', () => {
  it('renders the expanded black search panel and navigates on submit', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<SearchOverlay open onClose={onClose} />, {
      initialEntries: ['/'],
      routes: [
        { path: '/', element: <SearchOverlay open onClose={onClose} /> },
        { path: '/search', element: <div>Search Results Route</div> },
      ],
    });

    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '请输入搜索词');
    expect(screen.queryByRole('button', { name: /advanced search/i })).not.toBeInTheDocument();
    expect(screen.getByText('Tag Search / 标签搜索:')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox'), 'Flush');
    await user.click(screen.getByRole('button', { name: 'Search / 搜索' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    await screen.findByText('Search Results Route');
  });

  it('allows searching from a trending term chip', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchOverlay open onClose={() => {}} />, {
      initialEntries: ['/'],
      routes: [
        { path: '/', element: <SearchOverlay open onClose={() => {}} /> },
        { path: '/search', element: <div>Chip Search Route</div> },
      ],
    });

    await user.click(screen.getByRole('button', { name: '纯享整活 / Meme' }));

    await screen.findByText('Chip Search Route');
  });
});
