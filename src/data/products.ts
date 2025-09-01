import { ShowcaseItem, featuredProducts, geneEditingProducts } from './showcase';

export interface ProductDetailData extends ShowcaseItem {
  catalogNumber: string;
  availability: string;
  listPrice: string;
  options: string[];
  optionPrices?: Record<string, string>;
  keyFeatures: string[];
  storageStability: string;
  performanceData: string;
  manuals: string[];
  manualUrls?: string[];
  storeLink?: string;
}

// Extra on-the-shelf products accessible via menu only (not shown on homepage)
const extraProducts: ProductDetailData[] = [
  {
    id: 'vc-01',
    name: 'cDNA Vector Stock',
    description: 'Ready-to-use cDNA vector stocks for cloning and expression workflows.',
    imageUrl: '/placeholder.svg',
    link: '/products/cdna-vector-stock',
    catalogNumber: 'VC-001',
    availability: 'In Stock',
    listPrice: 'Contact for Quote',
    options: [],
    keyFeatures: ['High-quality backbone', 'Multiple cloning sites', 'Sequence-verified'],
    storageStability: 'Store at -20°C. See manual for details.',
    performanceData: 'Validated for standard cloning workflows.',
    manuals: ['Vector Handbook (PDF)'],
    manualUrls: [],
  },
  {
    id: 'vc-02',
    name: 'Functional Vectors Kits Template',
    description: 'Templates for building functional vector kits with modular components.',
    imageUrl: '/placeholder.svg',
    link: '/products/functional-vectors-kits-template',
    catalogNumber: 'VC-002',
    availability: 'In Stock',
    listPrice: 'Contact for Quote',
    options: [],
    keyFeatures: ['Modular design', 'Customizable elements', 'Comprehensive documentation'],
    storageStability: 'Store at -20°C. See manual for details.',
    performanceData: 'Suitable for rapid kit assembly and iteration.',
    manuals: ['Template Guide (PDF)'],
    manualUrls: [],
  },
  {
    id: 'sc-01',
    name: 'Stable Cell Line Stock',
    description: 'Ready-to-use stable cell line stocks for research applications.',
    imageUrl: '/placeholder.svg',
    link: '/products/stable-cell-line-stock',
    catalogNumber: 'SC-001',
    availability: 'In Stock',
    listPrice: 'Contact for Quote',
    options: [],
    keyFeatures: ['Authenticated', 'Mycoplasma-tested', 'Application-ready'],
    storageStability: 'Store in liquid nitrogen or as specified.',
    performanceData: 'QC documentation available upon request.',
    manuals: ['Cell Line Handling Guide (PDF)'],
    manualUrls: [],
  },
  {
    id: 'lv-01',
    name: 'cDNA Lentivirus Stock',
    description: 'cDNA-expressing lentiviral stocks for gene delivery.',
    imageUrl: '/placeholder.svg',
    link: '/products/cdna-lentivirus-stock',
    catalogNumber: 'LV-001',
    availability: 'In Stock',
    listPrice: 'Contact for Quote',
    options: [],
    keyFeatures: ['High titer', 'Sterile filtered', 'QC validated'],
    storageStability: 'Store at -80°C. Avoid repeated freeze-thaw cycles.',
    performanceData: 'Infectivity verified in standard cell lines.',
    manuals: ['Lentivirus User Guide (PDF)'],
    manualUrls: [],
  },
  {
    id: 'lv-02',
    name: 'Lentivirus Control Stock',
    description: 'Control lentiviral stocks for assay validation and benchmarking.',
    imageUrl: '/placeholder.svg',
    link: '/products/lentivirus-control-stock',
    catalogNumber: 'LV-002',
    availability: 'In Stock',
    listPrice: 'Contact for Quote',
    options: [],
    keyFeatures: ['Positive/negative controls', 'Consistent titers', 'Ready-to-use'],
    storageStability: 'Store at -80°C. Avoid repeated freeze-thaw cycles.',
    performanceData: 'Validated for use across common cell lines.',
    manuals: ['Control Stock Guide (PDF)'],
    manualUrls: [],
  },
];

