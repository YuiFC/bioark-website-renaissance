import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 引入所有页面组件
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

// 引入全局样式
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 修复：为导航栏中的每个链接添加对应的路由 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog/new" element={<CreatePost />} />

        {/* 修复：使用您设计好的 404 页面组件 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}