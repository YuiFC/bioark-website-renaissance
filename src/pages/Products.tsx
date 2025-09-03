import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listAllProducts, ProductDetailData } from '@/data/products';

type Category = 'All' | 'Reagents and Markers' | 'Genome Editing' | 'Vector Clones' | 'Stable Cell Lines' | 'Lentivirus';

const deriveCategory = (p: ProductDetailData): Exclude<Category, 'All'> => {
  const prefix = (p.catalogNumber || '').toUpperCase();
  if (prefix.startsWith('FP')) return 'Reagents and Markers';
  if (prefix.startsWith('GEP')) return 'Genome Editing';
  if (prefix.startsWith('VC')) return 'Vector Clones';
  if (prefix.startsWith('SC')) return 'Stable Cell Lines';
  if (prefix.startsWith('LV')) return 'Lentivirus';
  // Fallback by id as a secondary hint
  const id = (p.id || '').toLowerCase();
  if (id.startsWith('fp-')) return 'Reagents and Markers';
  if (id.startsWith('gep-')) return 'Genome Editing';
  if (id.startsWith('vc-')) return 'Vector Clones';
  if (id.startsWith('sc-')) return 'Stable Cell Lines';
  if (id.startsWith('lv-')) return 'Lentivirus';
  return 'Reagents and Markers';
};

const Products = () => {
  const all = React.useMemo(() => listAllProducts(), []);
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<Category>('All');
  const [availability, setAvailability] = React.useState<'All' | 'Purchasable' | 'Quote Only'>('All');

  const filtered = React.useMemo(() => {
    return all
      .map(p => ({
        ...p,
        _category: deriveCategory(p),
        _quoteOnly: deriveCategory(p) !== 'Reagents and Markers',
      }))
      .filter(p => (category === 'All' ? true : p._category === category))
      .filter(p => {
        if (availability === 'All') return true;
        return availability === 'Purchasable' ? !p._quoteOnly : p._quoteOnly;
      })
      .filter(p => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.catalogNumber || '').toLowerCase().includes(q)
        );
      });
  }, [all, category, availability, query]);

  const categories: Category[] = ['All', 'Reagents and Markers', 'Genome Editing', 'Vector Clones', 'Stable Cell Lines', 'Lentivirus'];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-20 bioark-hero-gradient bio-pattern-cells">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Products Catalog
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Search, filter, and explore our reagents, genome editing kits, vectors, cell lines, and lentiviral tools.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-background border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by name, description, or catalog number..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={availability} onValueChange={(v) => setAvailability(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Purchasable">Purchasable</SelectItem>
                  <SelectItem value="Quote Only">Quote Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{filtered.length} result(s)</div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => {
                const isQuote = deriveCategory(p) !== 'Reagents and Markers';
                const img = (p as any).images?.[0] || p.imageUrl || '/placeholder.svg';
                const to = p.link || '#';
                return (
                  <Card key={p.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="w-full h-44 overflow-hidden bg-muted">
                      <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg leading-snug line-clamp-2">{p.name}</CardTitle>
                        <Badge variant={isQuote ? 'secondary' : 'default'}>{isQuote ? 'Quote' : 'Buy'}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">{p.catalogNumber}</div>
                      {!isQuote && p.listPrice && (
                        <div className="font-semibold text-foreground">{p.listPrice}</div>
                      )}
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Link to={to} className="text-primary font-semibold inline-flex items-center group/link">
                        View details
                        <span className="ml-1 transition-transform group-hover/link:translate-x-0.5">→</span>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bioark-hero-gradient bio-pattern-dna">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                Need Custom Solutions?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team can develop custom molecular tools and reagents tailored to your specific research needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/request-quote" className="bioark-btn-primary inline-flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                Request Custom Quote
              </a>
              <a href="/contact" className="bioark-btn-secondary inline-flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                Contact Our Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Products;
