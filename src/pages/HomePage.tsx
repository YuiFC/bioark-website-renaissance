import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedSections from '../components/FeaturedSections';
import { fetchJson } from '@/lib/api';

const HomePage = () => {
  React.useEffect(()=>{ fetchJson('/metrics/hit').catch(()=>{}); },[]);
  return (
    <Layout>
      <Hero />
      <FeaturedSections />
    </Layout>
  );
};

export default HomePage;