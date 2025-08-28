import React, { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { getProductBySlug } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const accent = 'bg-blue-700 hover:bg-blue-700/90 text-white';

function toCents(priceStr?: string): number | null {
  if (!priceStr) return null;
  const m = priceStr.replace(/[^0-9.]/g, '');
  if (!m) return null;
  const v = Math.round(parseFloat(m) * 100);
  return Number.isFinite(v) ? v : null;
}

const ProductDetailUI = () => {
  const { slug } = useParams();
  const data = slug ? getProductBySlug(slug) : undefined;
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string>('');
  const [qty, setQty] = useState<number>(1);

  const priceCents = useMemo(() => toCents(data?.listPrice) ?? 0, [data?.listPrice]);

  if (!data) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center text-neutral-600">Product not found.</div>
      </Layout>
    );
  }

  const images = [data.imageUrl, data.imageUrl, data.imageUrl].filter(Boolean) as string[];
  const options = data.options && data.options.length ? data.options : ['Default'];

  const addToCart = () => {
    addItem({
      id: data.id,
      name: data.name,
      price: priceCents,
      imageUrl: data.imageUrl,
      variant: selected || options[0],
      link: data.link,
    }, qty);
  toast({ title: 'Added to cart', description: `${data.name} (${selected || options[0]}) x${qty} added.` });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F8F8]">
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Left: images */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                    {images[0] ? (
                      <img src={images[0]} alt={data.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {images.slice(0,4).map((src, idx) => (
                        <button key={idx} onClick={()=>{/* simple preview swap */}}
                          className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                          <img src={src} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{data.name}</h1>
                  <div className="mt-2 text-xl font-semibold text-neutral-800">{data.listPrice || '$—'}</div>
                  <p className="mt-4 text-neutral-600 leading-relaxed">{data.description}</p>

                  {/* Option selector */}
                  <div className="mt-6">
                    <div className="text-sm mb-2 text-neutral-700">Options</div>
                    <div className="flex flex-wrap gap-2">
                      {options.map(opt => (
                        <button key={opt}
                          onClick={()=>setSelected(opt)}
                          className={`px-3 py-1.5 rounded-full text-sm border ${selected===opt? 'border-blue-700 text-blue-700 bg-blue-50':'border-neutral-300 text-neutral-700 hover:border-neutral-400'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mt-4">
                    <div className="text-sm mb-2 text-neutral-700">Quantity</div>
                    <div className="inline-flex items-center bg-neutral-100 rounded-full px-2 py-1">
                      <button className="px-2" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
                      <span className="px-3 min-w-[2ch] text-center">{qty}</span>
                      <button className="px-2" onClick={()=>setQty(q=>q+1)}>+</button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button className={`rounded-full ${accent}`} onClick={addToCart}>Add to Cart</Button>
                    <Button variant="outline" className="rounded-full border-blue-700 text-blue-700 hover:bg-blue-50">Buy Now</Button>
                  </div>

                  {/* Promises */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-neutral-600">
                    <div className="bg-neutral-50 rounded-lg p-3">⚡ Fast Delivery</div>
                    <div className="bg-neutral-50 rounded-lg p-3">✅ Authentic Products</div>
                    <div className="bg-neutral-50 rounded-lg p-3">🛡️ Secure Payment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductDetailUI;