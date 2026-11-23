export type MenuCategory = 'Espresso' | 'Manual Brew' | 'Non-Kopi' | 'Pastry';

export type ServingTemp = 'Panas' | 'Dingin';

export type DrinkSize = 'Regular' | 'Large';

export type MilkOption = 'Fresh Milk' | 'Oat Milk' | 'Almond Milk';

export type SugarLevel = 'Normal (100%)' | 'Sedikit (50%)' | 'Tanpa Gula (0%)';

export interface ItemCustomization {
  temp?: ServingTemp;
  size?: DrinkSize;
  milk?: MilkOption;
  sugar?: SugarLevel;
  extraShot?: boolean;
  warmedUp?: boolean;
  note?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  basePrice: number;
  image: string;
  imageAlt: string;
  tastingNotes: string;
  description: string;
  origin?: string;
  prepMinutes: number;
  availableTemps: ServingTemp[];
  supportsSize: boolean;
  supportsMilk: boolean;
  supportsSugar: boolean;
  supportsExtraShot: boolean;
  supportsWarmUp: boolean;
  featuredTag?: string;
  defaultCustomization: ItemCustomization;
}

export interface CartItem {
  key: string;
  menuItem: MenuItem;
  customization: ItemCustomization;
  unitPrice: number;
  quantity: number;
}

export type FulfillmentMethod = 'pickup' | 'delivery';

export type PaymentMethod = 'QRIS' | 'Transfer Bank' | 'Bayar di Kasir';

export interface CheckoutFormInput {
  customerName: string;
  phone: string;
  fulfillment: FulfillmentMethod;
  pickupTime: string;
  address: string;
  paymentMethod: PaymentMethod;
  baristaNote: string;
}

export interface CheckoutValidationErrors {
  customerName?: string;
  phone?: string;
  address?: string;
  pickupTime?: string;
}

export interface OrderSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  promoLabel: string;
  deliveryFee: number;
  freeDeliveryRemaining: number;
  total: number;
}

export type OrderStatus = 'Diterima' | 'Sedang Diseduh' | 'Siap Diambil' | 'Selesai';

export interface OrderRecord {
  id: string;
  queueNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  summary: OrderSummary;
  customer: CheckoutFormInput;
  promoCode: string;
}
