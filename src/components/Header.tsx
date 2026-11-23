import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  orderCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
}

export function Header({
  cartCount,
  orderCount,
  onOpenCart,
  onOpenOrders,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F8F6]/95 backdrop-blur-md border-b border-[#E4E4E0]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#beranda"
          className="font-display text-xl font-medium tracking-tight text-[#141413] whitespace-nowrap shrink-0"
        >
          Kala Seduh
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5C57]"
        >
          <a
            href="#menu"
            className="py-1 hover:text-[#141413] hover:underline underline-offset-8 decoration-[#141413]/40 transition-colors whitespace-nowrap shrink-0"
          >
            Menu
          </a>
          <a
            href="#cerita"
            className="py-1 hover:text-[#141413] hover:underline underline-offset-8 decoration-[#141413]/40 transition-colors whitespace-nowrap shrink-0"
          >
            Cerita
          </a>
          <a
            href="#lokasi"
            className="py-1 hover:text-[#141413] hover:underline underline-offset-8 decoration-[#141413]/40 transition-colors whitespace-nowrap shrink-0"
          >
            Lokasi
          </a>
          <button
            type="button"
            onClick={onOpenOrders}
            className="py-1 hover:text-[#141413] hover:underline underline-offset-8 decoration-[#141413]/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Pesanan{orderCount > 0 ? ` (${orderCount})` : ''}
          </button>
        </nav>

        {/* Zone 3: Single primary action (+ mobile menu toggle on small screens) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Buka keranjang belanja, ${cartCount} item`}
            data-testid="header-cart-button"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Keranjang</span>
            <span
              data-testid="header-cart-count"
              className="font-mono tabular-nums text-white/90"
            >
              ({cartCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-[#E4E4E0] bg-white text-[#141413] hover:bg-[#F1F1EE] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navigasi seluler"
          className="md:hidden border-t border-[#E4E4E0] bg-[#F8F8F6] px-5 py-4 flex flex-col gap-1"
        >
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 text-sm font-medium text-[#141413] border-b border-[#E4E4E0]/70"
          >
            Menu
          </a>
          <a
            href="#cerita"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 text-sm font-medium text-[#141413] border-b border-[#E4E4E0]/70"
          >
            Cerita
          </a>
          <a
            href="#lokasi"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 text-sm font-medium text-[#141413] border-b border-[#E4E4E0]/70"
          >
            Lokasi
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrders();
            }}
            className="py-3 text-left text-sm font-medium text-[#141413] cursor-pointer"
          >
            Pesanan Saya{orderCount > 0 ? ` (${orderCount})` : ''}
          </button>
        </nav>
      )}
    </header>
  );
}
