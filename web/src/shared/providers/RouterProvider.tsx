import { MainPage } from '@web/pages/main/MainPage';
import { RouterProvider, createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '*',
        element: <div>Not Found</div>,
      },
    ],
  },
]);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
