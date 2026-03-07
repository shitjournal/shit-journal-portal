import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CookieConsent } from './CookieConsent';

function renderCookieConsent(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <div>Page content</div>
              <CookieConsent />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CookieConsent', () => {
  it('shows the consent modal and locks scrolling on regular pages', () => {
    renderCookieConsent('/');

    expect(screen.getByText('USER NOTICE / 用户须知')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('link', { name: '《用户协议》' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: '《隐私政策》' })).toHaveAttribute('target', '_blank');
  });

  it('does not block legal pages and keeps scrolling enabled', () => {
    renderCookieConsent('/terms');

    expect(screen.queryByText('USER NOTICE / 用户须知')).not.toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('does not toggle the checkbox when a legal link is clicked', async () => {
    const user = userEvent.setup();

    renderCookieConsent('/');

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByRole('link', { name: '《用户协议》' }));

    expect(checkbox).not.toBeChecked();
  });
});
