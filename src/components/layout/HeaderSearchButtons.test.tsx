import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { MainHeader } from './MainHeader';
import { StickyHeader } from './StickyHeader';

describe('MainHeader search trigger', () => {
  it('calls the search toggle when the desktop header icon is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSearch = vi.fn();

    renderWithProviders(
      <MainHeader
        onToggleMenu={() => {}}
        onToggleSearch={onToggleSearch}
        searchOpen={false}
        unreadCount={0}
        setUnreadCount={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open search panel/i }));

    expect(onToggleSearch).toHaveBeenCalledTimes(1);
  });
});

describe('StickyHeader search trigger', () => {
  it('calls the search toggle when the sticky header icon is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSearch = vi.fn();

    renderWithProviders(
      <StickyHeader
        onToggleMenu={() => {}}
        onToggleSearch={onToggleSearch}
        searchOpen={false}
        hasUnread={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open search panel/i }));

    expect(onToggleSearch).toHaveBeenCalledTimes(1);
  });
});
