
import React from 'react';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';

const SybrGreenQpcrMasterMix = () => {
  return (
    <ProductDetailTemplate
      title="2 × SYBR Green qPCR Master Mix"
      category="Reagents and Markers"
      catalogNumber="BSY3320"
      availability="In Stock"
      listPrice="$89.00"
      options={[
        '1 mL (None ROX)',
        '1 mL (Low ROX)',
        '1 mL (High ROX)'
      ]}
      description="Our SYBR Green qPCR Master Mix is a reliable and cost-effective reagent for quantitative PCR applications. This formulation provides excellent sensitivity and reproducibility for gene expression analysis."
      keyFeatures={[
        'High sensitivity and specificity',
        'Excellent reproducibility',
        'Ready-to-use 2X concentrated mix',
        'Compatible with most qPCR instruments',
        'Cost-effective solution'
      ]}
      storageStability="Store at -20°C. Stable for 12 months when stored properly. Avoid repeated freeze-thaw cycles."
      performanceData="Consistent performance across various gene targets. Reliable amplification efficiency and linearity."
      manuals={[
        'Product Manual (PDF)',
        'Protocol Guide (PDF)',
        'Troubleshooting Guide (PDF)'
      ]}
      mainImage="/lovable-uploads/54707b79-b255-48c7-a5f9-20579adb82c3.png"
      storeLink="https://store.bioarktech.com/products/bsy3320-sybr-green-qpcr-master-mix"
    />
  );
};

export default SybrGreenQpcrMasterMix;
