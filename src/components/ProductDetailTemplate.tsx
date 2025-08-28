
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, FileDown, Info, Package, ShoppingCart } from 'lucide-react';

interface ProductDetailProps {
  title: string;
  category: string;
  catalogNumber: string;
  availability: string;
  listPrice: string;
  options: string[];
  description: string;
  keyFeatures: string[];
  storageStability: string;
  performanceData: string;
  manuals: string[];
  mainImage: string;
  storeLink?: string;
}

const ProductDetailTemplate: React.FC<ProductDetailProps> = ({
  title,
  category,
  catalogNumber,
  availability,
  listPrice,
  options,
  description,
  keyFeatures,
  storageStability,
  performanceData,
  manuals,
  mainImage,
  storeLink
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedOpt, setSelectedOpt] = useState(options[0] || 'Default');
  const [qty, setQty] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<number>(0);
  const priceCents = useMemo(()=>{
    const m = listPrice?.replace(/[^0-9.]/g,'');
    if(!m) return 0; const v = Math.round(parseFloat(m)*100); return Number.isFinite(v)?v:0;
  },[listPrice]);

  const handleAddToCart = () => {
    const quantity = Math.max(1, Math.min(999, qty || 1));
    addItem({ id: catalogNumber || title, name: title, price: priceCents, imageUrl: mainImage, variant: selectedOpt, link: storeLink || undefined }, quantity);
  toast({ title: 'Added to cart', description: `${title}${selectedOpt ? ` (${selectedOpt})` : ''} × ${quantity} added to your cart.` });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
  {/* Breadcrumbs */}
        <section className="py-8 bg-muted/30 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-muted-foreground flex items-center gap-2">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary">Products</Link>
              <span>/</span>
              <span className="text-foreground">{title}</span>
            </nav>
          </div>
        </section>

  {/* Top: gallery + key info */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
              {/* Gallery */}
              <div className="order-2 lg:order-1">
                <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Main image; can reuse even when only one image is available */}
                  <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Thumbnails */}
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {[mainImage].map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-square rounded-md border overflow-hidden ${activeImage===idx? 'ring-2 ring-primary' : 'hover:border-primary/60'}`}
                      aria-label={`Preview image ${idx+1}`}
                    >
                      <img src={img} alt={`${title} thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="order-1 lg:order-2">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary">{category}</Badge>
                  {availability && (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{availability}</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Package className="h-4 w-4"/><span>Catalog #:</span><span className="text-foreground font-medium">{catalogNumber || '-'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Info className="h-4 w-4"/><span>Price:</span><span className="text-2xl md:text-3xl font-bold text-primary">{listPrice || 'Contact Sales'}</span></div>
                </div>

                {/* Options (chip style) */}
                {options?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Specification</p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => {
                        const active = selectedOpt === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedOpt(opt)}
                            className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                            aria-pressed={active}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Purchase: quantity + add to cart */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Qty</span>
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" className="rounded-r-none" onClick={() => setQty((q)=> Math.max(1, (q||1)-1))}>-</Button>
                      <Input
                        className="w-16 text-center rounded-none"
                        type="number"
                        min={1}
                        max={999}
                        value={qty}
                        onChange={(e)=> setQty(() => {
                          const n = parseInt(e.target.value || '1', 10);
                          if (Number.isNaN(n)) return 1;
                          return Math.max(1, Math.min(999, n));
                        })}
                      />
                      <Button variant="outline" size="icon" className="rounded-l-none" onClick={() => setQty((q)=> Math.min(999, (q||1)+1))}>+</Button>
                    </div>
                  </div>
                  <Button className="bioark-gradient text-white hover:opacity-90" asChild>
                    <Link to="/request-quote">Request a Quote</Link>
                  </Button>
                  <Button className="bg-primary text-white hover:bg-primary/90 px-6" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detail Tabs */}
        <section className="py-14 bg-muted/30 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="desc">
              <TabsList>
                <TabsTrigger value="desc">Description</TabsTrigger>
                <TabsTrigger value="features">Key Features</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="manuals">Manuals</TabsTrigger>
              </TabsList>

              <TabsContent value="desc" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                      {description || 'No description available.'}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {keyFeatures?.length ? (
                      <ul className="space-y-3">
                        {keyFeatures.map((f, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5"/>
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No key features available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{performanceData || 'No performance data available. Contact technical support for detailed reports.'}</p>
                    <div className="w-full h-56 bg-muted rounded-md border flex items-center justify-center text-muted-foreground">
                      Chart/Table Placeholder
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manuals" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manuals & Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {manuals?.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {manuals.map((m, i) => (
                          <a key={i} href="#" className="flex items-center justify-between border rounded-md p-3 hover:bg-accent transition-colors">
                            <div className="flex items-center gap-2">
                              <FileDown className="h-4 w-4" />
                              <span className="text-sm">{m}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">PDF</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No downloadable documents.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductDetailTemplate;
