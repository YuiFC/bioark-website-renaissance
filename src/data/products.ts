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
  } as ProductDetailData;
};