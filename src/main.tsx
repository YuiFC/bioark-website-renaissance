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

// Sync backend products-config to LocalStorage on app load (compat shim)
async function syncProductsConfigOnce(){
  try {
    const base = (import.meta as any).env?.VITE_API_BASE || (window as any).BIOARK_API_BASE || 'http://localhost:4242';
    const res = await fetch(`${base}/api/products-config`);
    if (!res.ok) return;
    const cfg = await res.json();
    // Mirror to legacy LocalStorage keys used by data/products.ts fallback
    localStorage.setItem('bioark_products', JSON.stringify(Array.isArray(cfg.products)?cfg.products:[]));
    localStorage.setItem('bioark_products_overrides', JSON.stringify(cfg.overrides&&typeof cfg.overrides==='object'?cfg.overrides:{}));
    localStorage.setItem('bioark_product_details_overrides', JSON.stringify(cfg.details&&typeof cfg.details==='object'?cfg.details:{}));
    localStorage.setItem('bioark_products_hidden', JSON.stringify(Array.isArray(cfg.hidden)?cfg.hidden:[]));
  } catch {}
}
void syncProductsConfigOnce();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BlogProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </BlogProvider>
  </React.StrictMode>
);
