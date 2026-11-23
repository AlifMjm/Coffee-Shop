import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_ITEMS } from '../data/menuData';
import {
  buildCartItemKey,
  calculateItemUnitPrice,
  calculateOrderSummary,
  evaluatePromoCode,
  filterMenuItems,
  formatIDR,
  getNextOrderStatus,
  validateCheckoutForm,
} from './orderMath';
import type { CartItem } from '../types/coffee';

test('formatIDR formats positive and negative rupiah cleanly', () => {
  assert.equal(formatIDR(32000), 'Rp32.000');
  assert.equal(formatIDR(125500), 'Rp125.500');
  assert.equal(formatIDR(-4600), '-Rp4.600');
});

test('calculateItemUnitPrice adds Large, Oat Milk, and Extra Shot surcharges accurately', () => {
  const kopiSusu = MENU_ITEMS.find((m) => m.id === 'kopi-susu-kala')!;
  // Base 32.000 + Large 6.000 + Oat Milk 8.000 + Extra Shot 7.000 = 53.000
  const customizedPrice = calculateItemUnitPrice(kopiSusu, {
    temp: 'Dingin',
    size: 'Large',
    milk: 'Oat Milk',
    sugar: 'Sedikit (50%)',
    extraShot: true,
  });
  assert.equal(customizedPrice, 53000);

  // Uji Matcha Oat already includes Oat Milk in basePrice (40.000)
  const matcha = MENU_ITEMS.find((m) => m.id === 'uji-matcha-oat')!;
  assert.equal(
    calculateItemUnitPrice(matcha, {
      temp: 'Dingin',
      size: 'Regular',
      milk: 'Oat Milk',
      sugar: 'Sedikit (50%)',
    }),
    40000
  );
  // Switching Uji Matcha Oat to Almond Milk adds only the delta (1.000)
  assert.equal(
    calculateItemUnitPrice(matcha, {
      temp: 'Dingin',
      size: 'Regular',
      milk: 'Almond Milk',
      sugar: 'Sedikit (50%)',
    }),
    41000
  );
});

test('buildCartItemKey distinguishes different customizations and trims notes', () => {
  const keyA = buildCartItemKey('kopi-susu-kala', {
    temp: 'Dingin',
    size: 'Regular',
    note: ' Es sedikit ',
  });
  const keyB = buildCartItemKey('kopi-susu-kala', {
    temp: 'Dingin',
    size: 'Regular',
    note: 'es sedikit',
  });
  const keyC = buildCartItemKey('kopi-susu-kala', {
    temp: 'Panas',
    size: 'Regular',
    note: 'es sedikit',
  });
  assert.equal(keyA, keyB);
  assert.notEqual(keyA, keyC);
});

test('filterMenuItems filters by category, temperature, and search query', () => {
  const manualBrews = filterMenuItems(MENU_ITEMS, 'Manual Brew', 'Semua', '');
  assert.equal(manualBrews.length, 2);

  const hotManualBrews = filterMenuItems(MENU_ITEMS, 'Manual Brew', 'Panas', '');
  assert.equal(hotManualBrews.length, 1);
  assert.equal(hotManualBrews[0].id, 'v60-gayo-natural');

  const queryMatch = filterMenuItems(MENU_ITEMS, 'Semua', 'Semua', 'kyoto');
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].id, 'uji-matcha-oat');
});

test('evaluatePromoCode and calculateOrderSummary handle KALA10, SEDUHPAGI, and free delivery threshold', () => {
  const kopiSusu = MENU_ITEMS.find((m) => m.id === 'kopi-susu-kala')!;
  const cart: CartItem[] = [
    {
      key: 'k1',
      menuItem: kopiSusu,
      customization: kopiSusu.defaultCustomization,
      unitPrice: 46000,
      quantity: 1,
    },
  ];

  // Below 100.000 with delivery -> 12.000 fee + KALA10 10% off 46.000 = 4.600
  const summaryDelivery = calculateOrderSummary(cart, 'delivery', 'kala10');
  assert.equal(summaryDelivery.subtotal, 46000);
  assert.equal(summaryDelivery.discount, 4600);
  assert.equal(summaryDelivery.deliveryFee, 12000);
  assert.equal(summaryDelivery.freeDeliveryRemaining, 54000);
  assert.equal(summaryDelivery.total, 53400);

  // SEDUHPAGI fails below 60.000
  const seduhLow = evaluatePromoCode('SEDUHPAGI', 46000);
  assert.equal(seduhLow.valid, false);
  assert.ok(seduhLow.error);

  // Above 100.000 qualifies for free delivery
  const largeCart: CartItem[] = [{ ...cart[0], quantity: 3 }];
  const summaryFree = calculateOrderSummary(largeCart, 'delivery', 'SEDUHPAGI');
  assert.equal(summaryFree.subtotal, 138000);
  assert.equal(summaryFree.discount, 10000);
  assert.equal(summaryFree.deliveryFee, 0);
  assert.equal(summaryFree.freeDeliveryRemaining, 0);
  assert.equal(summaryFree.total, 128000);
});

test('validateCheckoutForm enforces required customer fields for pickup and delivery', () => {
  const emptyPickupErrors = validateCheckoutForm({
    customerName: '',
    phone: '123',
    fulfillment: 'pickup',
    pickupTime: '',
    address: '',
    paymentMethod: 'QRIS',
    baristaNote: '',
  });
  assert.ok(emptyPickupErrors.customerName);
  assert.ok(emptyPickupErrors.phone);
  assert.ok(emptyPickupErrors.pickupTime);
  assert.equal(emptyPickupErrors.address, undefined);

  const deliveryMissingAddr = validateCheckoutForm({
    customerName: 'Raka Putra',
    phone: '081234567890',
    fulfillment: 'delivery',
    pickupTime: '',
    address: 'Kemang',
    paymentMethod: 'QRIS',
    baristaNote: '',
  });
  assert.equal(deliveryMissingAddr.customerName, undefined);
  assert.equal(deliveryMissingAddr.phone, undefined);
  assert.ok(deliveryMissingAddr.address);

  const validDelivery = validateCheckoutForm({
    customerName: 'Raka Putra',
    phone: '081234567890',
    fulfillment: 'delivery',
    pickupTime: '',
    address: 'Jl. Kemang Raya No. 18, Jakarta Selatan',
    paymentMethod: 'QRIS',
    baristaNote: 'Titip di resepsionis',
  });
  assert.deepEqual(validDelivery, {});
});

test('getNextOrderStatus advances through order lifecycle and stops at Selesai', () => {
  assert.equal(getNextOrderStatus('Diterima'), 'Sedang Diseduh');
  assert.equal(getNextOrderStatus('Sedang Diseduh'), 'Siap Diambil');
  assert.equal(getNextOrderStatus('Siap Diambil'), 'Selesai');
  assert.equal(getNextOrderStatus('Selesai'), 'Selesai');
});
