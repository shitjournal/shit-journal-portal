import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

interface RouteConfig {
  path: string;
  element: ReactNode;
}

interface RenderOptions {
  initialEntries?: string[];
  routes?: RouteConfig[];
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], routes }: RenderOptions = {},
) {
  const wrappedRoutes = routes ?? [{ path: '*', element: ui }];

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          {wrappedRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}