// Combine all products and add detailed mock data
const allProducts: ProductDetailData[] = [
  ...extraProducts,
  ...featuredProducts.map((p, i) => ({
    ...p,
    catalogNumber: `FP-00${i + 1}`,
    availability: 'In Stock',
    listPrice: `$${(Math.random() * 200 + 50).toFixed(2)}`,
    options: ['1 mL', '5 mL', '10 mL'],
    keyFeatures: [
      'High-performance formulation',
      'Optimized for rapid results',
      'Exceptional sensitivity and specificity',
      'Ready-to-use 2X concentrated mix',
    ],
    storageStability: 'Stable for 12 months at -20°C. Avoid repeated freeze-thaw cycles.',
    performanceData: 'Validated across a wide dynamic range of target concentrations.',
    manuals: ['Product Manual (PDF)', 'Safety Data Sheet (SDS)'],
    storeLink: 'https://store.bioarktech.com/cart',
  })),
  ...geneEditingProducts.map((p, i) => ({
    ...p,
    catalogNumber: `GEP-00${i + 1}`,
    availability: 'In Stock',
    listPrice: `$${(Math.random() * 500 + 150).toFixed(2)}`,
    options: ['Standard Kit', 'Pro Kit'],
    keyFeatures: [
      'High-purity components for robust genome editing',
      'Complete systems for high-titer virus production',
      'Scalable solutions for manufacturing',
      'Custom-designed for targeted gene editing',
    ],
    storageStability: 'Store components at specified temperatures. See manual for details.',
    performanceData: 'Consistently high efficiency and low off-target effects reported in publications.',
    manuals: ['Protocol Guide (PDF)', 'Troubleshooting (PDF)'],
    storeLink: 'https://store.bioarktech.com/cart',
  })),
].map((p) => {
  // Apply real content overrides for specific catalog items shown in the Products detail route
  if (p.id === 'fp-bsy3323') {
    return {
      ...p,
      name: '2 × Fast SYBR Green qPCR Master Mix',
      catalogNumber: 'BSY3323',
      options: ['1 mL (None ROX)', '1 mL (Low ROX)', '1 mL (High ROX)'],
      description:
        '2× Fast SYBR Green qPCR Master Mix (None ROX) is a special 2× premix for qPCR reaction using SYBR Green I chimeric fluorescence method, which contains all qPCR components except primers and DNA templates, which can reduce the operation steps, shorten the time of adding samples, and reduce the chance of contamination. The core component is genetically engineered hot-start Taq DNA Polymerase, which effectively seals off DNA polymerase activity and prevents non-specific amplification at low temperatures by efficiently combining monoclonal antibody and Taq DNA Polymerase, with many advantages such as high specificity and high sensitivity and is coupled with a reaction buffer optimized for qPCR. It is very suitable for high specificity and high sensitivity qPCR reaction. This product is a 2× premixed reagent containing the optimal concentration of SYBR Green I for qPCR reaction, which can obtain a good standard curve in a wide quantitative region, accurate quantification of target genes, good reproducibility, high confidence, and the fastest qPCR reaction can be completed in 30 minutes.',
      keyFeatures: [
        'Fast & easy: 2× premixed, requires only primers and DNA, completing qPCR in 30 minutes.',
        'High precision: Hot-start Taq polymerase prevents non-specific amplification.',
        'Reliable results: Optimized buffer ensures accurate quantification and good reproducibility.',
      ],
      storageStability:
        'Ship with wet ice. Store at -20°C without light, valid for 12 months. Avoid freeze-thaw cycles. After thawing, it can be stably stored at 4℃ for one month without light.',
      performanceData:
        'Validated with various gene targets and sample types. Ct values typically 0.5-1 cycle earlier than competitor products.',
      manuals: ['Product Manual (PDF)', 'Protocol Guide (PDF)', 'Troubleshooting Guide (PDF)'],
      storeLink: 'https://store.bioarktech.com/products/bsy3323-fast-sybr-green-qpcr-master-mix',
    } as ProductDetailData;
  }
  if (p.id === 'fp-bsy3320') {
    return {
      ...p,
      name: '2 × SYBR Green qPCR Master Mix',
      catalogNumber: 'BSY3320',
      options: ['1 mL (None ROX)', '1 mL (Low ROX)', '1 mL (High ROX)'],
      description:
        '2× SYBR Green qPCR Master Mix (None ROX) is a special 2× premix for qPCR reaction using SYBR Green I chimeric fluorescence method, which contains all qPCR components except primers and DNA templates, which can reduce the operation steps, shorten the time of adding samples, and reduce the chance of contamination. The core component is genetically engineered hot-start Taq DNA Polymerase, which effectively seals off DNA polymerase activity and prevents non-specific amplification at low temperatures by efficiently combining monoclonal antibody and Taq DNA Polymerase, with many advantages such as high specificity and high sensitivity, and is coupled with a reaction buffer optimized for qPCR. It is very suitable for high specificity and high sensitivity qPCR reaction. This product is a 2× premixed reagent containing the optimal concentration of SYBR Green I for qPCR reaction, which can obtain a good standard curve in a wide quantification area, accurate quantification of target genes, good reproducibility and high confidence.',
      keyFeatures: [
        'Easy to use: 2× premixed, requires only primers and DNA, reducing contamination risk.',
        'High accuracy: Hot-start Taq polymerase prevents non-specific amplification.',
        'Reliable results: Optimized buffer ensures accurate quantification and reproducibility.',
      ],
      storageStability:
        'Ship with wet ice. Store at -20°C without light, valid for 12 months. Avoid freeze-thaw cycles. After thawing, it can be stably stored at 4°C for one month without light.',
      performanceData: `Zhuang, H., et al. Cartilage-targeting peptide-modified cerium oxide nanoparticles alleviate oxidative stress and cartilage damage in osteoarthritis. J Nanobiotechnology 22, 784 (2024). PMID 39702137 IF 10.2
Liu, S., et al. Therapeutic biomaterials with liver X receptor agonists based on the horizon of material biology to regulate atherosclerotic plaque regression in situ for devices surface engineering. Regen Biomater 11, rbae089 (2024). PMID 39165884 IF 6.7
Huang, M., et al. 3-Hydroxybutyrate ameliorates sepsis-associated acute lung injury by promoting autophagy through the activation of GPR109α in macrophages. Biochemical Pharmacology 213, 115632 (2023). PMID 37263300 IF 5.8
Sun, W., et al. 4-Iodo-6-phenylpyrimidine (4-IPP) suppresses fibroblast-like synoviocyte-mediated inflammation and joint destruction associated with rheumatoid arthritis. International Immunopharmacology 115, 109714 (2023). PMID 36657337 IF 5.6
Zhou, Y., et al. Guominkang formula alleviate inflammation in eosinophilic asthma by regulating immune balance of Th1/2 and Treg/Th17 cells. Front Pharmacol 13, 978421 (2022). PMID 36330091 IF 5.6
Liu, Y.-Y., et al. Pilose antler (Cervus elaphus Linnaeus) polysaccharide and polypeptide extract inhibits bone resorption in high turnover type osteoporosis by stimulating the MAKP and MMP-9 signaling pathways. Journal of Ethnopharmacology 304, 116052 (2023). PMID 36529246 IF 5.4
Li, M., et al. Atorvastatin calcium alleviates UVB-induced HaCat cell senescence and skin photoaging. Sci Rep 14, 30010 (2024). PMID 39622974 IF 4.6
Zhu, J., et al. Molybdenum and cadmium co-induce apoptosis and ferroptosis through inhibiting Nrf2 signaling pathway in duck (Anas platyrhyncha) testes. Poult Sci 24, 103653 (2024). PMID 38537407 IF 4.4
Zhuang, H., et al. Trimethylamine-N-oxide sensitizes chondrocytes to mechanical loading through the upregulation of Piezo1. Food and Chemical Toxicology 175, 113726 (2023). PMID 36925039 IF 4.3`,
      manuals: ['Product Manual (PDF)', 'Protocol Guide (PDF)', 'Troubleshooting Guide (PDF)'],
      storeLink: 'https://store.bioarktech.com/products/bsy3320-sybr-green-qpcr-master-mix',
    } as ProductDetailData;
  }
  if (p.id === 'fp-bapm2086') {
    return {
      ...p,
      name: 'Western Protein Marker I (Exposure)',
      catalogNumber: 'BAPM2086',
      availability: 'In Stock',
      listPrice: '$59.00',
      options: ['250 μL', '2 × 250 μL', '3 × 250 μL'],
      // @ts-ignore augment optional field at runtime
      optionPrices: {
        '250 μL': '$48.00',
        '2 × 250 μL': '$91.00',
        '3 × 250 μL': '$139.00',
      } as any,
      description:
        'Western Protein Marker I consists of eight high-purity recombinant proteins and two pre-stained recombinant proteins, which is convenient for monitoring of electrophoresis and transfer efficiency. It is suitable as a protein molecular weight standard for SDS-PAGE and Western Blot.\n\nThe bands display in Tris-Glycine gel range from 15-154 kDa (~12, ~22, ~28, ~38, ~50, ~62, ~70, ~78, ~113, ~154 kDa), with orange-red band at 70 kDa, blue band at 12 kDa, and the others can bind almost all types of antibodies (except chicken antibodies). Western Protein Marker I can bind the antibody to the target protein at the same time and develop color by ECL or other methods.',
      keyFeatures: [
        'Ten bands: ~12, ~22, ~28, ~38, ~50, ~62, ~70, ~78, ~113, ~154 kDa',
        'Color markers: orange-red at 70 kDa, blue at 12 kDa',
      ],
      storageStability: 'Ship with wet ice; Store at -20°C; Valid for 12 months.',
      performanceData:
        'Zhang, N., et al. High expression of peroxisomal D-bifunctional protein in cytosol regulates apoptosis and energy metabolism of hepatocellular carcinoma cells via PI3K/AKT pathway. Am J Cancer Res 13, 1884-1903 (2023). PMID 37293151 IF 5.3\nQiu, P., et al. SPI1 Mediates N-Myristoyltransferase 1 to Advance Gastric Cancer Progression via PI3K/AKT/mTOR Pathway. Canadian Journal of Gastroenterology and Hepatology 2023, 2021515 (2023). PMID 36967718 IF 2.7',
      manuals: ['Product Manual (PDF)', 'Western Blot Protocol (PDF)'],
    } as ProductDetailData;
  }
  return p;
});

