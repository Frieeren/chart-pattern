import { useGA4Init } from '@web/shared/hooks/useGA';
import { RQProvider } from '@web/shared/providers/RQProvider';
import { AppRouterProvider } from '@web/shared/providers/RouterProvider';

function App() {
  useGA4Init();

  return (
    <RQProvider>
      <AppRouterProvider />
    </RQProvider>
  );
}

export default App;
