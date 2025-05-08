import { render } from '@testing-library/react';
import { routes } from '@web/shared/providers/RouterProvider';
import { RQProvider } from '@web/shared/providers/RQProvider';
import { RouterProvider, createMemoryRouter } from 'react-router';

export function RenderWithProviders({ route = '/' } = {}) {
  // https://testing-library.com/docs/example-react-router/
  const router = createMemoryRouter(
    routes,
    {
      initialEntries: [route],
    }
  );

  return render(
    <RQProvider>
      <RouterProvider router={router} />
    </RQProvider>
  );
}