// Expose a readonly list of all catalog products for admin/management UIs
export const listAllProducts = (): ProductDetailData[] => {
  return allProducts.slice();
};

function readLS<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const getProductBySlug = (slug: string): ProductDetailData | undefined => {
  const path = `/products/${slug}`;
  // First, try to find from base catalog
  let base = allProducts.find(p => p.link === path);

  // If not found, try custom products from Admin (bioark_products)
  if (!base) {
    const customList = readLS<any[]>('bioark_products', []);
    const found = customList.find(p => p.link === path);
    if (found) {
      base = {
        id: found.id,
        name: found.name,
        description: found.description,
        imageUrl: found.imageUrl,
        link: found.link,
        catalogNumber: '',
        availability: 'In Stock',
        listPrice: '',
        options: [],
        keyFeatures: [],
        storageStability: '',
        performanceData: '',
        manuals: [],
        storeLink: 'https://store.bioarktech.com/cart',
      };
    }
  }

  if (!base) return undefined;

  // Apply display overrides (name/description/imageUrl/link)
  const dispOv = readLS<Record<string, Partial<ProductDetailData>>>('bioark_products_overrides', {});
  const dispPatch = dispOv[base.id] || {};

  // Apply detailed field overrides (catalogNumber, options, etc.)
  const detOv = readLS<Record<string, Partial<ProductDetailData>>>('bioark_product_details_overrides', {});
  const detPatch = detOv[base.id] || {};

  return {
    ...base,
    ...dispPatch,
    ...detPatch,
    // Normalize arrays
    options: (detPatch.options ?? base.options) || [],
    keyFeatures: (detPatch.keyFeatures ?? base.keyFeatures) || [],
    manuals: (detPatch.manuals ?? base.manuals) || [],
  manualUrls: (detPatch as any).manualUrls ?? (base as any).manualUrls,
  optionPrices: (detPatch as any).optionPrices ?? (base as any).optionPrices,
  } as ProductDetailData;
};