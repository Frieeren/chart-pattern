import { AppRouterProvider } from "@web/shared/providers/RouterProvider";
import { RQProvider } from "@web/shared/providers/RQProvider";

function App() {
  return (
    <RQProvider>
      <AppRouterProvider />
    </RQProvider>
  );
}

export default App;
