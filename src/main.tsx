import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '/src/components/ThemeProvider.tsx'
import { BlogProvider } from '/src/context/BlogProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="bioark-ui-theme">
      <BlogProvider>
        <App />
      </BlogProvider>
    </ThemeProvider>
  </React.StrictMode>
);
