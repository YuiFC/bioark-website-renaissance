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
import { fetchJson } from './lib/api'

// Sync backend products-config to LocalStorage on app load (compat shim)
async function syncProductsConfigOnce(){
  try {
  const cfg = await fetchJson<any>('/products-config');
    // Mirror to legacy LocalStorage keys used by data/products.ts fallback
    localStorage.setItem('bioark_products', JSON.stringify(Array.isArray(cfg.products)?cfg.products:[]));
    localStorage.setItem('bioark_products_overrides', JSON.stringify(cfg.overrides&&typeof cfg.overrides==='object'?cfg.overrides:{}));
    localStorage.setItem('bioark_product_details_overrides', JSON.stringify(cfg.details&&typeof cfg.details==='object'?cfg.details:{}));
    localStorage.setItem('bioark_products_hidden', JSON.stringify(Array.isArray(cfg.hidden)?cfg.hidden:[]));
  } catch {}
}
void syncProductsConfigOnce();

// Sync backend services-config to LocalStorage on app load (compat shim)
async function syncServicesConfigOnce(){
  try {
    const cfg = await fetchJson<any>('/services-config');
    localStorage.setItem('bioark_services_overrides', JSON.stringify(cfg.overrides&&typeof cfg.overrides==='object'?cfg.overrides:{}));
    localStorage.setItem('bioark_services_custom', JSON.stringify(Array.isArray(cfg.custom)?cfg.custom:[]));
    localStorage.setItem('bioark_services_media_v2_paths', JSON.stringify(cfg.media&&typeof cfg.media==='object'?cfg.media:{}));
  } catch {}
}
void syncServicesConfigOnce();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BlogProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </BlogProvider>
  </React.StrictMode>
);
