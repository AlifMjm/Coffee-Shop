import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react';
import {
  CRAFT_PRINCIPLES,
  ROASTERY_IMAGE,
  TESTIMONIALS,
} from '../data/menuData';
import { ResilientImage } from './ResilientImage';

interface StoryAndLocationProps {
  onOpenCart: () => void;
  onOpenOrders: () => void;
}

export function StoryAndLocation({
  onOpenCart,
  onOpenOrders,
}: StoryAndLocationProps) {
  return (
    <>
      {/* Craftsmanship & Story Section */}
      <section
        id="cerita"
        className="scroll-mt-16 py-16 sm:py-24 border-t border-[#E4E4E0]"
        aria-labelledby="cerita-heading"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-6">
              <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px] rounded-xl overflow-hidden bg-[#ECECE8] border border-[#E4E4E0]">
                <ResilientImage
                  src={ROASTERY_IMAGE.src}
                  alt={ROASTERY_IMAGE.alt}
                  fallbackLabel="Ruang Sangrai Kala Seduh"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#5C5C57] tracking-wide">
                  Dari Kebun Nusantara ke Cangkir Anda
                </p>
                <h2
                  id="cerita-heading"
                  className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#141413]"
                >
                  Disangrai kecil, diseduh dengan presisi setiap pagi.
                </h2>
                <p className="text-[15px] leading-relaxed text-[#5C5C57]">
                  Kala Seduh bekerja langsung bersama petani kopi di Aceh Gayo, Flores Bajawa, dan Kintamani. Setiap pesanan online terhubung langsung ke layar bar sehingga minuman Anda baru diekstraksi beberapa menit sebelum Anda tiba.
                </p>
              </div>

              {/* Clean Editorial Numbered Principles */}
              <div className="divide-y divide-[#E4E4E0] border-t border-b border-[#E4E4E0]">
                {CRAFT_PRINCIPLES.map((item) => (
                  <div
                    key={item.number}
                    className="py-5 grid grid-cols-12 gap-4 items-baseline"
                  >
                    <span className="col-span-2 font-mono text-xs font-medium text-[#6E4F3A] tabular-nums">
                      {item.number}.
                    </span>
                    <div className="col-span-10 space-y-1">
                      <h3 className="font-sans text-[15px] font-semibold text-[#141413]">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#5C5C57]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Adjacent Attributable Customer Proof */}
          <div className="mt-14 pt-12 border-t border-[#E4E4E0] grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((entry) => (
              <figure
                key={entry.author}
                className="bg-white border border-[#E4E4E0] rounded-xl p-6 sm:p-7 flex flex-col justify-between gap-5"
              >
                <blockquote className="text-[15px] leading-relaxed text-[#141413]">
                  “{entry.quote}”
                </blockquote>
                <figcaption className="text-xs text-[#5C5C57]">
                  <span className="font-semibold text-[#141413]">
                    {entry.author}
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span>{entry.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Quiet Footer */}
      <footer
        id="lokasi"
        className="scroll-mt-16 border-t border-[#E4E4E0] bg-white"
        aria-labelledby="lokasi-heading"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E4E4E0]">
            <div className="md:col-span-5 space-y-4">
              <p className="font-display text-2xl font-medium tracking-tight text-[#141413]">
                Kala Seduh
              </p>
              <p
                id="lokasi-heading"
                className="text-sm leading-relaxed text-[#5C5C57] max-w-sm"
              >
                Ruang seduh tenang untuk memulai hari, bekerja tanpa bising, atau mengambil kopi spesialti favorit Anda dalam hitungan menit.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors whitespace-nowrap min-h-[40px]"
                >
                  <span>Pesan Online Sekarang</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={onOpenOrders}
                  className="text-xs font-medium text-[#141413] underline underline-offset-4 decoration-[#141413]/40 hover:decoration-[#141413] cursor-pointer py-2"
                >
                  Lacak Pesanan
                </button>
              </div>
            </div>

            <div className="md:col-span-4 space-y-3 text-sm">
              <p className="font-semibold text-[#141413]">Alamat &amp; Jam Buka</p>
              <div className="space-y-2.5 text-[#5C5C57]">
                <p className="flex items-start gap-2.5">
                  <MapPin
                    className="h-4 w-4 text-[#1C3B2E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Jl. Kemang Timur No. 42B, Bangka, Jakarta Selatan 12730
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Clock
                    className="h-4 w-4 text-[#1C3B2E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="tabular-nums">
                    Setiap hari · 07.00 – 21.00 WIB
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Phone
                    className="h-4 w-4 text-[#1C3B2E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="font-mono tabular-nums">
                    +62 812-8400-2910
                  </span>
                </p>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3 text-sm">
              <p className="font-semibold text-[#141413]">Tautan Cepat</p>
              <ul className="space-y-2 text-[#5C5C57]">
                <li>
                  <a href="#menu" className="hover:text-[#141413] transition-colors">
                    Menu Kopi &amp; Pastry
                  </a>
                </li>
                <li>
                  <a href="#cerita" className="hover:text-[#141413] transition-colors">
                    Filosofi Sangrai
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="hover:text-[#141413] transition-colors cursor-pointer"
                  >
                    Keranjang Belanja
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenOrders}
                    className="hover:text-[#141413] transition-colors cursor-pointer"
                  >
                    Status &amp; Riwayat Pesanan
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5C5C57]">
            <p>© 2026 Kala Seduh Coffee &amp; Roastery. Hak cipta dilindungi.</p>
            <p>Kode promo aktif: <span className="font-mono font-medium text-[#141413]">KALA10</span> · <span className="font-mono font-medium text-[#141413]">SEDUHPAGI</span></p>
          </div>
        </div>
      </footer>
    </>
  );
}
