import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { PICKUP_TIME_SLOTS, PRICING_ADDONS } from '../data/menuData';
import type {
  CartItem,
  CheckoutFormInput,
  CheckoutValidationErrors,
  FulfillmentMethod,
  OrderRecord,
  PaymentMethod,
} from '../types/coffee';
import {
  calculateOrderSummary,
  evaluatePromoCode,
  formatCustomizationSummary,
  formatIDR,
  validateCheckoutForm,
} from '../utils/orderMath';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCompleteOrder: (
    customer: CheckoutFormInput,
    promoCode: string
  ) => OrderRecord;
  onOpenOrderHistory: () => void;
}

type DrawerStep = 'cart' | 'checkout' | 'confirmed';

const PAYMENT_METHODS: PaymentMethod[] = [
  'QRIS',
  'Transfer Bank',
  'Bayar di Kasir',
];

const INITIAL_FORM: CheckoutFormInput = {
  customerName: '',
  phone: '',
  fulfillment: 'pickup',
  pickupTime: PICKUP_TIME_SLOTS[0],
  address: '',
  paymentMethod: 'QRIS',
  baristaNote: '',
};

export function CartDrawer({
  open,
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCompleteOrder,
  onOpenOrderHistory,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>('pickup');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [form, setForm] = useState<CheckoutFormInput>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<CheckoutValidationErrors>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Reset back to cart view when reopened after an already-confirmed order
  useEffect(() => {
    if (open && step === 'confirmed' && cart.length > 0) {
      setStep('cart');
      setConfirmedOrder(null);
    }
  }, [open, step, cart.length]);

  if (!open) return null;

  const summary = calculateOrderSummary(cart, fulfillment, appliedPromo);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = promoInput.trim().toUpperCase();
    if (!trimmed) {
      setPromoError('Masukkan kode promo terlebih dahulu.');
      return;
    }
    const result = evaluatePromoCode(trimmed, summary.subtotal);
    if (!result.valid) {
      setPromoError(result.error ?? 'Kode promo tidak valid.');
      return;
    }
    setAppliedPromo(trimmed);
    setPromoError('');
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoInput('');
    setPromoError('');
  };

  const handleProceedToCheckout = () => {
    setForm((prev) => ({ ...prev, fulfillment }));
    setFormErrors({});
    setStep('checkout');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const nextForm: CheckoutFormInput = { ...form, fulfillment };
    const errors = validateCheckoutForm(nextForm);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const order = onCompleteOrder(nextForm, appliedPromo);
    setConfirmedOrder(order);
    setAppliedPromo('');
    setPromoInput('');
    setPromoError('');
    setForm(INITIAL_FORM);
    setStep('confirmed');
  };

  const handleDrawerClose = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#141413]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup keranjang belanja"
        onClick={handleDrawerClose}
        className="fixed inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-md bg-[#F8F8F6] h-full flex flex-col border-l border-[#E4E4E0] shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E4E4E0] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Kembali ke keranjang"
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-[#5C5C57] hover:text-[#141413] hover:bg-[#F1F1EE] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <div>
              <h2
                id="cart-drawer-title"
                className="font-display text-xl font-medium text-[#141413]"
              >
                {step === 'cart' && 'Keranjang Pesanan'}
                {step === 'checkout' && 'Detail Pemesanan'}
                {step === 'confirmed' && 'Pesanan Dikonfirmasi'}
              </h2>
              {step !== 'confirmed' && (
                <p className="text-xs text-[#5C5C57] tabular-nums">
                  {summary.itemCount} item · {fulfillment === 'pickup' ? 'Ambil di Kedai' : 'Antar Kurir'}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDrawerClose}
            aria-label="Tutup panel pesanan"
            className="w-10 h-10 inline-flex items-center justify-center rounded-md text-[#5C5C57] hover:text-[#141413] hover:bg-[#F1F1EE] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* STEP 1: CART VIEW */}
        {step === 'cart' && (
          <>
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#EFEFEB] flex items-center justify-center text-[#5C5C57]">
                  <ShoppingBag className="h-6 w-6 stroke-[1.6]" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-display text-xl text-[#141413]">
                    Keranjang masih kosong
                  </p>
                  <p className="text-sm text-[#5C5C57] max-w-xs">
                    Pilih kopi atau pastry dari menu untuk memulai pesanan ambil di kedai atau antar kurir.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDrawerClose}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors cursor-pointer min-h-[42px]"
                >
                  Lihat Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                  {/* Fulfillment Method Switch */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#141413]">
                      Metode Pengambilan
                    </p>
                    <div
                      role="group"
                      aria-label="Pilih metode pengambilan"
                      className="grid grid-cols-2 gap-1.5 p-1 bg-[#EFEFEB] rounded-md"
                    >
                      <button
                        type="button"
                        aria-pressed={fulfillment === 'pickup'}
                        onClick={() => setFulfillment('pickup')}
                        className={`py-2 text-xs font-medium rounded transition-colors cursor-pointer min-h-[38px] ${
                          fulfillment === 'pickup'
                            ? 'bg-white text-[#141413] shadow-xs'
                            : 'text-[#5C5C57] hover:text-[#141413]'
                        }`}
                      >
                        Ambil di Kedai
                      </button>
                      <button
                        type="button"
                        aria-pressed={fulfillment === 'delivery'}
                        onClick={() => setFulfillment('delivery')}
                        className={`py-2 text-xs font-medium rounded transition-colors cursor-pointer min-h-[38px] ${
                          fulfillment === 'delivery'
                            ? 'bg-white text-[#141413] shadow-xs'
                            : 'text-[#5C5C57] hover:text-[#141413]'
                        }`}
                      >
                        Antar Kurir
                      </button>
                    </div>

                    {fulfillment === 'delivery' && (
                      <p className="text-xs text-[#5C5C57] tabular-nums">
                        {summary.freeDeliveryRemaining > 0
                          ? `Tambah ${formatIDR(summary.freeDeliveryRemaining)} lagi untuk gratis ongkir (min. ${formatIDR(PRICING_ADDONS.freeDeliveryThreshold)}).`
                          : 'Pesanan Anda memenuhi syarat gratis ongkir area Kemang.'}
                      </p>
                    )}
                  </div>

                  {/* Itemized Cart List */}
                  <ul className="divide-y divide-[#E4E4E0] border-t border-b border-[#E4E4E0]">
                    {cart.map((entry) => {
                      const customText = formatCustomizationSummary(
                        entry.menuItem,
                        entry.customization
                      );
                      return (
                        <li
                          key={entry.key}
                          data-testid={`cart-item-${entry.menuItem.id}`}
                          className="py-4 flex gap-3.5"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#EFEFEB] shrink-0 border border-[#E4E4E0]">
                            <ResilientImage
                              src={entry.menuItem.image}
                              alt={entry.menuItem.imageAlt}
                              fallbackLabel={entry.menuItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-[#141413] leading-snug">
                                {entry.menuItem.name}
                              </p>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(entry.key)}
                                aria-label={`Hapus ${entry.menuItem.name} dari keranjang`}
                                className="p-1 text-[#5C5C57] hover:text-red-700 transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </div>

                            {customText && (
                              <p className="text-xs text-[#5C5C57] leading-relaxed">
                                {customText}
                              </p>
                            )}

                            {entry.customization.note && (
                              <p className="text-xs text-[#6E4F3A] italic">
                                Catatan: {entry.customization.note}
                              </p>
                            )}

                            <div className="pt-2 flex items-center justify-between gap-3">
                              <span className="font-mono text-xs font-medium tabular-nums text-[#141413]">
                                {formatIDR(entry.unitPrice * entry.quantity)}
                              </span>

                              <div className="inline-flex items-center border border-[#E4E4E0] rounded bg-white">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQty(entry.key, -1)}
                                  aria-label={`Kurangi ${entry.menuItem.name}`}
                                  className="w-8 h-8 inline-flex items-center justify-center text-[#141413] hover:bg-[#F1F1EE] cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" aria-hidden="true" />
                                </button>
                                <span className="w-7 text-center text-xs font-mono tabular-nums text-[#141413]">
                                  {entry.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQty(entry.key, 1)}
                                  aria-label={`Tambah ${entry.menuItem.name}`}
                                  className="w-8 h-8 inline-flex items-center justify-center text-[#141413] hover:bg-[#F1F1EE] cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Promo Code Section */}
                  <div className="space-y-2">
                    <label
                      htmlFor="promo-code-input"
                      className="block text-xs font-semibold text-[#141413]"
                    >
                      Kode Promo
                    </label>
                    {appliedPromo && summary.discount > 0 ? (
                      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white border border-[#1C3B2E]/35 rounded-md">
                        <div className="flex items-center gap-2 text-xs text-[#1C3B2E] font-medium">
                          <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{summary.promoLabel}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-xs font-medium text-[#5C5C57] hover:text-[#141413] underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <input
                            id="promo-code-input"
                            type="text"
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value);
                              if (promoError) setPromoError('');
                            }}
                            placeholder="Masukkan kode (cth: KALA10)"
                            className="flex-1 px-3 py-2 text-sm bg-white border border-[#E4E4E0] rounded-md text-[#141413] placeholder:text-[#5C5C57]/70 uppercase font-mono tracking-tight min-h-[40px]"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 text-xs font-medium text-[#141413] bg-white border border-[#E4E4E0] hover:border-[#141413] rounded-md transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                          >
                            Terapkan
                          </button>
                        </form>
                        <p className="text-[11px] text-[#5C5C57]">
                          Coba <span className="font-mono font-medium text-[#141413]">KALA10</span> (10%) atau <span className="font-mono font-medium text-[#141413]">SEDUHPAGI</span> (Rp10rb min. Rp60rb).
                        </p>
                      </div>
                    )}
                    {promoError && (
                      <p role="alert" className="text-xs text-red-700">
                        {promoError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sticky Totals & Checkout CTA */}
                <div className="px-6 py-5 bg-white border-t border-[#E4E4E0] space-y-4">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-[#5C5C57]">
                      <dt>Subtotal</dt>
                      <dd className="font-mono tabular-nums tracking-tight text-[#141413]">
                        {formatIDR(summary.subtotal)}
                      </dd>
                    </div>
                    {summary.discount > 0 && (
                      <div className="flex justify-between text-[#1C3B2E]">
                        <dt>Diskon Promo</dt>
                        <dd
                          data-testid="cart-discount"
                          className="font-mono tabular-nums tracking-tight font-medium"
                        >
                          {formatIDR(-summary.discount)}
                        </dd>
                      </div>
                    )}
                    {fulfillment === 'delivery' && (
                      <div className="flex justify-between text-[#5C5C57]">
                        <dt>Ongkos Kirim</dt>
                        <dd className="font-mono tabular-nums tracking-tight text-[#141413]">
                          {summary.deliveryFee === 0
                            ? 'Gratis'
                            : formatIDR(summary.deliveryFee)}
                        </dd>
                      </div>
                    )}
                    <div className="pt-2.5 mt-2 border-t border-[#E4E4E0] flex justify-between font-semibold text-[#141413]">
                      <dt>Total Pembayaran</dt>
                      <dd
                        data-testid="cart-total"
                        className="font-mono tabular-nums tracking-tight text-base"
                      >
                        {formatIDR(summary.total)}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 px-5 text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors cursor-pointer min-h-[44px]"
                  >
                    Lanjut ke Pemesanan
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM */}
        {step === 'checkout' && (
          <form
            onSubmit={handleSubmitOrder}
            noValidate
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Customer Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-[#141413]"
                >
                  Nama Pemesan
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, customerName: e.target.value }));
                    if (formErrors.customerName) {
                      setFormErrors((prev) => ({ ...prev, customerName: undefined }));
                    }
                  }}
                  placeholder="Contoh: Nadia Pramesti"
                  aria-invalid={Boolean(formErrors.customerName)}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md text-[#141413] placeholder:text-[#5C5C57]/60 min-h-[42px] ${
                    formErrors.customerName
                      ? 'border-red-600'
                      : 'border-[#E4E4E0] focus:border-[#1C3B2E]'
                  }`}
                />
                {formErrors.customerName && (
                  <p role="alert" className="text-xs text-red-700">
                    {formErrors.customerName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-semibold text-[#141413]"
                >
                  Nomor WhatsApp / HP
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, phone: e.target.value }));
                    if (formErrors.phone) {
                      setFormErrors((prev) => ({ ...prev, phone: undefined }));
                    }
                  }}
                  placeholder="0812-3456-7890"
                  aria-invalid={Boolean(formErrors.phone)}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md text-[#141413] font-mono placeholder:font-sans placeholder:text-[#5C5C57]/60 min-h-[42px] ${
                    formErrors.phone
                      ? 'border-red-600'
                      : 'border-[#E4E4E0] focus:border-[#1C3B2E]'
                  }`}
                />
                {formErrors.phone && (
                  <p role="alert" className="text-xs text-red-700">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Pickup Time OR Delivery Address */}
              {fulfillment === 'pickup' ? (
                <div className="space-y-1.5">
                  <label
                    htmlFor="checkout-pickup-time"
                    className="block text-xs font-semibold text-[#141413]"
                  >
                    Perkiraan Waktu Ambil di Kedai
                  </label>
                  <select
                    id="checkout-pickup-time"
                    value={form.pickupTime}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, pickupTime: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E4E4E0] rounded-md text-[#141413] min-h-[42px]"
                  >
                    {PICKUP_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#5C5C57]">
                    Ambil langsung di meja bar Jl. Kemang Timur No. 42B.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-semibold text-[#141413]"
                  >
                    Alamat Pengantaran
                  </label>
                  <textarea
                    id="checkout-address"
                    rows={3}
                    required
                    value={form.address}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, address: e.target.value }));
                      if (formErrors.address) {
                        setFormErrors((prev) => ({ ...prev, address: undefined }));
                      }
                    }}
                    placeholder="Nama jalan, nomor gedung/rumah, patokan..."
                    aria-invalid={Boolean(formErrors.address)}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-md text-[#141413] placeholder:text-[#5C5C57]/60 resize-none ${
                      formErrors.address
                        ? 'border-red-600'
                        : 'border-[#E4E4E0] focus:border-[#1C3B2E]'
                    }`}
                  />
                  {formErrors.address && (
                    <p role="alert" className="text-xs text-red-700">
                      {formErrors.address}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-[#141413]">
                  Metode Pembayaran
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const selected = form.paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setForm((prev) => ({ ...prev, paymentMethod: method }))
                        }
                        className={`px-2.5 py-2.5 text-xs font-medium rounded-md border transition-colors cursor-pointer min-h-[42px] ${
                          selected
                            ? 'bg-[#141413] text-white border-[#141413]'
                            : 'bg-white text-[#141413] border-[#E4E4E0] hover:border-[#141413]/40'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Barista Note */}
              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-note"
                  className="block text-xs font-semibold text-[#141413]"
                >
                  Catatan untuk Barista / Kurir (Opsional)
                </label>
                <input
                  id="checkout-note"
                  type="text"
                  value={form.baristaNote}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, baristaNote: e.target.value }))
                  }
                  placeholder="Contoh: Minta sedotan kertas atau tisu tambahan"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E4E4E0] rounded-md text-[#141413] placeholder:text-[#5C5C57]/60 min-h-[42px]"
                />
              </div>

              {/* Compact Order Recap */}
              <div className="p-4 bg-white border border-[#E4E4E0] rounded-lg space-y-2 text-xs">
                <p className="font-semibold text-[#141413]">Ringkasan Item</p>
                {cart.map((entry) => (
                  <div
                    key={entry.key}
                    className="flex justify-between gap-3 text-[#5C5C57]"
                  >
                    <span className="truncate">
                      {entry.quantity}× {entry.menuItem.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#141413] shrink-0">
                      {formatIDR(entry.unitPrice * entry.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button Footer */}
            <div className="px-6 py-5 bg-white border-t border-[#E4E4E0] space-y-3">
              <div className="flex justify-between items-baseline text-sm font-semibold text-[#141413]">
                <span>Total Bayar ({form.paymentMethod})</span>
                <span className="font-mono tabular-nums text-base">
                  {formatIDR(summary.total)}
                </span>
              </div>
              <button
                type="submit"
                data-testid="confirm-order-button"
                className="w-full py-3 px-5 text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors cursor-pointer min-h-[44px]"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER CONFIRMATION RECEIPT */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="p-5 bg-white border border-[#E4E4E0] rounded-xl space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-6 w-6 text-[#1C3B2E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#1C3B2E]">
                      Pesanan Diterima · Status: {confirmedOrder.status}
                    </p>
                    <h3
                      data-testid="confirmed-order-code"
                      className="font-mono text-lg font-medium text-[#141413] tabular-nums"
                    >
                      {confirmedOrder.id} · Antrean #{confirmedOrder.queueNumber}
                    </h3>
                    <p className="text-xs text-[#5C5C57] leading-relaxed">
                      Terima kasih, {confirmedOrder.customer.customerName}. Pesanan Anda telah masuk ke antrean bar kami.
                    </p>
                  </div>
                </div>

                <dl className="pt-4 border-t border-[#E4E4E0] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-[#5C5C57]">Metode</dt>
                    <dd className="mt-0.5 font-medium text-[#141413]">
                      {confirmedOrder.customer.fulfillment === 'pickup'
                        ? 'Ambil di Kedai'
                        : 'Antar Kurir'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5C5C57]">Pembayaran</dt>
                    <dd className="mt-0.5 font-medium text-[#141413]">
                      {confirmedOrder.customer.paymentMethod}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[#5C5C57]">
                      {confirmedOrder.customer.fulfillment === 'pickup'
                        ? 'Waktu Pengambilan'
                        : 'Alamat Pengantaran'}
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#141413]">
                      {confirmedOrder.customer.fulfillment === 'pickup'
                        ? confirmedOrder.customer.pickupTime
                        : confirmedOrder.customer.address}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Receipt Line Items */}
              <div className="p-5 bg-white border border-[#E4E4E0] rounded-xl space-y-3">
                <p className="text-xs font-semibold text-[#141413]">
                  Rincian Struk
                </p>
                <ul className="divide-y divide-[#E4E4E0] text-xs">
                  {confirmedOrder.items.map((entry) => (
                    <li
                      key={entry.key}
                      className="py-2.5 flex justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium text-[#141413]">
                          {entry.quantity}× {entry.menuItem.name}
                        </p>
                        <p className="text-[#5C5C57]">
                          {formatCustomizationSummary(
                            entry.menuItem,
                            entry.customization
                          )}
                        </p>
                      </div>
                      <span className="font-mono tabular-nums text-[#141413] shrink-0">
                        {formatIDR(entry.unitPrice * entry.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-[#E4E4E0] space-y-1 text-xs">
                  {confirmedOrder.summary.discount > 0 && (
                    <div className="flex justify-between text-[#1C3B2E]">
                      <span>Promo ({confirmedOrder.promoCode})</span>
                      <span className="font-mono tabular-nums">
                        {formatIDR(-confirmedOrder.summary.discount)}
                      </span>
                    </div>
                  )}
                  {confirmedOrder.summary.deliveryFee > 0 && (
                    <div className="flex justify-between text-[#5C5C57]">
                      <span>Ongkos Kirim</span>
                      <span className="font-mono tabular-nums">
                        {formatIDR(confirmedOrder.summary.deliveryFee)}
                      </span>
                    </div>
                  )}
                  <div className="pt-1 flex justify-between text-sm font-semibold text-[#141413]">
                    <span>Total</span>
                    <span className="font-mono tabular-nums">
                      {formatIDR(confirmedOrder.summary.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#E4E4E0] flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleDrawerClose();
                  onOpenOrderHistory();
                }}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors cursor-pointer min-h-[44px]"
              >
                Lihat Status Pesanan
              </button>
              <button
                type="button"
                onClick={handleDrawerClose}
                className="w-full py-2.5 px-4 text-sm font-medium text-[#141413] bg-[#F8F8F6] hover:bg-[#EFEFEB] border border-[#E4E4E0] rounded-md transition-colors cursor-pointer min-h-[42px]"
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
