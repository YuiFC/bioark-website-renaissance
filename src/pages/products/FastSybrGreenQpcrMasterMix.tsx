
import React from 'react';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';

const FastSybrGreenQpcrMasterMix = () => {
  return (
    <ProductDetailTemplate
      title="2 × Fast SYBR Green qPCR Master Mix"
      category="Reagents and Markers"
      catalogNumber="BSY3323"
      availability="In Stock"
      listPrice="$99.00"
      options={[
        '1 mL (None ROX)',
        '1 mL (Low ROX)',
        '1 mL (High ROX)'
      ]}
      description="Our Fast SYBR Green qPCR Master Mix is a high-performance reagent designed for rapid and accurate quantitative PCR applications. This optimized formulation provides exceptional sensitivity and specificity for your gene expression studies."
      keyFeatures={[
        'Fast cycling protocol compatible',
        'High sensitivity and specificity',
        'Consistent performance across different templates',
        'Ready-to-use 2X concentrated mix',
        'Compatible with most qPCR instruments'
      ]}
      storageStability="Store at -20°C. Stable for 12 months when stored properly. Avoid repeated freeze-thaw cycles."
      performanceData="Validated with various gene targets and sample types. Ct values typically 0.5-1 cycle earlier than competitor products."
      manuals={[
        'Product Manual (PDF)',
        'Protocol Guide (PDF)',
        'Troubleshooting Guide (PDF)'
      ]}
      mainImage="/images/1-BSY3323_2__Fast_SYBR_Green_qPCR_Master_Mix-300x300.jpg"
      storeLink="https://store.bioarktech.com/products/bsy3323-fast-sybr-green-qpcr-master-mix"
    />
  );
};

export default FastSybrGreenQpcrMasterMix;
