import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  qty: number;
}

interface OrderConfirmation {
  orderId: string;
  customerName: string;
  customerEmail: string;
  deliveryCity: string;
  total: number;
  status: string;
  items: { name: string; qty: number; price: number }[];
}

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  getProductImage: (product: Product) => string;
  onClose: () => void;
  onChangeQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  open,
  items,
  getProductImage,
  onClose,
  onChangeQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg('Add a bike to your order first.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          deliveryCity,
          notes,
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || 'Unable to submit your order. Please try again.');
        return;
      }

      setConfirmation({
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        deliveryCity: data.deliveryCity,
        total: data.total,
        status: data.status,
        items: data.items,
      });
      onClearCart();
      setCustomerName('');
      setCustomerEmail('');
      setDeliveryCity('');
      setNotes('');
    } catch {
      setErrorMsg('Network error submitting your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-label="Your Order"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full max-w-[440px] flex-col border-l border-white/15 bg-[#111319]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-display text-xl font-bold text-white">Your Order</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#181c24] text-zinc-300 transition-colors hover:border-white/30 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {confirmation && items.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-5">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="font-mono text-sm font-semibold">
                  Order #{confirmation.orderId}
                </span>
              </div>
              <p className="mt-2 font-display text-lg font-bold text-white">
                {confirmation.status}
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Thank you, {confirmation.customerName}. We sent your confirmation summary to{' '}
                <span className="text-white">{confirmation.customerEmail}</span> for delivery to{' '}
                <span className="text-white">{confirmation.deliveryCity}</span>.
              </p>

              <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-sm">
                {confirmation.items.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex justify-between text-zinc-200">
                    <span>
                      {item.qty}× {item.name}
                    </span>
                    <span className="font-mono tabular-nums">
                      €{(item.price * item.qty).toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-white">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-emerald-400">
                    €{confirmation.total.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center rounded-lg border border-white/15 bg-[#151820] px-4 py-2 text-xs font-semibold text-white hover:border-emerald-500/60 cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-400">Your cart is currently empty.</p>
              <p className="mt-1 text-xs text-zinc-500">
                Select a 3000W dirt bike or Mini Surron to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3.5 border-b border-white/10 pb-4"
                >
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#0d1016]">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {product.name}
                    </p>
                    <p className="font-mono text-sm font-semibold tabular-nums text-emerald-400">
                      €{(product.price * qty).toLocaleString('en-US')}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() => onChangeQty(product.id, -1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-[#181c24] text-zinc-200 hover:border-white/30 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <span className="min-w-[20px] text-center font-mono text-xs tabular-nums text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        onClick={() => onChangeQty(product.id, 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-[#181c24] text-zinc-200 hover:border-white/30 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => onRemoveItem(product.id)}
                        className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleCheckout}
          className="border-t border-white/10 bg-[#151820] px-6 py-5"
        >
          <div className="mb-4 flex items-center justify-between text-base font-bold text-white">
            <span>Total</span>
            <span className="font-mono text-xl tabular-nums text-emerald-400">
              €{total.toLocaleString('en-US')}
            </span>
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name *"
              aria-label="Full name"
              className="w-full rounded-lg border border-white/12 bg-[#0d0f14] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email address *"
              aria-label="Email address"
              className="w-full rounded-lg border border-white/12 bg-[#0d0f14] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="text"
              required
              value={deliveryCity}
              onChange={(e) => setDeliveryCity(e.target.value)}
              placeholder="Delivery city *"
              aria-label="Delivery city"
              className="w-full rounded-lg border border-white/12 bg-[#0d0f14] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Phone or delivery note (optional)"
              aria-label="Phone or delivery note"
              className="w-full rounded-lg border border-white/12 bg-[#0d0f14] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <p role="alert" className="mt-3 text-xs font-medium text-red-400">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Submitting Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
