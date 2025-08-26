import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedSections from '../components/FeaturedSections';

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedSections />
    </Layout>
  );
};

export default HomePage;