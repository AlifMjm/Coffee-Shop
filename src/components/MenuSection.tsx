import { Minus, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/menuData';
import type {
  CartItem,
  MenuCategory,
  MenuItem,
  ServingTemp,
} from '../types/coffee';
import {
  buildCartItemKey,
  calculateItemUnitPrice,
  filterMenuItems,
  formatIDR,
} from '../utils/orderMath';
import { ResilientImage } from './ResilientImage';

interface MenuSectionProps {
  items: MenuItem[];
  cart: CartItem[];
  selectedCategory: MenuCategory | 'Semua';
  selectedTemp: 'Semua' | ServingTemp;
  searchQuery: string;
  onCategoryChange: (cat: MenuCategory | 'Semua') => void;
  onTempChange: (temp: 'Semua' | ServingTemp) => void;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  onQuickAdd: (item: MenuItem) => void;
  onUpdateDefaultQty: (key: string, delta: number) => void;
  onCustomize: (item: MenuItem) => void;
}

const TEMP_OPTIONS: Array<'Semua' | ServingTemp> = ['Semua', 'Dingin', 'Panas'];

export function MenuSection({
  items,
  cart,
  selectedCategory,
  selectedTemp,
  searchQuery,
  onCategoryChange,
  onTempChange,
  onSearchChange,
  onResetFilters,
  onQuickAdd,
  onUpdateDefaultQty,
  onCustomize,
}: MenuSectionProps) {
  const filteredItems = filterMenuItems(
    items,
    selectedCategory,
    selectedTemp,
    searchQuery
  );

  return (
    <section
      id="menu"
      className="scroll-mt-16 py-14 sm:py-20 border-t border-[#E4E4E0]"
      aria-labelledby="menu-heading"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
          <div className="space-y-2 max-w-xl">
            <h2
              id="menu-heading"
              className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#141413]"
            >
              Menu Seduh &amp; Pastry
            </h2>
            <p className="text-sm sm:text-[15px] text-[#5C5C57] leading-relaxed">
              Pilih langsung untuk pesan cepat atau klik kustomisasi untuk mengatur susu, tingkat kemanisan, ukuran, serta catatan barista.
            </p>
          </div>

          {/* Accessible Search Input */}
          <div className="w-full md:w-72">
            <label htmlFor="menu-search" className="sr-only">
              Cari menu kopi atau pastry
            </label>
            <div className="relative">
              <Search
                className="h-4 w-4 text-[#5C5C57] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari kopi, matcha, V60..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-[#E4E4E0] rounded-md text-[#141413] placeholder:text-[#5C5C57]/75 focus:border-[#1C3B2E] transition-colors min-h-[42px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Hapus kata kunci pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5C5C57] hover:text-[#141413] cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8">
          {/* Category Segmented Tabs */}
          <div
            role="tablist"
            aria-label="Kategori menu"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
          >
            {MENU_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onCategoryChange(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                    active
                      ? 'bg-[#141413] text-white'
                      : 'bg-white text-[#5C5C57] border border-[#E4E4E0] hover:text-[#141413] hover:border-[#141413]/30'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Temperature Filter */}
          <div
            role="group"
            aria-label="Filter suhu penyajian"
            className="inline-flex items-center gap-1 p-1 bg-[#EFEFEB] rounded-md self-start sm:self-auto"
          >
            {TEMP_OPTIONS.map((temp) => {
              const active = selectedTemp === temp;
              return (
                <button
                  key={temp}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTempChange(temp)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[34px] ${
                    active
                      ? 'bg-white text-[#141413] shadow-xs'
                      : 'text-[#5C5C57] hover:text-[#141413]'
                  }`}
                >
                  {temp === 'Semua' ? 'Semua Suhu' : temp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Count Metadata */}
        <div className="pb-5 flex items-center justify-between text-xs text-[#5C5C57]">
          <p data-testid="menu-result-count" className="tabular-nums">
            Menampilkan {filteredItems.length} dari {items.length} menu
          </p>
          {(selectedCategory !== 'Semua' ||
            selectedTemp !== 'Semua' ||
            searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[#1C3B2E] font-medium hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Menu Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-[#E4E4E0] rounded-xl px-6 py-16 text-center space-y-4">
            <p className="font-display text-xl text-[#141413]">
              Menu yang dicari tidak ditemukan
            </p>
            <p className="text-sm text-[#5C5C57] max-w-md mx-auto">
              Coba ubah kategori, filter suhu, atau hapus kata kunci pencarian untuk melihat seluruh daftar seduhan kami.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors cursor-pointer min-h-[42px]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div
            data-testid="menu-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {filteredItems.map((item) => {
              const defaultKey = buildCartItemKey(
                item.id,
                item.defaultCustomization
              );
              const existingDefault = cart.find((c) => c.key === defaultKey);
              const totalInCartForItem = cart
                .filter((c) => c.menuItem.id === item.id)
                .reduce((sum, entry) => sum + entry.quantity, 0);
              const defaultUnitPrice = calculateItemUnitPrice(
                item,
                item.defaultCustomization
              );

              return (
                <article
                  key={item.id}
                  data-testid={`menu-card-${item.id}`}
                  className="group bg-white border border-[#E4E4E0] rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {/* 4:3 Product Photography — Clickable to Customize */}
                  <button
                    type="button"
                    onClick={() => onCustomize(item)}
                    aria-label={`Lihat detail dan kustomisasi ${item.name}`}
                    className="aspect-[4/3] w-full bg-[#EFEFEB] overflow-hidden block text-left cursor-pointer"
                  >
                    <ResilientImage
                      src={item.image}
                      alt={item.imageAlt}
                      fallbackLabel={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>

                  {/* Card Body — Identical Field Order Across All Cards */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                    <div className="space-y-2">
                      {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#5C5C57]">
                        <span className="truncate">
                          {item.category} · {item.availableTemps.join(' / ')}
                          {item.featuredTag ? ` · ${item.featuredTag}` : ''}
                        </span>
                        {totalInCartForItem > 0 && (
                          <span className="font-mono tabular-nums tracking-tight text-[#1C3B2E] font-medium shrink-0">
                            {totalInCartForItem} di keranjang
                          </span>
                        )}
                      </div>

                      {/* Title & Price Baseline */}
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-sans text-base font-semibold text-[#141413] leading-snug">
                          {item.name}
                        </h3>
                        <span className="font-mono text-[15px] font-medium tabular-nums tracking-tight text-[#141413] shrink-0">
                          {formatIDR(defaultUnitPrice)}
                        </span>
                      </div>

                      <p className="text-[13px] leading-relaxed text-[#5C5C57]">
                        {item.tastingNotes}
                      </p>
                    </div>

                    {/* Action Row */}
                    <div className="pt-3 border-t border-[#E4E4E0]/80 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onCustomize(item)}
                        aria-label={`Kustomisasi ${item.name}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#141413] bg-[#F8F8F6] hover:bg-[#EFEFEB] border border-[#E4E4E0] rounded-md transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                      >
                        <SlidersHorizontal
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        <span>Kustomisasi</span>
                      </button>

                      {existingDefault ? (
                        <div className="inline-flex items-center border border-[#1C3B2E] rounded-md bg-white min-h-[40px]">
                          <button
                            type="button"
                            onClick={() => onUpdateDefaultQty(defaultKey, -1)}
                            aria-label={`Kurangi jumlah ${item.name}`}
                            className="px-2.5 h-full inline-flex items-center justify-center text-[#1C3B2E] hover:bg-[#1C3B2E]/10 transition-colors cursor-pointer min-w-[36px] min-h-[40px]"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium tabular-nums text-[#141413]">
                            {existingDefault.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateDefaultQty(defaultKey, 1)}
                            aria-label={`Tambah jumlah ${item.name}`}
                            className="px-2.5 h-full inline-flex items-center justify-center text-[#1C3B2E] hover:bg-[#1C3B2E]/10 transition-colors cursor-pointer min-w-[36px] min-h-[40px]"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onQuickAdd(item)}
                          aria-label={`Tambah ${item.name} ke keranjang`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Tambah</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
