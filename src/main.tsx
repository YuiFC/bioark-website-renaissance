import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { BlogProvider } from './context/BlogProvider.tsx'
import { CartProvider } from './context/CartContext.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BlogProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </BlogProvider>
  </React.StrictMode>
);
