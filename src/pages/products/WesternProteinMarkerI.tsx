
import React from 'react';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';

const WesternProteinMarkerI = () => {
  return (
    <ProductDetailTemplate
      title="Western Protein Marker I (Exposure)"
      category="Reagents and Markers"
      catalogNumber="BAPM2086"
      availability="In Stock"
      listPrice="$45.00"
      options={[
        '250 μL',
        '500 μL'
      ]}
      description="Western Protein Marker I is designed for protein size determination in Western blot applications. This marker provides clear, sharp bands that are easily visualized under standard exposure conditions."
      keyFeatures={[
        'Clear band visualization',
        'Precise molecular weight determination',
        'Compatible with standard Western blot protocols',
        'Long shelf life',
        'Ready-to-use format'
      ]}
      storageStability="Store at -20°C. Stable for 24 months when stored properly. Can be stored at 4°C for short-term use."
      performanceData="Provides accurate molecular weight standards from 10-250 kDa. Consistent band intensity and clarity."
      manuals={[
        'Product Manual (PDF)',
        'Western Blot Protocol (PDF)'
      ]}
      mainImage="/lovable-uploads/219e0265-4771-4a23-8849-a50f86f7aa95.png"
    />
  );
};

export default WesternProteinMarkerI;
