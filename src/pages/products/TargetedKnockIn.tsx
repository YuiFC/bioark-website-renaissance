
import React from 'react';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';

const TargetedKnockIn = () => {
  return (
    <ProductDetailTemplate
      title="Targeted Knock-In"
      category="Genome Editing"
      catalogNumber="GE001"
      availability="Custom Service"
      listPrice="Contact for Quote"
      options={[
        'Standard Knock-In Service',
        'Express Knock-In Service',
        'Custom Design Package'
      ]}
      description="Our Targeted Knock-In service provides precise insertion of DNA sequences at specific genomic locations using advanced CRISPR/Cas9 technology. This service enables researchers to introduce reporter genes, tags, or other genetic modifications with high precision."
      keyFeatures={[
        'High precision genome editing',
        'Custom guide RNA design',
        'Homology-directed repair optimization',
        'Multiple cell line compatibility',
        'Comprehensive validation included'
      ]}
      storageStability="Custom service - no storage requirements. Final products delivered with appropriate storage instructions."
      performanceData="Typical knock-in efficiency ranges from 10-50% depending on target site and cell line. Complete validation and characterization provided."
      manuals={[
        'Service Overview (PDF)',
        'Sample Submission Guidelines (PDF)',
        'Validation Report Template (PDF)'
      ]}
      mainImage="/images/Product-1-2-Gene-Knock-In-Tagging-300x227.jpg"
    />
  );
};

export default TargetedKnockIn;
