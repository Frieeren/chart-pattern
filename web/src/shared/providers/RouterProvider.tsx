import { MainPage } from '@web/pages/main/MainPage';
import { RouterProvider, createBrowserRouter } from 'react-router';

export const routes =[
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
];

const router = createBrowserRouter(routes);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
