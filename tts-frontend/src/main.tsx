// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import TtsComponent from './TtsComponent';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto Mono, monospace',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <TtsComponent />
    </React.StrictMode>
  </ThemeProvider>
);
