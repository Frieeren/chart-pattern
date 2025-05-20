import { useGARouteTracking } from '@web/shared/hooks/useGARouteTracking';
import { RQProvider } from '@web/shared/providers/RQProvider';
import { AppRouterProvider } from '@web/shared/providers/RouterProvider';

function App() {
  useGARouteTracking();

  return (
    <RQProvider>
      <AppRouterProvider />
    </RQProvider>
  );
}

export default App;
