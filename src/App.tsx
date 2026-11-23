import { useEffect, useState } from 'react';
import { MENU_ITEMS } from './data/menuData';
import type {
  CartItem,
  CheckoutFormInput,
  ItemCustomization,
  MenuCategory,
  MenuItem,
  OrderRecord,
  ServingTemp,
} from './types/coffee';
import {
  buildCartItemKey,
  calculateItemUnitPrice,
  calculateOrderSummary,
  createOrderRecord,
  getNextOrderStatus,
} from './utils/orderMath';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { StoryAndLocation } from './components/StoryAndLocation';
import { CustomizeModal } from './components/CustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderHistoryDrawer } from './components/OrderHistoryDrawer';

const CART_STORAGE_KEY = 'kalaseduh_cart_v1';
const ORDERS_STORAGE_KEY = 'kalaseduh_orders_v1';

function loadStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadStoredJson<CartItem[]>(CART_STORAGE_KEY, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    loadStoredJson<OrderRecord[]>(ORDERS_STORAGE_KEY, [])
  );

  // Menu filter state
  const [selectedCategory, setSelectedCategory] = useState<
    MenuCategory | 'Semua'
  >('Semua');
  const [selectedTemp, setSelectedTemp] = useState<'Semua' | ServingTemp>(
    'Semua'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & drawer state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  // Brief non-intrusive feedback message
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota issues
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota issues
    }
  }, [orders]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const totalCartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  const handleAddToCart = (
    item: MenuItem,
    customization: ItemCustomization,
    quantity: number
  ) => {
    const key = buildCartItemKey(item.id, customization);
    const unitPrice = calculateItemUnitPrice(item, customization);

    setCart((prev) => {
      const existing = prev.find((entry) => entry.key === key);
      if (existing) {
        return prev.map((entry) =>
          entry.key === key
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [
        ...prev,
        {
          key,
          menuItem: item,
          customization,
          unitPrice,
          quantity,
        },
      ];
    });

    setToastMessage(`${quantity}× ${item.name} ditambahkan ke keranjang`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart(item, { ...item.defaultCustomization }, 1);
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.key === key
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCart((prev) => prev.filter((entry) => entry.key !== key));
  };

  const handleCompleteOrder = (
    customer: CheckoutFormInput,
    promoCode: string
  ): OrderRecord => {
    const summary = calculateOrderSummary(cart, customer.fulfillment, promoCode);
    const newOrder = createOrderRecord(
      cart,
      summary,
      customer,
      promoCode,
      orders.length
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: getNextOrderStatus(order.status) }
          : order
      )
    );
  };

  const handleReorder = (order: OrderRecord) => {
    setCart((prev) => {
      const updated = [...prev];
      for (const orderItem of order.items) {
        const existingIdx = updated.findIndex(
          (entry) => entry.key === orderItem.key
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + orderItem.quantity,
          };
        } else {
          updated.push({ ...orderItem });
        }
      }
      return updated;
    });
    setCartOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory('Semua');
    setSelectedTemp('Semua');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6] text-[#141413]">
      <Header
        cartCount={totalCartCount}
        orderCount={orders.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          onOpenOrders={() => setOrdersOpen(true)}
          hasOrders={orders.length > 0}
        />

        <MenuSection
          items={MENU_ITEMS}
          cart={cart}
          selectedCategory={selectedCategory}
          selectedTemp={selectedTemp}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onTempChange={setSelectedTemp}
          onSearchChange={setSearchQuery}
          onResetFilters={handleResetFilters}
          onQuickAdd={handleQuickAdd}
          onUpdateDefaultQty={handleUpdateQty}
          onCustomize={(item) => setCustomizingItem(item)}
        />

        <StoryAndLocation
          onOpenCart={() => setCartOpen(true)}
          onOpenOrders={() => setOrdersOpen(true)}
        />
      </main>

      {/* Drink / Pastry Customizer Modal */}
      <CustomizeModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Cart & Checkout Drawer */}
      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCompleteOrder={handleCompleteOrder}
        onOpenOrderHistory={() => setOrdersOpen(true)}
      />

      {/* Persisted Order History & Live Status Tracker */}
      <OrderHistoryDrawer
        open={ordersOpen}
        orders={orders}
        onClose={() => setOrdersOpen(false)}
        onAdvanceStatus={handleAdvanceOrderStatus}
        onReorder={handleReorder}
      />

      {/* Ephemeral Accessible Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-sm bg-[#141413] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 text-xs sm:text-sm"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage('');
              setCartOpen(true);
            }}
            className="font-semibold underline underline-offset-4 text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Lihat Keranjang
          </button>
        </div>
      )}
    </div>
  );
}
