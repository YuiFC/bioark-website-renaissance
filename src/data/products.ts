import { ShowcaseItem, featuredProducts, geneEditingProducts } from './showcase';

export interface ProductDetailData extends ShowcaseItem {
  catalogNumber: string;
  availability: string;
  listPrice: string;
  options: string[];
  keyFeatures: string[];
  storageStability: string;
  performanceData: string;
  manuals: string[];
  storeLink?: string;
}

// Combine all products and add detailed mock data
const allProducts: ProductDetailData[] = [
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
];

export const getProductBySlug = (slug: string): ProductDetailData | undefined => {
  return allProducts.find(p => p.link === `/products/${slug}`);
};