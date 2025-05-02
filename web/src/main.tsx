import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './common/style/global.css';
import App from './App.tsx';
import './common/i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
