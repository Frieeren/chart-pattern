import { RQProvider } from '@web/shared/providers/RQProvider';
import { AppRouterProvider } from '@web/shared/providers/RouterProvider';

function App() {
  return (
    <RQProvider>
      <AppRouterProvider />
    </RQProvider>
  );
}

export default App;
