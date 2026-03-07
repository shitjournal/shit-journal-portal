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
});
