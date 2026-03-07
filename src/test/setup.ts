import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from '../mocks/node';
import { resetMockDb } from '../mocks/handlers';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  resetMockDb();
  server.resetHandlers();
  vi.restoreAllMocks();
});

afterAll(() => {
  server.close();
});

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});
