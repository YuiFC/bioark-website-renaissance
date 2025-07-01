
import React from 'react';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';

const BaPolyTransfectionReagent = () => {
  return (
    <ProductDetailTemplate
      title="BAPoly® In Vitro DNA Transfection Reagent"
      category="Reagents and Markers"
      catalogNumber="BATR001"
      availability="In Stock"
      listPrice="$129.00"
      options={[
        '0.5 mL',
        '1.0 mL',
        '2.5 mL'
      ]}
      description="BAPoly® is a highly efficient polymeric transfection reagent designed for delivering DNA into mammalian cells. This advanced formulation provides superior transfection efficiency with minimal cytotoxicity."
      keyFeatures={[
        'High transfection efficiency',
        'Low cytotoxicity',
        'Compatible with various cell lines',
        'Serum-compatible formulation',
        'Easy-to-use protocol'
      ]}
      storageStability="Store at 4°C. Stable for 12 months when stored properly. Do not freeze."
      performanceData="Demonstrates >80% transfection efficiency in HEK293 cells. Superior performance compared to traditional reagents."
      manuals={[
        'Product Manual (PDF)',
        'Transfection Protocol (PDF)',
        'Cell Line Compatibility Guide (PDF)'
      ]}
      mainImage="/images/BAPoly-1-300x300.png"
    />
  );
};

export default BaPolyTransfectionReagent;
