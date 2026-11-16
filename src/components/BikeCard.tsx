import { useRef, useState } from 'react';
import { Bike } from 'lucide-react';
import type { Product } from '../data/products';

interface BikeCardProps {
  product: Product;
  imageSrc: string;
  onInspect: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export function BikeCard({ product, imageSrc, onInspect, onBuyNow }: BikeCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-[#151820] transition-[transform,border-color,box-shadow] duration-150 ${
        product.featured
          ? 'border-red-500/45 hover:border-red-500/80'
          : 'border-white/10 hover:border-emerald-500/55'
      }`}
    >
      <button
        type="button"
        onClick={() => onInspect(product)}
        aria-label={`Inspect ${product.name}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#10131a] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        {!imgError ? (
          <img
            src={imageSrc}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#191d27] to-[#101218] p-6 text-center">
            <Bike className="h-8 w-8 text-zinc-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-white">{product.name}</span>
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-emerald-500">
            {product.type}
          </span>
          {product.featured && (
            <span className="font-semibold text-red-400">Flagship</span>
          )}
        </div>

        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-white">
          <button
            type="button"
            onClick={() => onInspect(product)}
            className="text-left transition-colors hover:text-emerald-400 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            {product.name}
          </button>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
          {product.description}
        </p>

        {/* Clean unboxed typographic spec metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs tabular-nums text-zinc-300">
          <span>{product.specs.motor}</span>
          <span aria-hidden="true" className="text-zinc-600">
            ·
          </span>
          <span>48V</span>
          <span aria-hidden="true" className="text-zinc-600">
            ·
          </span>
          <span>200 Nm</span>
          <span aria-hidden="true" className="text-zinc-600">
            ·
          </span>
          <span className={product.featured ? 'text-red-400' : 'text-emerald-400'}>
            {product.specs.topSpeed}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="font-display text-2xl font-extrabold tabular-nums text-white">
            €{product.price.toLocaleString('en-US')}
          </span>
          <button
            type="button"
            onClick={() => onBuyNow(product)}
            className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-emerald-500 px-5 py-2 text-sm font-bold text-zinc-950 transition-colors duration-150 hover:bg-emerald-400 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
