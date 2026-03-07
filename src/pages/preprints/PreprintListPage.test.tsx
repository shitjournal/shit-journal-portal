import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PreprintListPage } from './PreprintListPage';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('PreprintListPage', () => {
  it('renders mocked latrine articles from MSW', async () => {
    renderWithProviders(<PreprintListPage />, {
      initialEntries: ['/preprints?zone=latrine'],
      routes: [{ path: '/preprints', element: <PreprintListPage /> }],
    });

    await waitFor(() => {
      expect(
        screen.getByText('Benchmarking Latrine Throughput Under Conference Deadline Stress'),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Dr\. Flush/i)).toBeInTheDocument();
  });

  it('uses compact mobile padding for discipline and sort controls', async () => {
    renderWithProviders(<PreprintListPage />, {
      initialEntries: ['/preprints?zone=septic'],
      routes: [{ path: '/preprints', element: <PreprintListPage /> }],
    });

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    expect(screen.getByRole('combobox')).toHaveClass('px-1', 'py-[6px]', 'md:px-3', 'md:py-1.5');
    expect(screen.getByRole('button', { name: 'Newest / 最新' })).toHaveClass(
      'px-1',
      'py-[6px]',
      'md:px-3',
      'md:py-1.5',
    );
  });
});
