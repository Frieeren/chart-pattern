import { render } from '@testing-library/react';
import { RQProvider } from '@web/shared/providers/RQProvider';
import { routes as appRoutes } from '@web/shared/providers/RouterProvider';
import { RouterProvider, createMemoryRouter } from 'react-router';

export function renderWithRouter({ initialEntries = ['/'], routes = appRoutes } = {}) {
  // https://testing-library.com/docs/example-react-router/
  const router = createMemoryRouter(routes, {
    initialEntries,
  });

  const result = render(
    <RQProvider>
      <RouterProvider router={router} />
    </RQProvider>
  );

  return {
    ...result,
    router,
  };
}
