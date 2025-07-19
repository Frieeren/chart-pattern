import { useGA4Init } from '@web/shared/hooks/useGA';
import { RQProvider } from '@web/shared/providers/RQProvider';
import { AppRouterProvider } from '@web/shared/providers/RouterProvider';
import { useChannelIOInit } from './shared/hooks/useChannelIO';

function App() {
  useGA4Init();
  useChannelIOInit();

  return (
    <RQProvider>
      <AppRouterProvider />
    </RQProvider>
  );
}

export default App;
