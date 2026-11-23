import { useEffect, useState } from 'react';
import { Clock, RotateCcw, Search, X } from 'lucide-react';
import type { OrderRecord, OrderStatus } from '../types/coffee';
import { formatCustomizationSummary, formatIDR } from '../utils/orderMath';

interface OrderHistoryDrawerProps {
  open: boolean;
  orders: OrderRecord[];
  onClose: () => void;
  onAdvanceStatus: (orderId: string) => void;
  onReorder: (order: OrderRecord) => void;
}

const ORDER_STEPS: OrderStatus[] = [
  'Diterima',
  'Sedang Diseduh',
  'Siap Diambil',
  'Selesai',
];

export function OrderHistoryDrawer({
  open,
  orders,
  onClose,
  onAdvanceStatus,
  onReorder,
}: OrderHistoryDrawerProps) {
  const [searchCode, setSearchCode] = useState('');

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

  if (!open) return null;

  const trimmed = searchCode.trim().toLowerCase();
  const visibleOrders = trimmed
    ? orders.filter(
        (order) =>
          order.id.toLowerCase().includes(trimmed) ||
          order.customer.customerName.toLowerCase().includes(trimmed) ||
          order.queueNumber.toLowerCase().includes(trimmed)
      )
    : orders;

  const formatTimestamp = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#141413]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="orders-drawer-title"
    >
      <button
        type="button"
        aria-label="Tutup riwayat pesanan"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-md bg-[#F8F8F6] h-full flex flex-col border-l border-[#E4E4E0] shadow-2xl">
        <div className="px-6 py-4 bg-white border-b border-[#E4E4E0] flex items-center justify-between gap-4">
          <div>
            <h2
              id="orders-drawer-title"
              className="font-display text-xl font-medium text-[#141413]"
            >
              Status &amp; Riwayat Pesanan
            </h2>
            <p className="text-xs text-[#5C5C57] tabular-nums">
              {orders.length} pesanan tersimpan di perangkat ini
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel pesanan"
            className="w-10 h-10 inline-flex items-center justify-center rounded-md text-[#5C5C57] hover:text-[#141413] hover:bg-[#F1F1EE] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {orders.length > 0 && (
          <div className="px-6 py-3 bg-white border-b border-[#E4E4E0]">
            <label htmlFor="order-lookup-input" className="sr-only">
              Cari kode pesanan atau nama pemesan
            </label>
            <div className="relative">
              <Search
                className="h-4 w-4 text-[#5C5C57] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="order-lookup-input"
                type="search"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Cari kode pesanan (KS-...) atau nama..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F8F6] border border-[#E4E4E0] rounded-md text-[#141413] placeholder:text-[#5C5C57]/70 min-h-[38px]"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <Clock className="h-7 w-7 text-[#5C5C57] stroke-[1.5]" aria-hidden="true" />
              <p className="font-display text-lg text-[#141413]">
                Belum ada pesanan
              </p>
              <p className="text-sm text-[#5C5C57] max-w-xs">
                Pesanan yang Anda konfirmasi akan tampil di sini lengkap dengan nomor antrean dan progres penyeduhan.
              </p>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-medium text-[#141413]">
                Kode pesanan tidak ditemukan
              </p>
              <button
                type="button"
                onClick={() => setSearchCode('')}
                className="text-xs font-medium text-[#1C3B2E] underline cursor-pointer"
              >
                Tampilkan semua pesanan
              </button>
            </div>
          ) : (
            visibleOrders.map((order) => {
              const currentStepIndex = ORDER_STEPS.indexOf(order.status);
              return (
                <article
                  key={order.id}
                  data-testid={`order-history-card-${order.id}`}
                  className="bg-white border border-[#E4E4E0] rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-[#141413] tabular-nums">
                        {order.id} · #{order.queueNumber}
                      </p>
                      <p className="text-xs text-[#5C5C57]">
                        {order.customer.customerName} · {formatTimestamp(order.createdAt)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#1C3B2E] shrink-0">
                      {order.status}
                    </span>
                  </div>

                  {/* Clean Horizontal Progress Indicator */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-4 gap-1.5">
                      {ORDER_STEPS.map((label, idx) => (
                        <div
                          key={label}
                          className={`h-1.5 rounded-full transition-colors ${
                            idx <= currentStepIndex
                              ? 'bg-[#1C3B2E]'
                              : 'bg-[#E4E4E0]'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[11px] text-[#5C5C57]">
                      <span>Diterima</span>
                      <span>Diseduh</span>
                      <span>
                        {order.customer.fulfillment === 'pickup'
                          ? 'Siap Ambil'
                          : 'Diantar'}
                      </span>
                      <span>Selesai</span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <ul className="pt-2 border-t border-[#E4E4E0] space-y-1.5 text-xs">
                    {order.items.map((entry) => (
                      <li key={entry.key} className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-medium text-[#141413]">
                            {entry.quantity}× {entry.menuItem.name}
                          </span>
                          <p className="text-[#5C5C57] truncate">
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

                  <div className="pt-3 border-t border-[#E4E4E0] flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-semibold tabular-nums text-[#141413]">
                      {formatIDR(order.summary.total)}
                    </span>

                    <div className="flex items-center gap-2">
                      {order.status !== 'Selesai' && (
                        <button
                          type="button"
                          onClick={() => onAdvanceStatus(order.id)}
                          className="px-3 py-1.5 text-xs font-medium text-[#141413] bg-[#F8F8F6] hover:bg-[#EFEFEB] border border-[#E4E4E0] rounded-md transition-colors cursor-pointer min-h-[34px]"
                        >
                          Perbarui Status
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onReorder(order);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1C3B2E] hover:bg-[#142B21] rounded-md transition-colors cursor-pointer min-h-[34px]"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        <span>Pesan Lagi</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
