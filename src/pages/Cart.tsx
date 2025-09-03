import React, { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/checkout';
import { useToast } from '@/hooks/use-toast';

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const CartPage = () => {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const payableItems = useMemo(() => items.filter(i => i.price > 0), [items]);

  // Clear cart after successful payment
  React.useEffect(() => {
    if (success) {
      clear();
    }
  }, [success, clear]);

  const onCheckout = async () => {
    try {
      setLoading(true);
      const payload = payableItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, imageUrl: i.imageUrl, variant: i.variant }));
      if (!payload.length) {
        toast({ title: 'Cannot checkout', description: 'No payable items in the cart (quote-based items are not eligible for online payment).', variant: 'destructive' });
        return;
      }
      const { url } = await createCheckoutSession(payload, {
        successUrl: `${window.location.origin}/cart?success=1`,
        cancelUrl: `${window.location.origin}/cart?canceled=1`,
        shippingCents: 4000,
      });
      window.location.href = url;
    } catch (e: any) {
      console.error('Checkout error', e);
      const msg = typeof e?.message === 'string' ? e.message : 'Please try again later.';
      toast({ title: 'Failed to create checkout session', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const shipping = 4000; // $40 flat
  const total = subtotal + (payableItems.length > 0 ? shipping : 0);

  // No in-site address collection; users will fill it on Stripe.
  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F8F8]">
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-6">Shopping Cart</h1>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 mb-4">Payment successful. Thank you for your purchase!</div>
            )}
            {canceled && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-3 mb-4">You canceled the payment.</div>
            )}
            {!items.length ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-neutral-500">
                Your cart is empty.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <div className="space-y-4">
                  {items.map((it) => (
                    <div key={`${it.id}-${it.variant||'__'}`} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center">
                      {it.imageUrl && (
                        <img src={it.imageUrl} alt={it.name} className="w-20 h-20 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-800">{it.name}</div>
                        {it.variant && <div className="text-sm text-neutral-500">{it.variant}</div>}
                        <div className="text-sm text-neutral-700 mt-1">{formatCents(it.price)}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center bg-neutral-100 rounded-full px-2 py-1">
                          <button className="px-2" onClick={()=>updateQty(it.id, it.variant, Math.max(1, it.quantity-1))}>-</button>
                          <span className="px-3 min-w-[2ch] text-center">{it.quantity}</span>
                          <button className="px-2" onClick={()=>updateQty(it.id, it.variant, it.quantity+1)}>+</button>
                        </div>
                        <button className="ml-4 text-sm text-red-500" onClick={()=>removeItem(it.id, it.variant)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between text-neutral-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatCents(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-700 mt-2">
                      <span>Shipping</span>
                      <span className="font-semibold">{payableItems.length > 0 ? formatCents(shipping) : '$0.00'}</span>
                    </div>
                    <div className="flex justify-between text-neutral-900 mt-2 border-t pt-2">
                      <span className="font-semibold">Estimated Total</span>
                      <span className="font-bold">{formatCents(payableItems.length > 0 ? total : subtotal)}</span>
                    </div>
                      <Button disabled={loading || payableItems.length === 0} onClick={() => onCheckout()} className="w-full mt-4 rounded-full bg-blue-700 hover:bg-blue-700/90 text-white">
                        {loading ? 'Processing…' : 'Checkout'}
                      </Button>
                      <div className="mt-4 flex items-center justify-center gap-2 text-neutral-500">
                        <span className="text-xs">Powered by</span>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1280px-Stripe_Logo%2C_revised_2016.svg.png"
                          alt="Stripe"
                          className="h-5 object-contain"
                        />
                      </div>
                    <Button variant="outline" className="w-full mt-2 rounded-full" onClick={clear}>Clear Cart</Button>
                  </div>
                </div>
              </div>
            )}
            {/* No address modal: users will fill shipping/billing details on Stripe. */}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CartPage;
