
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
      description={
        '2× Fast SYBR Green qPCR Master Mix (None ROX) is a special 2× premix for qPCR reaction using SYBR Green I chimeric fluorescence method, which contains all qPCR components except primers and DNA templates, which can reduce the operation steps, shorten the time of adding samples, and reduce the chance of contamination. The core component is genetically engineered hot-start Taq DNA Polymerase, which effectively seals off DNA polymerase activity and prevents non-specific amplification at low temperatures by efficiently combining monoclonal antibody and Taq DNA Polymerase, with many advantages such as high specificity and high sensitivity and is coupled with a reaction buffer optimized for qPCR. It is very suitable for high specificity and high sensitivity qPCR reaction. This product is a 2× premixed reagent containing the optimal concentration of SYBR Green I for qPCR reaction, which can obtain a good standard curve in a wide quantitative region, accurate quantification of target genes, good reproducibility, high confidence, and the fastest qPCR reaction can be completed in 30 minutes.'
      }
      keyFeatures={[
        'Fast & easy: 2× premixed, requires only primers and DNA, completing qPCR in 30 minutes.',
        'High precision: Hot-start Taq polymerase prevents non-specific amplification.',
        'Reliable results: Optimized buffer ensures accurate quantification and good reproducibility.'
      ]}
      storageStability={
        'Ship with wet ice. Store at -20°C without light, valid for 12 months. Avoid freeze-thaw cycles. After thawing, it can be stably stored at 4℃ for one month without light.'
      }
      performanceData="Validated with various gene targets and sample types. Ct values typically 0.5-1 cycle earlier than competitor products."
      manuals={[
        'Product Manual (PDF)',
        'Protocol Guide (PDF)',
        'Troubleshooting Guide (PDF)'
      ]}
      mainImage="/lovable-uploads/fa015458-3001-427a-b816-4db6868b7cf4.png"
      storeLink="https://store.bioarktech.com/products/bsy3323-fast-sybr-green-qpcr-master-mix"
    />
  );
};

export default FastSybrGreenQpcrMasterMix;
