
import React from 'react';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';

const WesternProteinMarkerI = () => {
  return (
    <ProductDetailTemplate
      title="Western Protein Marker I (Exposure)"
      category="Reagents and Markers"
      catalogNumber="BAPM2086"
      availability="In Stock"
      listPrice="$59.00"
      options={['250 μL', '2 × 250 μL', '3 × 250 μL']}
      optionPrices={{
        '250 μL': '$48.00',
        '2 × 250 μL': '$91.00',
        '3 × 250 μL': '$139.00'
      }}
      description={
        'Western Protein Marker I consists of eight high-purity recombinant proteins and two pre-stained recombinant proteins, which is convenient for monitoring of electrophoresis and transfer efficiency. It is suitable as a protein molecular weight standard for SDS-PAGE and Western Blot.\n\nThe bands display in Tris-Glycine gel range from 15-154 kDa (~12, ~22, ~28, ~38, ~50, ~62, ~70, ~78, ~113, ~154 kDa), with orange-red band at 70 kDa, blue band at 12 kDa, and the others can bind almost all types of antibodies (except chicken antibodies). Western Protein Marker I can bind the antibody to the target protein at the same time and develop color by ECL or other methods.'
      }
      keyFeatures={[
        'Ten bands: ~12, ~22, ~28, ~38, ~50, ~62, ~70, ~78, ~113, ~154 kDa',
        'Color markers: orange-red at 70 kDa, blue at 12 kDa'
      ]}
      storageStability={
        'Ship with wet ice; Store at -20°C; Valid for 12 months.'
      }
      performanceData={
        'Zhang, N., et al. High expression of peroxisomal D-bifunctional protein in cytosol regulates apoptosis and energy metabolism of hepatocellular carcinoma cells via PI3K/AKT pathway. Am J Cancer Res 13, 1884-1903 (2023). PMID 37293151 IF 5.3\nQiu, P., et al. SPI1 Mediates N-Myristoyltransferase 1 to Advance Gastric Cancer Progression via PI3K/AKT/mTOR Pathway. Canadian Journal of Gastroenterology and Hepatology 2023, 2021515 (2023). PMID 36967718 IF 2.7'
      }
      manuals={[
        'Product Manual (PDF)',
        'Western Blot Protocol (PDF)'
      ]}
      mainImage="/lovable-uploads/219e0265-4771-4a23-8849-a50f86f7aa95.png"
    />
  );
};

export default WesternProteinMarkerI;
