
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { getAllServices } from '@/data/services';
import { normalizeCategory, PRODUCT_CATEGORIES } from '@/lib/productCategory';
import { fetchJson, getApiBase } from '@/lib/api';
import { useLiveProducts } from '@/hooks/useLiveProducts';

function displayTitle(raw: string): string {
  const t = (raw || '').trim();
  if (t.length <= 68) return t;
  return t.slice(0, 65) + '…';
}

interface PublicProductsConfig {
  version: number;
  products: any[];
  overrides: Record<string, any>;
  hidden: string[];
  details?: Record<string, any>;
}

async function loadPublicProductsWithFallback(): Promise<PublicProductsConfig | null> {
  const base = getApiBase().replace(/\/$/, '');
  // 优先使用 fetchJson 处理 token 与自动拼接 /api
  const attempts: (() => Promise<PublicProductsConfig>)[] = [
    () => fetchJson<PublicProductsConfig>('/public/products'), // -> base + /api/public/products (如果 base 不以 /api 结尾)
    () => fetchJson<PublicProductsConfig>('/api/public/products'),
    // 绝对地址（绕过 fetchJson 逻辑）
    async () => {
      const r = await fetch(`${base}/api/public/products`, { headers: { 'Accept': 'application/json' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return (await r.json()) as PublicProductsConfig;
    },
    async () => {
      const r = await fetch(`${base}/public/products`, { headers: { 'Accept': 'application/json' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return (await r.json()) as PublicProductsConfig;
    },
  ];
  for (const run of attempts) {
    try {
      const data = await run();
      if (data && Array.isArray(data.products)) return data;
    } catch (e) {
      console.warn('[products-nav] fetch attempt failed:', e);
    }
  }
  return null;
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none line-clamp-2">{title}</div>
          {children ? (
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{children}</p>
          ) : null}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.length;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const live = useLiveProducts();
  const cfg: PublicProductsConfig | null = React.useMemo(()=>{
    if (!live || !live.ordered.length) return { version: live.version||1, products: [], overrides: {}, hidden: [] } as any;
    // Flatten to products-like structure expected by existing grouping logic
    const products:any[] = [];
    for (const cat of live.ordered){
      const list = live.categories[cat] || [];
      list.forEach(p => products.push({ id: p.id, name: p.name, link: p.link, category: cat, createdAt: p.createdAt }));
    }
    return { version: live.version||1, products, overrides: {}, hidden: [] };
  }, [live]);
  const loadError = !!live.error;

  type NavEntry = { id: string; title: string; href: string; createdAt?: number };
  const { grouped, orderedCats } = React.useMemo(() => {
    const grouped: Record<string, NavEntry[]> = {};
  if (!cfg) return { grouped, orderedCats: [] as string[] };
    const hidden = new Set(cfg.hidden || []);
    const list = Array.isArray(cfg.products) ? cfg.products : [];
    list.forEach(p => {
      if (!p || hidden.has(p.id)) return;
      const link = p.link || '';
      if (!link.startsWith('/products/')) return;
      const cat = normalizeCategory(p.category);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ id: p.id, title: displayTitle(p.name || '—'), href: link, createdAt: p.createdAt });
    });
    Object.keys(grouped).forEach(c => {
      grouped[c] = grouped[c].slice().sort((a, b) => (Number(a.createdAt || 0) < Number(b.createdAt || 0) ? 1 : -1));
    });
    const orderedCats = [
      ...PRODUCT_CATEGORIES.filter(c => grouped[c] && grouped[c].length),
      ...Object.keys(grouped).filter(c => !PRODUCT_CATEGORIES.includes(c as any)),
    ];
    return { grouped, orderedCats };
  }, [cfg]);

  const [activeCat, setActiveCat] = React.useState<string>('');
  React.useEffect(() => {
    if (!activeCat || !grouped[activeCat]) {
      const first = orderedCats[0];
      if (first) setActiveCat(first);
    }
  }, [orderedCats.join('|')]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBackgroundClass = scrolled
    ? 'bg-[hsl(var(--header-footer-background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--header-footer-background))]/80 border-b'
    : 'bg-[hsl(var(--header-footer-background))]';

  const toggleMenu = () => setIsMenuOpen(o => !o);
  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-[hsl(var(--header-footer-foreground))] ${navBackgroundClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}images/Logo-Transparent.png`} alt="BioArk Technologies Logo" className="h-10 w-auto md:h-11" />
            <span className="hidden sm:inline text-[17px] md:text-lg font-semibold tracking-tight leading-none text-inherit">BioArk Technologies</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-[220px_minmax(400px,1fr)] gap-6 p-4 w-[860px] lg:w-[980px]">
                      <ul className="space-y-1 pr-2 border-r min-h-[260px]">
                        {!cfg && !loadError && (
                          <li className="text-sm text-muted-foreground px-2 py-1">Loading…</li>
                        )}
                        {loadError && !orderedCats.length && (
                          <li className="text-sm text-destructive px-2 py-1 space-y-1">
                            <div>加载失败</div>
                            <button onClick={() => live.reload?.()} className="text-xs underline text-primary">重试</button>
                          </li>
                        )}
                        {orderedCats.map(c => {
                          const count = grouped[c]?.length || 0;
                          return (
                            <li key={c}>
                              <button
                                type="button"
                                onMouseEnter={() => setActiveCat(c)}
                                onFocus={() => setActiveCat(c)}
                                className={cn('w-full text-left px-3 py-2 rounded-md text-sm transition-colors', activeCat === c ? 'bg-primary/10 text-primary' : 'hover:bg-muted')}
                              >
                                {c}<span className="ml-2 text-[11px] text-muted-foreground/70">{count}</span>
                              </button>
                            </li>
                          );
                        })}
                        {cfg && !orderedCats.length && !loadError && (
                          <li className="text-sm text-muted-foreground px-2 py-1">暂无分类</li>
                        )}
                      </ul>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 pr-1 min-h-[260px]">
                        {!cfg && !loadError && (
                          <div className="col-span-full text-sm text-muted-foreground px-2 py-1">加载中…</div>
                        )}
                        {cfg && activeCat && grouped[activeCat] && grouped[activeCat].length === 0 && (
                          <div className="col-span-full text-sm text-muted-foreground px-2 py-1">该分类暂无产品</div>
                        )}
                        {grouped[activeCat]?.map(it => (
                          <ListItem key={it.href} title={it.title} href={it.href} className="space-y-0 p-1.5 lg:p-2 rounded-sm" />
                        ))}
                        {loadError && (
                          <div className="col-span-full text-sm text-destructive px-2 py-1">无法获取产品数据</div>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {(() => {
                      const navServices = getAllServices().slice().sort((a, b) => (Number(a.createdAt || 0) < Number(b.createdAt || 0) ? 1 : -1));
                      return (
                        <ul className="grid w-[360px] gap-3 p-4 md:w-[440px] md:grid-cols-2 lg:w-[520px]">
                          {navServices.map(s => (
                            <ListItem key={s.id} title={s.name} href={s.link}>
                              {s.description}
                            </ListItem>
                          ))}
                        </ul>
                      );
                    })()}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link to="/design" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/design') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Design</Link>
            <Link to="/blog" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/blog') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Blog</Link>
            <Link to="/investors" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/investors') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Investors</Link>
            <Link to="/why-bioark" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/why-bioark') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Why BioArk</Link>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <Button asChild size="sm"><Link to="/request-quote">Request Quote</Link></Button>
              <Link to="/cart" className="relative p-2 rounded-md text-inherit opacity-80 hover:text-primary hover:opacity-100 transition-colors duration-200" title="Shopping Cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[11px] leading-[18px] text-center font-semibold tabular-nums">{cartCount > 99 ? '99+' : cartCount}</span>}
              </Link>
            </div>
          </div>
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>{isMenuOpen ? <X size={20} /> : <Menu size={20} />}</Button>
          </div>
        </div>
        {/* Backdrop for mobile menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 top-16 bg-black/30 backdrop-blur-[1px] lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-[hsl(var(--header-footer-background))] border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/') ? 'text-primary bg-muted' : 'text-inherit opacity-90 hover:text-primary hover:bg-muted/60'}`}>Home</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/products') ? 'text-primary bg-muted' : 'text-inherit opacity-90 hover:text-primary hover:bg-muted/60'}`}>Products</Link>
              <Link to="/services" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/services') ? 'text-primary bg-muted' : 'text-inherit opacity-90 hover:text-primary hover:bg-muted/60'}`}>Services</Link>
              <Link to="/design" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/design') ? 'text-primary bg-muted' : 'text-inherit opacity-90 hover:text-primary hover:bg-muted/60'}`}>Design</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/blog') ? 'text-primary bg-muted' : 'text-inherit opacity-90 hover:text-primary hover:bg-muted/60'}`}>Blog</Link>
              <Link to="/investors" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/investors') ? 'text-primary bg-muted' : 'text-inherit opacity-90 hover:text-primary hover:bg-muted/60'}`}>Investors</Link>
              <Link to="/why-bioark" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/why-bioark') ? 'text-primary bg-muted' : 'text-inherit opacity-90 hover:text-primary hover:bg-muted/60'}`}>Why BioArk</Link>
              <div className="px-3 pt-4"><Button asChild className="w-full"><Link to="/request-quote" onClick={() => setIsMenuOpen(false)}>Request Quote</Link></Button></div>
              <div className="border-t border-border mt-2 pt-2">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Store</p>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-inherit opacity-90 hover:text-primary hover:bg-muted/60 transition-colors duration-200">
                  <ShoppingCart size={16} />
                  <span>Shopping Cart</span>
                  {cartCount > 0 && <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[11px] leading-[18px] text-center font-semibold tabular-nums">{cartCount > 99 ? '99+' : cartCount}</span>}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
