import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090a0d]/95">
      <div className="mx-auto flex h-16 max-w-[1220px] items-center justify-between gap-8 px-5">
        <a
          href="#"
          className="font-display text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
        >
          surron<span className="text-emerald-500">4</span>you
        </a>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          <a
            href="#bikes"
            className="text-sm font-medium text-zinc-400 transition-colors duration-150 hover:text-white hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            Bikes
          </a>
          <a
            href="#specs"
            className="text-sm font-medium text-zinc-400 transition-colors duration-150 hover:text-white hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            Specifications
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-zinc-400 transition-colors duration-150 hover:text-white hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex min-h-[40px] items-center gap-2.5 rounded-lg border border-white/15 bg-[#151820] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:border-emerald-500/70 hover:bg-[#1a1e28] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            <ShoppingBag className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <span>Cart</span>
            <span className="font-mono text-xs tabular-nums text-emerald-400">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
