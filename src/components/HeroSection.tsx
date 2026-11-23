import { ArrowDownRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onOpenOrders: () => void;
  hasOrders: boolean;
}

export function HeroSection({ onOpenOrders, hasOrders }: HeroSectionProps) {
  return (
    <section id="beranda" className="pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* 2-Column Asymmetric Architectural Split with items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2 sm:py-4">
            <div className="space-y-6">
              <p className="text-xs sm:text-sm font-medium text-[#5C5C57] tracking-wide">
                Kemang, Jakarta Selatan · Seduh Harian sejak 2021
              </p>

              <h1 className="font-display text-[clamp(2.25rem,4vw,3.6rem)] leading-[1.08] font-normal tracking-[-0.02em] text-[#141413]">
                Kopi spesialti yang diseduh tenang, dipesan tanpa antre.
              </h1>

              <p className="text-[15px] sm:text-base leading-relaxed text-[#5C5C57] max-w-[44ch]">
                Biji single-origin Nusantara sangrai mingguan dan pastry panggang pagi. Pilih takaran susu, gula, dan suhu sesuai selera lalu ambil di bar atau antar langsung ke meja kerja Anda.
              </p>
            </div>

            <div className="pt-8 lg:pt-12 flex flex-wrap items-center gap-x-5 gap-y-2.5">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
              >
                <span>Jelajahi Menu &amp; Pesan</span>
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpenOrders}
                className="inline-flex items-center py-2.5 text-sm font-medium text-[#141413] underline underline-offset-6 decoration-[#141413]/35 hover:decoration-[#141413] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                {hasOrders ? 'Lacak Pesanan Aktif' : 'Cek Riwayat Pesanan'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-full min-h-[280px] lg:min-h-[440px] rounded-xl overflow-hidden bg-[#ECECE8] border border-[#E4E4E0]">
              <ResilientImage
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                priority
                fallbackLabel="Bar Kopi Kala Seduh"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quiet Info Strip Below Hero Split */}
        <div className="mt-10 sm:mt-14 pt-6 border-t border-[#E4E4E0] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <p className="text-xs text-[#5C5C57]">Jam Operasional</p>
            <p className="mt-1 text-sm font-semibold text-[#141413] font-mono tabular-nums tracking-tight">
              07.00 – 21.00 WIB
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5C5C57]">Estimasi Penyeduhan</p>
            <p className="mt-1 text-sm font-semibold text-[#141413] font-mono tabular-nums tracking-tight">
              8 – 12 Menit
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5C5C57]">Opsi Pemesanan</p>
            <p className="mt-1 text-sm font-semibold text-[#141413]">
              Ambil di Kedai · Antar Kurir
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5C5C57]">Gratis Ongkir Kemang</p>
            <p className="mt-1 text-sm font-semibold text-[#141413] font-mono tabular-nums tracking-tight">
              Min. Rp100.000
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
