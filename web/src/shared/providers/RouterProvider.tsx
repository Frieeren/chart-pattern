import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';

const MainPage = lazy(() => import('@web/pages/main/MainPage'));

export const routes = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <div>Not Found</div>,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
