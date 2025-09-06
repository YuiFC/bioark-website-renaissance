
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { addQuote } from '@/lib/quotes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProductDetailProps {
  title: string;
  category: string;
  catalogNumber: string;
  availability: string;
  listPrice: string;
  options: string[];
  optionPrices?: Record<string, string>;
  description: string;
  keyFeatures: string[];
  storageStability: string;
  performanceData: string;
  manuals: string[];
  manualUrls?: string[];
  mainImage: string;
  images?: string[];
  storeLink?: string;
  // Quote-only mode: hide price/cart/tabs and show a single content container
  quoteOnly?: boolean;
  contentText?: string;
  // Optional special case: show a bottom Add to Cart button even in quote-only mode
  showBottomAddToCart?: boolean;
}

const ProductDetailTemplate: React.FC<ProductDetailProps> = ({
  title,
  category,
  catalogNumber,
  availability,
  listPrice,
  options,
  optionPrices,
  description,
  keyFeatures,
  storageStability,
  performanceData,
  manuals,
  manualUrls,
  mainImage,
  images,
  storeLink,
  quoteOnly,
  contentText,
  showBottomAddToCart
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedOpt, setSelectedOpt] = useState(options[0] || 'Default');
  const [qty, setQty] = useState<number>(1);
  const gallery = useMemo(() => {
    const list = (images && images.length ? images : [mainImage]).filter(Boolean);
    return Array.from(new Set(list));
  }, [images, mainImage]);
  const [activeImage, setActiveImage] = useState<number>(0);
  // Quote dialog state (for quote-only products)
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const effectivePrice = useMemo(() => {
    if (optionPrices && options?.length) {
      const p = optionPrices[selectedOpt];
      if (p) return p;
    }
    return listPrice;
  }, [optionPrices, selectedOpt, listPrice, options]);

  const priceCents = useMemo(()=>{
    const m = effectivePrice?.replace(/[^0-9.]/g,'');
    if(!m) return 0; const v = Math.round(parseFloat(m)*100); return Number.isFinite(v)?v:0;
  },[effectivePrice]);

  const handleAddToCart = () => {
    const quantity = Math.max(1, Math.min(999, qty || 1));
    addItem({ id: catalogNumber || title, name: title, price: priceCents, imageUrl: mainImage, variant: selectedOpt, link: storeLink || undefined }, quantity);
  toast({ title: 'Added to cart', description: `${title}${selectedOpt ? ` (${selectedOpt})` : ''} × ${quantity} added to your cart.` });
  };

  const handleSubmitQuote = async () => {
    const [firstName, ...rest] = custName.trim().split(/\s+/);
    const lastName = rest.join(' ');
    const payload = {
      firstName: firstName || '-',
      lastName: lastName || '-',
      email: custEmail.trim(),
      phone: '',
      company: title,
      department: category,
      serviceType: 'Product Quote',
      timeline: '',
      budget: '',
      projectDescription: `${title}${selectedOpt ? ` (${selectedOpt})` : ''}`,
      additionalInfo: JSON.stringify({ catalogNumber: shownCatalog }),
      // No site-wide login: do not attach user snapshot
    } as const;
    try {
      await addQuote(payload as any);
      setQuoteOpen(false);
      setCustName('');
      setCustEmail('');
      toast({ title: 'Quote submitted', description: 'We will contact you soon.' });
    } catch (e:any) {
      toast({ title: 'Submit failed', description: e?.message || 'Please try again later.' });
    }
  };

  // Derive display name and extra metadata from title when encoded like "BADM3362 – Name (100-8000bp)"
  const parsed = (() => {
    const codeMatch = title.match(/^\s*([A-Z0-9-]+)\s*–\s*/i);
    const sizeMatch = title.match(/\(([^)]*(?:bp|kda))\)\s*$/i);
    const displayName = title
      .replace(/^\s*[A-Z0-9-]+\s*–\s*/i, '')
      .replace(/\s*\([^)]*(?:bp|kda)\)\s*$/i, '')
      .trim();
    return {
      codeFromName: codeMatch ? codeMatch[1] : '',
      sizeFromName: sizeMatch ? sizeMatch[1] : '',
      displayName,
    };
  })();

  const shownCatalog = (catalogNumber && catalogNumber.trim()) || parsed.codeFromName || '';

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
                <div className="w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {/* 容器内用内联块撑开，自适应图片比例，边框紧贴图片 */}
                  <div className="p-3">
                    <img
                      src={gallery[activeImage] || mainImage}
                      alt={title}
                      className="max-w-full h-auto object-contain border rounded-md"
                    />
                  </div>
                </div>
                {/* Thumbnails */}
        <div className="mt-4 grid grid-cols-5 gap-3">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
          className={`aspect-square rounded-md border overflow-hidden ${activeImage===idx? 'ring-2 ring-primary' : 'hover:border-primary/60'}`}
                      aria-label={`Preview image ${idx+1}`}
                    >
          <img src={img} alt={`${title} thumbnail ${idx+1}`} className="w-full h-full object-contain" />
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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{parsed.displayName || title}</h1>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Package className="h-4 w-4"/><span>Catalog #:</span><span className="text-foreground font-medium">{shownCatalog || '-'}</span></div>
                  {!quoteOnly && (
                    <div className="flex items-center gap-2 text-muted-foreground"><Info className="h-4 w-4"/><span>Price:</span><span className="text-2xl md:text-3xl font-bold text-primary">{effectivePrice || 'Contact Sales'}</span></div>
                  )}
                </div>

                {/* Fragment size (if any) */}
                {parsed.sizeFromName && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Fragment Size:</span> {parsed.sizeFromName}
                  </div>
                )}

                {/* Options (chip style) - kept immediately above Qty */}
                {!quoteOnly && options?.length > 0 && (
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

                {/* Purchase / Quote actions */}
                {!quoteOnly ? (
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
                ) : (
                  <div className="mt-6">
                    <Button onClick={() => setQuoteOpen(true)} className="w-full sm:w-auto">Add to Quote</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Details Section */}
  {!quoteOnly ? (
          <section className="py-14 bg-muted/30 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Tabs defaultValue="specs">
                <TabsList>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="manuals">Manuals</TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-2">Description</h3>
                        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                          {description || 'No description available.'}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-2">Key Features</h3>
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
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-2">Storage & Stability</h3>
                        <p className="text-sm text-muted-foreground">{storageStability || 'No storage information available.'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-foreground whitespace-pre-wrap border rounded-md p-3 bg-background min-h-[120px]">
                        {performanceData || 'No performance data available. Contact technical support for detailed reports.'}
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
                              {manuals.map((m, i) => {
                                const href = manualUrls?.[i] || '#';
                                const clickable = !!manualUrls?.[i];
                                return (
                                <a key={i} href={href} target={clickable?"_blank":undefined} rel={clickable?"noopener noreferrer":undefined} className="flex items-center justify-between border rounded-md p-3 hover:bg-accent transition-colors">
                              <div className="flex items-center gap-2">
                                <FileDown className="h-4 w-4" />
                                <span className="text-sm">{m}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">PDF</span>
                            </a>
                              );})}
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
        ) : (
          <section className="py-14 bg-muted/30 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{(contentText || description || '').toString()}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

  {quoteOnly && showBottomAddToCart && (
          <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center">
                <Button className="bg-primary text-white hover:bg-primary/90 px-6" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Quote Dialog (quote-only mode) */}
        {quoteOnly && (
          <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Quote</DialogTitle>
                <DialogDescription>Fill in your contact so we can follow up with your request.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Customer name</div>
                  <Input value={custName} onChange={(e)=>setCustName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Leave your email</div>
                  <Input type="email" value={custEmail} onChange={(e)=>setCustEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmitQuote} disabled={!custEmail.trim() || !custName.trim()}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailTemplate;
