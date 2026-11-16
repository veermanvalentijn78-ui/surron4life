import { useEffect, useState, type ChangeEvent } from 'react';
import { Bike, RotateCcw, Upload, X, ZoomIn } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  imageSrc: string;
  hasCustomImage: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onUploadProductImage: (productId: string, dataUrl: string) => void;
  onResetProductImage: (productId: string) => void;
}

export function ProductModal({
  product,
  imageSrc,
  hasCustomImage,
  onClose,
  onAddToCart,
  onUploadProductImage,
  onResetProductImage,
}: ProductModalProps) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setZoomed(false);
    setOrigin('50% 50%');
    setImgError(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${xPct}% ${yPct}%`);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImgError(false);
        onUploadProductImage(product.id, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-[880px] overflow-y-auto rounded-2xl border border-white/15 bg-[#151820] p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#1d212c] text-zinc-200 transition-colors hover:border-white/30 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-12">
          {/* Left Interactive Zoom Gallery */}
          <div className="md:col-span-6">
            <div
              onClick={() => !imgError && setZoomed((z) => !z)}
              onMouseMove={handleMouseMove}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#0e1117] ${
                zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            >
              {!imgError ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  style={{
                    transformOrigin: origin,
                    transform: zoomed ? 'scale(1.85)' : 'scale(1)',
                  }}
                  className="h-full w-full object-cover transition-transform duration-150 ease-out"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Bike className="h-10 w-10 text-zinc-500" aria-hidden="true" />
                  <p className="text-sm font-semibold text-white">{product.name}</p>
                </div>
              )}
              {!imgError && (
                <div className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1 text-xs font-medium text-zinc-200">
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{zoomed ? 'Click to reset' : 'Click to zoom'}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-zinc-400">
              <span>Studio 3/4 view</span>
              <div className="flex items-center gap-2">
                {hasCustomImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setImgError(false);
                      onResetProductImage(product.id);
                    }}
                    className="inline-flex min-h-[32px] items-center gap-1 rounded-md border border-white/12 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    <span>Default</span>
                  </button>
                )}
                <label className="inline-flex min-h-[32px] items-center gap-1.5 rounded-md border border-white/12 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:border-emerald-500/60 hover:text-emerald-400 cursor-pointer">
                  <Upload className="h-3 w-3" aria-hidden="true" />
                  <span>Preview photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="md:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              {product.type}
            </p>
            <h2
              id="modal-product-title"
              className="mt-1.5 font-display text-2xl font-extrabold text-white sm:text-3xl"
            >
              {product.name}
            </h2>
            <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-emerald-400">
              €{product.price.toLocaleString('en-US')}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              {product.description}
            </p>

            <table className="mt-5 w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-white/10">
                  <th className="py-2.5 text-left font-medium text-zinc-400">Category</th>
                  <td className="py-2.5 text-right font-medium text-white">{product.type}</td>
                </tr>
                <tr className="border-b border-white/10">
                  <th className="py-2.5 text-left font-medium text-zinc-400">Motor Output</th>
                  <td className="py-2.5 text-right font-mono tabular-nums text-white">
                    {product.specs.motor}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <th className="py-2.5 text-left font-medium text-zinc-400">Battery System</th>
                  <td className="py-2.5 text-right font-mono tabular-nums text-white">
                    {product.specs.battery}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <th className="py-2.5 text-left font-medium text-zinc-400">Peak Torque</th>
                  <td className="py-2.5 text-right font-mono tabular-nums text-white">
                    {product.specs.torque}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <th className="py-2.5 text-left font-medium text-zinc-400">Top Speed</th>
                  <td className="py-2.5 text-right font-mono tabular-nums text-emerald-400">
                    {product.specs.topSpeed}
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              type="button"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-emerald-400 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              Add to Cart — €{product.price.toLocaleString('en-US')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
