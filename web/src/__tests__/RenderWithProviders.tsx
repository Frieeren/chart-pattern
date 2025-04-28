import { createMemoryRouter, RouterProvider } from "react-router";
import { render } from "@testing-library/react";
import { HomePage } from "@web/pages/HomePage";
import { RQProvider } from "@web/shared/providers/RQProvider";

export function renderWithProviders({ route = "/" } = {}) {
  // https://testing-library.com/docs/example-react-router/
  const router = createMemoryRouter(
    [
      {
        path: "/",
        children: [
          {
            index: true,
            element: <HomePage />,
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