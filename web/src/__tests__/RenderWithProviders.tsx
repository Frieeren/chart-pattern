import { createMemoryRouter, RouterProvider } from "react-router";
import { render } from "@testing-library/react";
import { MainPage } from "@web/pages/main/MainPage";
import { RQProvider } from "@web/shared/providers/RQProvider";

export function RenderWithProviders({ route = "/" } = {}) {
  // https://testing-library.com/docs/example-react-router/
  const router = createMemoryRouter(
    [
      {
        path: "/",
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: "*",
            element: <div>Not Found</div>,
          },
        ],
      },
    ],
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