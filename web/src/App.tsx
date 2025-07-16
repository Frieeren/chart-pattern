import { useGA4Init } from '@web/shared/hooks/useGA';
import { RQProvider } from '@web/shared/providers/RQProvider';
import { AppRouterProvider } from '@web/shared/providers/RouterProvider';
import { useChannelIO } from './shared/hooks/useChannelIO';

function App() {
  useGA4Init();
  useChannelIO();

  return (
    <RQProvider>
      <AppRouterProvider />
    </RQProvider>
  );
}

export default App;
