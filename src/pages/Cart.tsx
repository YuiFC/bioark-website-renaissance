import React from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const CartPage = () => {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F8F8]">
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-6">Shopping Cart</h1>

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
                    <Button className="w-full mt-4 rounded-full bg-blue-700 hover:bg-blue-700/90 text-white">Checkout</Button>
                    <Button variant="outline" className="w-full mt-2 rounded-full" onClick={clear}>Clear Cart</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CartPage;
