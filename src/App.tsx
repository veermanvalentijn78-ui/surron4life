import { useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BikeCard } from './components/BikeCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, type CartItem } from './components/CartDrawer';
import { SpecsAndContactSection } from './components/SpecsAndContactSection';
import {
  HERO_GIF_STORAGE_KEY,
  PRODUCT_IMG_STORAGE_PREFIX,
  PRODUCTS,
  type Product,
} from './data/products';

type PriceFilter = 'all' | '1000' | '1200';
type SortOption = 'default' | 'price-asc' | 'price-desc';

export default function App() {
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heroMediaUrl, setHeroMediaUrl] = useState<string | null>(null);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const savedHero = localStorage.getItem(HERO_GIF_STORAGE_KEY);
      if (savedHero) setHeroMediaUrl(savedHero);

      const loadedImages: Record<string, string> = {};
      PRODUCTS.forEach((product) => {
        const saved = localStorage.getItem(PRODUCT_IMG_STORAGE_PREFIX + product.id);
        if (saved) loadedImages[product.id] = saved;
      });
      setCustomImages(loadedImages);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const visibleProducts = useMemo(() => {
    const filtered = PRODUCTS.filter(
      (p) => priceFilter === 'all' || String(p.price) === priceFilter
    );
    if (sortOption === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortOption === 'price-desc') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [priceFilter, sortOption]);

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const getProductImage = (product: Product) =>
    customImages[product.id] || product.defaultImage;

  const handleUploadHeroMedia = (dataUrl: string) => {
    setHeroMediaUrl(dataUrl);
    try {
      localStorage.setItem(HERO_GIF_STORAGE_KEY, dataUrl);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleResetHeroMedia = () => {
    setHeroMediaUrl(null);
    try {
      localStorage.removeItem(HERO_GIF_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleUploadProductImage = (productId: string, dataUrl: string) => {
    setCustomImages((prev) => ({ ...prev, [productId]: dataUrl }));
    try {
      localStorage.setItem(PRODUCT_IMG_STORAGE_PREFIX + productId, dataUrl);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleResetProductImage = (productId: string) => {
    setCustomImages((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
    try {
      localStorage.removeItem(PRODUCT_IMG_STORAGE_PREFIX + productId);
    } catch {
      // Ignore storage errors
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleChangeQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-zinc-100">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setCartOpen(true)} />

      <main>
        <HeroSection
          heroMediaUrl={heroMediaUrl}
          onUploadHeroMedia={handleUploadHeroMedia}
          onResetHeroMedia={handleResetHeroMedia}
        />

        {/* Bikes Catalog Section */}
        <section id="bikes" className="mx-auto max-w-[1220px] px-5 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500">
                Lineup
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Our Bikes
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Interactive Segmented Filter Control */}
              <div
                role="group"
                aria-label="Filter bikes by model tier"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#111319] p-1"
              >
                {(
                  [
                    { id: 'all', label: 'All Bikes' },
                    { id: '1000', label: '€1,000 Models' },
                    { id: '1200', label: '€1,200 Mini Surron' },
                  ] as const
                ).map((tab) => {
                  const active = priceFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPriceFilter(tab.id)}
                      className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                aria-label="Sort bikes"
                className="min-h-[44px] rounded-lg border border-white/12 bg-[#111319] px-3.5 py-2 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <BikeCard
                key={product.id}
                product={product}
                imageSrc={getProductImage(product)}
                onInspect={setSelectedProduct}
                onBuyNow={handleAddToCart}
              />
            ))}
          </div>
        </section>

        <SpecsAndContactSection />
      </main>

      <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        <div className="mx-auto max-w-[1220px] px-5">
          © 2026 Surron4You — Electric Dirt Bikes &amp; Mini Surron
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        imageSrc={selectedProduct ? getProductImage(selectedProduct) : ''}
        hasCustomImage={
          selectedProduct ? Boolean(customImages[selectedProduct.id]) : false
        }
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onUploadProductImage={handleUploadProductImage}
        onResetProductImage={handleResetProductImage}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        getProductImage={getProductImage}
        onClose={() => setCartOpen(false)}
        onChangeQty={handleChangeQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
