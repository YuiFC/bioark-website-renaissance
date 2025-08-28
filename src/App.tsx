import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Import all page components
import HomePage from './pages/HomePage';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import RequestQuote from './pages/RequestQuote';
import Investors from './pages/Investors';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CreatePost from './pages/CreatePost';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import ProductDetailUI from './pages/ProductDetailUI';
import Design from './pages/Design';

// Import global styles
import './index.css';

export default function App() {
  return (
    <Router>
      <ScrollToTop behavior="smooth" />
      <Routes>
  {/* Fix: add routes for every navbar link */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
  <Route path="/p/:slug-ui" element={<ProductDetailUI />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/investors" element={<Investors />} />
  <Route path="/why-bioark" element={<About />} />
  <Route path="/about" element={<Navigate to="/why-bioark" replace />} />
        <Route path="/contact" element={<Contact />} />
  <Route path="/design" element={<Design />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog/new" element={<CreatePost />} />
  <Route path="/admin" element={<Admin />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/cart" element={<Cart />} />

  {/* Fix: use custom 404 page component */}
  <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}