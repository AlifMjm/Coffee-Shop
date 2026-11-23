import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { PRICING_ADDONS } from '../data/menuData';
import type {
  DrinkSize,
  ItemCustomization,
  MenuItem,
  MilkOption,
  SugarLevel,
} from '../types/coffee';
import { calculateItemUnitPrice, formatIDR } from '../utils/orderMath';
import { ResilientImage } from './ResilientImage';

interface CustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    customization: ItemCustomization,
    quantity: number
  ) => void;
}

const SIZES: DrinkSize[] = ['Regular', 'Large'];
const MILKS: MilkOption[] = ['Fresh Milk', 'Oat Milk', 'Almond Milk'];
const SUGARS: SugarLevel[] = [
  'Normal (100%)',
  'Sedikit (50%)',
  'Tanpa Gula (0%)',
];

export function CustomizeModal({
  item,
  onClose,
  onAddToCart,
}: CustomizeModalProps) {
  const [customization, setCustomization] = useState<ItemCustomization>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      setCustomization({ ...item.defaultCustomization });
      setQuantity(1);
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const unitPrice = calculateItemUnitPrice(item, customization);
  const lineTotal = unitPrice * quantity;

  const getMilkSurchargeLabel = (milk: MilkOption): string => {
    const defaultMilk = item.defaultCustomization.milk;
    if (milk === defaultMilk) return '';
    if (milk === 'Oat Milk' && defaultMilk === 'Fresh Milk') {
      return ` (+${formatIDR(PRICING_ADDONS.oatMilk)})`;
    }
    if (milk === 'Almond Milk') {
      const delta =
        defaultMilk === 'Oat Milk'
          ? PRICING_ADDONS.almondMilk - PRICING_ADDONS.oatMilk
          : PRICING_ADDONS.almondMilk;
      return ` (+${formatIDR(delta)})`;
    }
    return '';
  };

  const handleConfirm = () => {
    onAddToCart(item, customization, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#141413]/45 backdrop-blur-[2px] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
    >
      {/* Backdrop click target */}
      <button
        type="button"
        aria-label="Tutup jendela kustomisasi"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
      />

      <div className="relative z-10 w-full sm:max-w-xl max-h-[92vh] bg-[#F8F8F6] rounded-t-2xl sm:rounded-xl border border-[#E4E4E0] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E4E4E0]">
          <div>
            <p className="text-xs text-[#5C5C57]">
              {item.category}
              {item.origin ? ` · ${item.origin}` : ''}
            </p>
            <h2
              id="customize-modal-title"
              className="font-display text-xl font-medium text-[#141413]"
            >
              {item.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup kustomisasi"
            className="w-10 h-10 inline-flex items-center justify-center rounded-md text-[#5C5C57] hover:text-[#141413] hover:bg-[#F1F1EE] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-6">
          {/* Item Preview Strip */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-20 rounded-lg overflow-hidden bg-[#EFEFEB] shrink-0 border border-[#E4E4E0]">
              <ResilientImage
                src={item.image}
                alt={item.imageAlt}
                fallbackLabel={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#5C5C57] leading-relaxed">
                {item.description}
              </p>
              <p className="text-xs text-[#5C5C57] font-mono tabular-nums">
                Harga dasar {formatIDR(item.basePrice)} · Estimasi {item.prepMinutes} menit
              </p>
            </div>
          </div>

          {/* Temperature Selection */}
          {item.availableTemps.length > 1 && (
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-semibold text-[#141413]">
                Suhu Penyajian
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                {item.availableTemps.map((temp) => {
                  const selected = customization.temp === temp;
                  return (
                    <button
                      key={temp}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, temp }))
                      }
                      className={`px-4 py-2.5 text-sm font-medium rounded-md border transition-colors cursor-pointer min-h-[42px] ${
                        selected
                          ? 'bg-[#141413] text-white border-[#141413]'
                          : 'bg-white text-[#141413] border-[#E4E4E0] hover:border-[#141413]/40'
                      }`}
                    >
                      {temp}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Size Selection */}
          {item.supportsSize && (
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-semibold text-[#141413]">
                Ukuran Gelas
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                {SIZES.map((size) => {
                  const selected = customization.size === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, size }))
                      }
                      className={`px-4 py-2.5 text-sm font-medium rounded-md border transition-colors cursor-pointer min-h-[42px] ${
                        selected
                          ? 'bg-[#141413] text-white border-[#141413]'
                          : 'bg-white text-[#141413] border-[#E4E4E0] hover:border-[#141413]/40'
                      }`}
                    >
                      {size}
                      {size === 'Large' ? ` (+${formatIDR(PRICING_ADDONS.largeSize)})` : ''}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Milk Selection */}
          {item.supportsMilk && (
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-semibold text-[#141413]">
                Pilihan Susu
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {MILKS.map((milk) => {
                  const selected = customization.milk === milk;
                  return (
                    <button
                      key={milk}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, milk }))
                      }
                      className={`px-3 py-2.5 text-xs sm:text-sm font-medium rounded-md border transition-colors cursor-pointer min-h-[42px] ${
                        selected
                          ? 'bg-[#141413] text-white border-[#141413]'
                          : 'bg-white text-[#141413] border-[#E4E4E0] hover:border-[#141413]/40'
                      }`}
                    >
                      {milk}
                      {getMilkSurchargeLabel(milk)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Sugar Level */}
          {item.supportsSugar && (
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-semibold text-[#141413]">
                Tingkat Kemanisan
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SUGARS.map((sugar) => {
                  const selected = customization.sugar === sugar;
                  return (
                    <button
                      key={sugar}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setCustomization((prev) => ({ ...prev, sugar }))
                      }
                      className={`px-3 py-2.5 text-xs sm:text-sm font-medium rounded-md border transition-colors cursor-pointer min-h-[42px] ${
                        selected
                          ? 'bg-[#141413] text-white border-[#141413]'
                          : 'bg-white text-[#141413] border-[#E4E4E0] hover:border-[#141413]/40'
                      }`}
                    >
                      {sugar}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Extra Shot Toggle */}
          {item.supportsExtraShot && (
            <div className="flex items-center justify-between gap-4 p-4 bg-white border border-[#E4E4E0] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#141413]">
                  Tambah Extra Espresso Shot
                </p>
                <p className="text-xs text-[#5C5C57] font-mono tabular-nums">
                  +{formatIDR(PRICING_ADDONS.extraShot)}
                </p>
              </div>
              <input
                id="extra-shot-checkbox"
                type="checkbox"
                checked={Boolean(customization.extraShot)}
                onChange={(e) =>
                  setCustomization((prev) => ({
                    ...prev,
                    extraShot: e.target.checked,
                  }))
                }
                aria-label="Tambah Extra Espresso Shot"
                className="h-5 w-5 accent-[#1C3B2E] rounded cursor-pointer"
              />
            </div>
          )}

          {/* Pastry Warm-Up Option */}
          {item.supportsWarmUp && (
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-semibold text-[#141413]">
                Penyajian Pastry
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  aria-pressed={Boolean(customization.warmedUp)}
                  onClick={() =>
                    setCustomization((prev) => ({ ...prev, warmedUp: true }))
                  }
                  className={`px-4 py-2.5 text-sm font-medium rounded-md border transition-colors cursor-pointer min-h-[42px] ${
                    customization.warmedUp
                      ? 'bg-[#141413] text-white border-[#141413]'
                      : 'bg-white text-[#141413] border-[#E4E4E0]'
                  }`}
                >
                  Dihangatkan
                </button>
                <button
                  type="button"
                  aria-pressed={!customization.warmedUp}
                  onClick={() =>
                    setCustomization((prev) => ({ ...prev, warmedUp: false }))
                  }
                  className={`px-4 py-2.5 text-sm font-medium rounded-md border transition-colors cursor-pointer min-h-[42px] ${
                    !customization.warmedUp
                      ? 'bg-[#141413] text-white border-[#141413]'
                      : 'bg-white text-[#141413] border-[#E4E4E0]'
                  }`}
                >
                  Suhu Ruang
                </button>
              </div>
            </fieldset>
          )}

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label
              htmlFor="custom-item-note"
              className="block text-xs font-semibold text-[#141413]"
            >
              Catatan Khusus (Opsional)
            </label>
            <textarea
              id="custom-item-note"
              rows={2}
              value={customization.note ?? ''}
              onChange={(e) =>
                setCustomization((prev) => ({ ...prev, note: e.target.value }))
              }
              placeholder="Contoh: Es sedikit, pisah gula, atau potong dua..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E4E4E0] rounded-md text-[#141413] placeholder:text-[#5C5C57]/70 focus:border-[#1C3B2E] resize-none"
            />
          </div>
        </div>

        {/* Sticky Purchase Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E4E4E0] flex items-center gap-4">
          <div className="inline-flex items-center border border-[#E4E4E0] rounded-md bg-[#F8F8F6]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Kurangi jumlah pesanan"
              className="w-10 h-11 inline-flex items-center justify-center text-[#141413] hover:bg-[#EFEFEB] transition-colors cursor-pointer"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span
              data-testid="customize-qty"
              className="w-9 text-center text-sm font-mono font-medium tabular-nums text-[#141413]"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Tambah jumlah pesanan"
              className="w-10 h-11 inline-flex items-center justify-center text-[#141413] hover:bg-[#EFEFEB] transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            data-testid="customize-add-button"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
          >
            <span>Tambah ke Keranjang</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{formatIDR(lineTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
