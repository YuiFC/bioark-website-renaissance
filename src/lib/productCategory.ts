export type ProductCategory = 'Reagents and Markers' | 'Genome Editing' | 'Vector Clones' | 'Stable Cell Lines' | 'Lentivirus';

// 映射后端/存储中的内部标识到显示名称
const internalToDisplay: Record<string, ProductCategory> = {
  'reagents-markers': 'Reagents and Markers',
  'genome-editing': 'Genome Editing',
  'vector-clones': 'Vector Clones',
  'stable-cell-lines': 'Stable Cell Lines',
  'lentivirus': 'Lentivirus'
};

// 反向映射 (如果需要提交到后端)
const displayToInternal: Record<ProductCategory, string> = Object.fromEntries(
  Object.entries(internalToDisplay).map(([k,v]) => [v, k])
) as Record<ProductCategory, string>;

export function normalizeCategory(raw: string | undefined | null): ProductCategory {
  if (!raw) return 'Reagents and Markers';
  const lower = raw.toLowerCase();
  if (internalToDisplay[lower]) return internalToDisplay[lower];
  // 允许直接传 display 名称
  const direct = (Object.keys(displayToInternal) as ProductCategory[]).find(d => d.toLowerCase() === lower);
  return direct || 'Reagents and Markers';
}

// 基于 catalog / id 推断类型（原逻辑集中）
export function inferCategoryByProduct(p: any): ProductCategory {
  const cat = normalizeCategory(p?.category);
  if (cat) return cat;
  // 回退: 通过 catalogNumber 前缀判断
  const catalog: string = String(p?.catalogNumber || p?.id || '').toUpperCase();
  if (catalog.startsWith('FP')) return 'Reagents and Markers';
  return 'Genome Editing';
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Reagents and Markers',
  'Genome Editing',
  'Vector Clones',
  'Stable Cell Lines',
  'Lentivirus'
];
