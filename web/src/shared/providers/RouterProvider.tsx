import { Suspense, lazy } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import { useChannelIOVisibility } from '../hooks/useChannelIO';
import { useGARouteTracking } from '../hooks/useGA';

const MainPage = lazy(() => import('@web/pages/main/MainPage'));

const RootLayout = () => {
  useGARouteTracking();
  useChannelIOVisibility();

  return <Outlet />;
};

export const routes = [
  {
    path: '/',
    Component: RootLayout,
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
