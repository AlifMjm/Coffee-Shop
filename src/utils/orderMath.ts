import { PRICING_ADDONS } from '../data/menuData';
import type {
  CartItem,
  CheckoutFormInput,
  CheckoutValidationErrors,
  FulfillmentMethod,
  ItemCustomization,
  MenuCategory,
  MenuItem,
  OrderRecord,
  OrderStatus,
  OrderSummary,
  ServingTemp,
} from '../types/coffee';

export function formatIDR(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return rounded < 0 ? `-Rp${formatted}` : `Rp${formatted}`;
}

export function calculateItemUnitPrice(
  item: MenuItem,
  customization: ItemCustomization
): number {
  let price = item.basePrice;

  if (item.supportsSize && customization.size === 'Large') {
    price += PRICING_ADDONS.largeSize;
  }

  // Uji Matcha Oat already includes Oat Milk in its base price;
  // only charge plant-milk upgrade when switching from Fresh Milk default.
  const defaultMilk = item.defaultCustomization.milk;
  if (item.supportsMilk && customization.milk && customization.milk !== defaultMilk) {
    if (customization.milk === 'Oat Milk' && defaultMilk === 'Fresh Milk') {
      price += PRICING_ADDONS.oatMilk;
    } else if (customization.milk === 'Almond Milk') {
      price += defaultMilk === 'Oat Milk'
        ? PRICING_ADDONS.almondMilk - PRICING_ADDONS.oatMilk
        : PRICING_ADDONS.almondMilk;
    }
  }

  if (item.supportsExtraShot && customization.extraShot) {
    price += PRICING_ADDONS.extraShot;
  }

  return price;
}

export function buildCartItemKey(
  itemId: string,
  customization: ItemCustomization
): string {
  const normalizedNote = (customization.note ?? '').trim().toLowerCase();
  return [
    itemId,
    customization.temp ?? '',
    customization.size ?? '',
    customization.milk ?? '',
    customization.sugar ?? '',
    customization.extraShot ? 'shot' : '',
    customization.warmedUp ? 'warm' : '',
    normalizedNote,
  ].join('|');
}

export function formatCustomizationSummary(
  item: MenuItem,
  customization: ItemCustomization
): string {
  const parts: string[] = [];
  if (item.availableTemps.length > 0 && customization.temp) {
    parts.push(customization.temp);
  }
  if (item.supportsSize && customization.size) {
    parts.push(customization.size);
  }
  if (item.supportsMilk && customization.milk) {
    parts.push(customization.milk);
  }
  if (item.supportsSugar && customization.sugar) {
    parts.push(customization.sugar);
  }
  if (item.supportsExtraShot && customization.extraShot) {
    parts.push('Extra Shot');
  }
  if (item.supportsWarmUp) {
    parts.push(customization.warmedUp ? 'Dihangatkan' : 'Suhu Ruang');
  }
  return parts.join(' · ');
}

export function filterMenuItems(
  items: MenuItem[],
  category: MenuCategory | 'Semua',
  temp: 'Semua' | ServingTemp,
  query: string
): MenuItem[] {
  const trimmed = query.trim().toLowerCase();
  return items.filter((item) => {
    if (category !== 'Semua' && item.category !== category) {
      return false;
    }
    if (temp !== 'Semua' && !item.availableTemps.includes(temp)) {
      return false;
    }
    if (trimmed.length > 0) {
      const haystack = `${item.name} ${item.category} ${item.tastingNotes} ${item.description} ${item.origin ?? ''}`.toLowerCase();
      if (!haystack.includes(trimmed)) {
        return false;
      }
    }
    return true;
  });
}

export function evaluatePromoCode(
  rawCode: string,
  subtotal: number
): { valid: boolean; discount: number; label: string; error?: string } {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, discount: 0, label: '' };
  }

  if (code === 'KALA10') {
    const discount = Math.round(subtotal * 0.1);
    return {
      valid: true,
      discount,
      label: 'KALA10 (Diskon 10%)',
    };
  }

  if (code === 'SEDUHPAGI') {
    if (subtotal < 60000) {
      return {
        valid: false,
        discount: 0,
        label: '',
        error: 'Kode SEDUHPAGI berlaku untuk minimum pesanan Rp60.000.',
      };
    }
    return {
      valid: true,
      discount: 10000,
      label: 'SEDUHPAGI (Potongan Rp10.000)',
    };
  }

  return {
    valid: false,
    discount: 0,
    label: '',
    error: 'Kode promo tidak ditemukan. Coba KALA10 atau SEDUHPAGI.',
  };
}

export function calculateOrderSummary(
  items: CartItem[],
  fulfillment: FulfillmentMethod,
  promoCode: string
): OrderSummary {
  const itemCount = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = items.reduce(
    (sum, entry) => sum + entry.unitPrice * entry.quantity,
    0
  );

  const promoResult = evaluatePromoCode(promoCode, subtotal);
  const discount = promoResult.valid ? Math.min(promoResult.discount, subtotal) : 0;

  const isFreeDelivery = subtotal >= PRICING_ADDONS.freeDeliveryThreshold || subtotal === 0;
  const deliveryFee =
    fulfillment === 'delivery' && !isFreeDelivery ? PRICING_ADDONS.deliveryFee : 0;
  const freeDeliveryRemaining =
    fulfillment === 'delivery'
      ? Math.max(0, PRICING_ADDONS.freeDeliveryThreshold - subtotal)
      : 0;

  const total = Math.max(0, subtotal - discount + deliveryFee);

  return {
    itemCount,
    subtotal,
    discount,
    promoLabel: promoResult.valid ? promoResult.label : '',
    deliveryFee,
    freeDeliveryRemaining,
    total,
  };
}

export function validateCheckoutForm(
  input: CheckoutFormInput
): CheckoutValidationErrors {
  const errors: CheckoutValidationErrors = {};

  if (input.customerName.trim().length < 2) {
    errors.customerName = 'Masukkan nama pemesan minimal 2 karakter.';
  }

  const digitsOnly = input.phone.replace(/[^\d+]/g, '');
  const numericLength = digitsOnly.replace(/\D/g, '').length;
  if (numericLength < 9 || numericLength > 15) {
    errors.phone = 'Masukkan nomor WhatsApp/HP yang valid (9–15 digit).';
  }

  if (input.fulfillment === 'delivery' && input.address.trim().length < 10) {
    errors.address = 'Masukkan alamat pengantaran lengkap (minimal 10 karakter).';
  }

  if (input.fulfillment === 'pickup' && !input.pickupTime.trim()) {
    errors.pickupTime = 'Pilih perkiraan waktu pengambilan di kedai.';
  }

  return errors;
}

export function getNextOrderStatus(current: OrderStatus): OrderStatus {
  const sequence: OrderStatus[] = [
    'Diterima',
    'Sedang Diseduh',
    'Siap Diambil',
    'Selesai',
  ];
  const idx = sequence.indexOf(current);
  if (idx === -1 || idx === sequence.length - 1) {
    return 'Selesai';
  }
  return sequence[idx + 1];
}

export function createOrderRecord(
  items: CartItem[],
  summary: OrderSummary,
  customer: CheckoutFormInput,
  promoCode: string,
  existingCount: number
): OrderRecord {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const queueNum = String(existingCount + 12).padStart(2, '0');
  return {
    id: `KS-${randomSuffix}`,
    queueNumber: `A${queueNum}`,
    createdAt: new Date().toISOString(),
    status: 'Diterima',
    items: items.map((entry) => ({ ...entry })),
    summary: { ...summary },
    customer: { ...customer },
    promoCode: promoCode.trim().toUpperCase(),
  };
}
