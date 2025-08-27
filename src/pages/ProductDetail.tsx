
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';
import { getProductBySlug } from '@/data/products';
import NotFound from './NotFound';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const productData = slug ? getProductBySlug(slug) : undefined;

  if (!productData) {
    return <NotFound />;
  }

  // The category is not in the data, so we'll derive it or set a default
  const category = productData.catalogNumber.startsWith('FP') 
    ? 'Reagents and Markers' 
    : 'Genome Editing';

  return <ProductDetailTemplate {...productData} title={productData.name} category={category} mainImage={productData.imageUrl || ''} />;
};

export default ProductDetail;
