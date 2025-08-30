
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
      description={
        '2× SYBR Green qPCR Master Mix (None ROX) is a special 2× premix for qPCR reaction using SYBR Green I chimeric fluorescence method, which contains all qPCR components except primers and DNA templates, which can reduce the operation steps, shorten the time of adding samples, and reduce the chance of contamination. The core component is genetically engineered hot-start Taq DNA Polymerase, which effectively seals off DNA polymerase activity and prevents non-specific amplification at low temperatures by efficiently combining monoclonal antibody and Taq DNA Polymerase, with many advantages such as high specificity and high sensitivity, and is coupled with a reaction buffer optimized for qPCR. It is very suitable for high specificity and high sensitivity qPCR reaction. This product is a 2× premixed reagent containing the optimal concentration of SYBR Green I for qPCR reaction, which can obtain a good standard curve in a wide quantification area, accurate quantification of target genes, good reproducibility and high confidence.'
      }
      keyFeatures={[
        'Easy to use: 2× premixed, requires only primers and DNA, reducing contamination risk.',
        'High accuracy: Hot-start Taq polymerase prevents non-specific amplification.',
        'Reliable results: Optimized buffer ensures accurate quantification and reproducibility.'
      ]}
      storageStability={
        'Ship with wet ice. Store at -20°C without light, valid for 12 months. Avoid freeze-thaw cycles. After thawing, it can be stably stored at 4°C for one month without light.'
      }
      performanceData={
        'Zhuang, H., et al. Cartilage-targeting peptide-modified cerium oxide nanoparticles alleviate oxidative stress and cartilage damage in osteoarthritis. J Nanobiotechnology 22, 784 (2024). PMID 39702137 IF 10.2\n'
        + 'Liu, S., et al. Therapeutic biomaterials with liver X receptor agonists based on the horizon of material biology to regulate atherosclerotic plaque regression in situ for devices surface engineering. Regen Biomater 11, rbae089 (2024). PMID 39165884 IF 6.7\n'
        + 'Huang, M., et al. 3-Hydroxybutyrate ameliorates sepsis-associated acute lung injury by promoting autophagy through the activation of GPR109α in macrophages. Biochemical Pharmacology 213, 115632 (2023). PMID 37263300 IF 5.8\n'
        + 'Sun, W., et al. 4-Iodo-6-phenylpyrimidine (4-IPP) suppresses fibroblast-like synoviocyte-mediated inflammation and joint destruction associated with rheumatoid arthritis. International Immunopharmacology 115, 109714 (2023). PMID 36657337 IF 5.6\n'
        + 'Zhou, Y., et al. Guominkang formula alleviate inflammation in eosinophilic asthma by regulating immune balance of Th1/2 and Treg/Th17 cells. Front Pharmacol 13, 978421 (2022). PMID 36330091 IF 5.6\n'
        + 'Liu, Y.-Y., et al. Pilose antler (Cervus elaphus Linnaeus) polysaccharide and polypeptide extract inhibits bone resorption in high turnover type osteoporosis by stimulating the MAKP and MMP-9 signaling pathways. Journal of Ethnopharmacology 304, 116052 (2023). PMID 36529246 IF 5.4\n'
        + 'Li, M., et al. Atorvastatin calcium alleviates UVB-induced HaCat cell senescence and skin photoaging. Sci Rep 14, 30010 (2024). PMID 39622974 IF 4.6\n'
        + 'Zhu, J., et al. Molybdenum and cadmium co-induce apoptosis and ferroptosis through inhibiting Nrf2 signaling pathway in duck (Anas platyrhyncha) testes. Poult Sci 24, 103653 (2024). PMID 38537407 IF 4.4\n'
        + 'Zhuang, H., et al. Trimethylamine-N-oxide sensitizes chondrocytes to mechanical loading through the upregulation of Piezo1. Food and Chemical Toxicology 175, 113726 (2023). PMID 36925039 IF 4.3'
      }
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
