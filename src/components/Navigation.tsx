
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { featuredProducts, geneEditingProducts, customerSolutions } from '../data/showcase';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={props.href || '#'}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  // Dark mode removed; theme toggle no longer used

  const externalLinks = [
    { name: 'Shopping Cart', url: '/cart', icon: ShoppingCart },
  ];
  const [auth, setAuth] = useState<any>(() => { try { return JSON.parse(localStorage.getItem('bioark_auth_user')||'null'); } catch { return null; } });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  useEffect(()=>{
    const onStorage = () => {
      try { setAuth(JSON.parse(localStorage.getItem('bioark_auth_user')||'null')); } catch { setAuth(null); }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  },[]);
  const logout = () => {
    localStorage.removeItem('bioark_auth_user');
    localStorage.removeItem('bioark_admin_token');
    setAuth(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // The navigation bar text should be light to be visible on the dark hero image.
  // The background appears on scroll, fixing the abrupt transition.
  const navBackgroundClass = isScrolled
    ? 'bg-[hsl(var(--header-footer-background))]/90 backdrop-blur-lg border-b border-border/20 shadow-sm'
    : 'bg-transparent';

  const displayTitle = (name: string) => {
    // Remove leading catalog like "BADM3362 – "
    let out = name.replace(/^\s*[A-Z0-9-]+\s*–\s*/i, '');
    // Remove trailing size like " (100-8000bp)" or " (8-200 kDa)"
    out = out.replace(/\s*\([^)]*(?:bp|kda)\)\s*$/i, '').trim();
    return out;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-[hsl(var(--header-footer-foreground))] ${navBackgroundClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={`${import.meta.env.BASE_URL}images/Logo-Transparent.png`}
              alt="BioArk Technologies Logo" 
              className="h-10 w-auto md:h-11"
            />
            <span className="hidden sm:inline text-[17px] md:text-lg font-semibold tracking-tight leading-none text-inherit">
              BioArk Technologies
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Products Dropdown (two-pane: categories -> items) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {
                      // Build two-pane menu: left shows top-level categories, right shows hovered category items
                    }
                    {(() => {
                      const categories = [
                        'Reagents and Markers',
                        'Genome Editing',
                        'Vector Clones',
                        'Stable Cell Lines',
                        'Lentivirus',
                      ] as const;
            const items: Record<string, {title:string; href:string}[]> = {
                        'Reagents and Markers': [
                          { title: 'GN8K DNA Marker', href: '/products/gn8k-dna-marker' },
                          { title: 'GN10K DNA Marker', href: '/products/gn10k-dna-marker' },
                          { title: 'GN15K DNA Marker', href: '/products/gn15k-dna-marker' },
              { title: 'BioArkLipo© In Vitro Transfection Kit (Ver.II)', href: '/products/bioarklipo-in-vitro-transfection-kit' },
                          { title: 'BAJet® In Vitro DNA Transfection Reagent', href: '/products/bajet-transfection-reagent' },
                          { title: 'BAPoly® In Vitro DNA Transfection Reagent', href: '/products/bapoly-transfection-reagent' },
                          { title: 'Prestained Protein Marker IV', href: '/products/prestained-protein-marker-iv' },
              { title: 'Western Protein MarkerI(Exposure)', href: '/products/western-protein-marker-i' },
              { title: '2 x SYBR Green qPCR Master Mix', href: '/products/sybr-green-qpcr-mix' },
              { title: '2 x Fast SYBR Green qPCR Master Mix', href: '/products/fast-sybr-green-qpcr-mix' },
                        ],
                        'Genome Editing': [
                          { title: 'Overexpression Targeted Knock-In', href: '/products/overexpression-targeted-knock-in' },
                          { title: 'Gene Knock-In Tagging', href: '/products/gene-knock-in' },
              { title: 'Gene Knock-Out Kit', href: '/products/gene-knock-out' },
              { title: 'Genome Deletion', href: '/products/gene-deletion' },
                          { title: 'CRISPR RNA Knock-down', href: '/products/crispr-knock-down' },
                        ],
                        'Vector Clones': [
                          { title: 'cDNA Vector Stock', href: '/products/cdna-vector-stock' },
                          { title: 'Functional Vectors Kits Template', href: '/products/functional-vectors-kits-template' },
                        ],
                        'Stable Cell Lines': [
                          { title: 'Stable Cell Line Stock', href: '/products/stable-cell-line-stock' },
                        ],
                        'Lentivirus': [
                          { title: 'cDNA Lentivirus Stock', href: '/products/cdna-lentivirus-stock' },
                          { title: 'Lentivirus Control Stock', href: '/products/lentivirus-control-stock' },
                        ],
                      };
                      const [activeCat, setActiveCat] = React.useState<typeof categories[number]>('Reagents and Markers');
                      return (
                        <div className="grid grid-cols-[240px_minmax(400px,1fr)] gap-6 p-4 w-[860px] lg:w-[980px]">
                          {/* Left: top-level categories */}
                          <ul className="space-y-1 pr-2 border-r">
                            {categories.map((c) => (
                              <li key={c}>
                                <button
                                  type="button"
                                  onMouseEnter={() => setActiveCat(c)}
                                  onFocus={() => setActiveCat(c)}
                                  className={cn(
                                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                                    activeCat === c ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                  )}
                                >
                                  {c}
                                </button>
                              </li>
                            ))}
                          </ul>

                          {/* Right: items of active category */}
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 pr-1">
                            {items[activeCat].map((it) => (
                              <ListItem
                                key={it.href}
                                title={it.title}
                                href={it.href}
                                className="space-y-0 p-1.5 lg:p-2 rounded-sm"
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Services Dropdown (append Genome Editing Services; homepage services remain unchanged) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {(() => {
                      const navServices = [
                        ...customerSolutions,
                        { id: 'svc-02', name: 'Genome Editing Services', description: 'CRISPR overexpression, knockout, RNA knockdown, and ready-to-use kits.', link: '/services/genome-editing' },
                      ];
                      return (
                        <ul className="grid w-[360px] gap-3 p-4 md:w-[440px] md:grid-cols-2 lg:w-[520px]">
                          {navServices.map((s) => (
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

            {/* Other Links */}
            {/* Primary links: remove Contact; add text Design (external) */}
            {/* Place Design immediately after Services */}
            <Link to="/design" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/design') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Design</Link>
            <Link to="/blog" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/blog') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Blog</Link>
            <Link to="/investors" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/investors') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Investors</Link>
            <Link to="/why-bioark" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath('/why-bioark') ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>Why BioArk</Link>

            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <Button asChild size="sm">
                <Link to="/request-quote">Request Quote</Link>
              </Button>
              {/* Auth/User menu */}
              <div className="relative">
                <button
                  className="p-2 rounded-md text-inherit opacity-80 hover:text-primary hover:opacity-100 transition-colors duration-200"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  onMouseEnter={() => {
                    if (closeTimerRef.current) {
                      window.clearTimeout(closeTimerRef.current);
                      closeTimerRef.current = null;
                    }
                    setUserMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    // slight delay to allow moving into the dropdown without flicker
                    closeTimerRef.current = window.setTimeout(() => {
                      setUserMenuOpen(false);
                      closeTimerRef.current = null;
                    }, 120);
                  }}
                >
                  <User size={20} />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-44 bg-background border rounded-md shadow-lg transition-opacity duration-150 ${userMenuOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'}`}
                  role="menu"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) {
                      window.clearTimeout(closeTimerRef.current);
                      closeTimerRef.current = null;
                    }
                    setUserMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    setUserMenuOpen(false);
                  }}
                >
                  {!auth ? (
                    <div className="py-1">
                      <a href="/auth.html" className="block px-3 py-2 text-sm hover:bg-muted">Sign in / Sign up</a>
                    </div>
                  ) : (
                    <div className="py-1">
                      <Link to="/dashboard" className="block px-3 py-2 text-sm hover:bg-muted">Dashboard</Link>
                      <button onClick={logout} className="w-full text-left block px-3 py-2 text-sm hover:bg-muted">Log out</button>
                    </div>
                  )}
                </div>
              </div>
              {externalLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.url}
                    className="p-2 rounded-md text-inherit opacity-80 hover:text-primary hover:opacity-100 transition-colors duration-200"
                    title={link.name}
                  >
                    <IconComponent size={20} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-[hsl(var(--header-footer-background))] border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}
              >
                Home
              </Link>
              {/* Simplified Mobile Links */}
              {/* Mobile primary links */}
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/products') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>Products</Link>
              <Link to="/services" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/services') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>Services</Link>
              <Link to="/design" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/design') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>Design</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/blog') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>Blog</Link>
              <Link to="/investors" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/investors') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>Investors</Link>
              <Link to="/why-bioark" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/why-bioark') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>Why BioArk</Link>
              <Link to="/design" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/design') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>Design</Link>
              <div className="px-3 pt-4">
                <Button asChild className="w-full">
                  <Link to="/request-quote" onClick={() => setIsMenuOpen(false)}>
                    Request Quote
                  </Link>
                </Button>
              </div>
              {/* Mobile user menu */}
              <div className="border-t border-border mt-2 pt-2">
                {!auth ? (
                  <a href="/auth.html" className="block px-3 py-2 rounded-md text-base font-medium text-inherit opacity-80 hover:text-primary hover:bg-white/5 transition-colors duration-200">Sign in / Sign up</a>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-inherit opacity-80 hover:text-primary hover:bg-white/5 transition-colors duration-200">Dashboard</Link>
                    <button onClick={()=>{ logout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-inherit opacity-80 hover:text-primary hover:bg-white/5 transition-colors duration-200">Log out</button>
                  </>
                )}
              </div>
              {/* Mobile External Store Links */}
              <div className="border-t border-border mt-2 pt-2">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Store
                </p>
                {externalLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-inherit opacity-80 hover:text-primary hover:bg-white/5 transition-colors duration-200"
                    >
                      <IconComponent size={16} />
                      <span>{link.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
