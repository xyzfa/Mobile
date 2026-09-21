// src/screens/CheckoutScreen.tsx
import { useState } from 'react';
import ScreenHeader from '../components/preloved/ScreenHeader';
import { products, formatRupiah, addOrder, chatThreads, ChatThread } from '../data/preloved';
import { addOrderNotification } from '../data/notifications';
import { getSavedProfile } from '../data/profile';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface CheckoutScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
  productId: number;
}

const paymentMethods = ['BCA', 'Mandiri', 'GoPay', 'Dana', 'OVO'];

export default function CheckoutScreen({ onNavigate, productId }: CheckoutScreenProps) {
  const product = products.find(p => p.id === productId) ?? products[0];
  const [qty, setQty] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const ongkir = 15000;
  const total = product.price * qty + ongkir;
  const profile = getSavedProfile();

  const handleBuatPesanan = () => {
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran terlebih dahulu');
      return;
    }

    setIsProcessing(true);

    // Cari atau buat chat dengan penjual
    let chatId = chatThreads.find(c => c.name === product.seller)?.id;
    if (!chatId) {
      const newId = chatThreads.length > 0 ? Math.max(...chatThreads.map(c => c.id)) + 1 : 1;
      const newThread: ChatThread = {
        id: newId,
        name: product.seller,
        product: product.name,
        lastMsg: 'Pesanan baru telah dibuat!',
        time: 'Sekarang',
        unread: 0,
        isMuted: false,
        isArchived: false,
        messages: [
          {
            from: 'system',
            text: `🛍️ Pesanan untuk "${product.name}" telah dibuat. Tunggu konfirmasi dari penjual.`,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          }
        ],
      };
      chatThreads.push(newThread);
      chatId = newId;
    }

    // Tambah pesanan
    const newOrder = addOrder(
      productId,
      qty,
      total,
      product.seller,
      profile.name,
      chatId
    );

    // Tambah notifikasi
    addOrderNotification(newOrder.id, product.name, chatId, productId);

    // Simulasi loading
    setTimeout(() => {
      setIsProcessing(false);
      // Tampilkan notifikasi sukses
      alert(`✅ Pesanan berhasil dibuat!\n\nProduk: ${product.name}\nJumlah: ${qty}\nTotal: ${formatRupiah(total)}\n\nCek status pesanan di "Pesanan Saya"`);
      onNavigate(10, { productId });
    }, 1000);
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC', position: 'relative' }}>
      <ScreenHeader title="Checkout" onBack={() => onNavigate(4, { productId })} />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {/* Cart item */}
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: '#2C4533', marginBottom: 10 }}>
          Barang yang dibeli
        </div>
        <div style={{ display: 'flex', gap: 12, background: '#fff', border: '1px solid #DED5C3', borderRadius: 14, padding: 12, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 10, flexShrink: 0, background: product.bg, color: product.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '48%' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5l3-2 3 2"/><path d="M5 9l4-4 3 3 3-3 4 4-3 3v9H8v-9z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#232A22' }}>{product.name}</div>
            <div style={{ fontWeight: 700, color: '#C1543C', fontSize: 14, marginBottom: 3, fontFamily: "'Fraunces', serif" }}>{formatRupiah(product.price)}</div>
            <div style={{ fontSize: 11.5, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Penjual: {product.seller}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #DED5C3', background: '#fff', fontSize: 14, color: '#2C4533', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >−</button>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, minWidth: 12, textAlign: 'center' }}>{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #DED5C3', background: '#fff', fontSize: 14, color: '#2C4533', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >+</button>
          </div>
        </div>

        {/* Alamat pengiriman */}
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: '#2C4533', marginBottom: 10 }}>
          Alamat Pengiriman
        </div>
        <div style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 14, padding: '12px 14px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>Rumah Utama</div>
          <div style={{ fontSize: 12.5, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.5 }}>
            Jl. Sudirman No. 45, Jakarta Selatan, DKI Jakarta 12190
          </div>
        </div>

        {/* Ringkasan */}
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: '#2C4533', marginBottom: 10 }}>
          Ringkasan Pembayaran
        </div>
        <div style={{ background: '#fff', border: '1px solid #DED5C3', borderRadius: 14, padding: 14, marginBottom: 18 }}>
          {[
            ['Subtotal', formatRupiah(product.price * qty)],
            ['Ongkos Kirim (JNE REG)', formatRupiah(ongkir)],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#232A22', marginBottom: 9, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span>{label}</span><span>{val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, color: '#2C4533', borderTop: '1px solid #DED5C3', paddingTop: 10, marginTop: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span>Total</span><span style={{ color: '#C1543C', fontFamily: "'Fraunces', serif" }}>{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: '#2C4533', marginBottom: 10 }}>
          Metode Pembayaran
        </div>
        <div
          onClick={() => setShowPaymentSheet(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #DED5C3', borderRadius: 12, padding: '13px 14px', marginBottom: 20, cursor: 'pointer' }}
        >
          <span style={{ fontSize: 13.5, color: selectedPayment ? '#232A22' : '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: selectedPayment ? 600 : 400 }}>
            {selectedPayment || 'Pilih metode pembayaran'}
          </span>
          <span style={{ color: '#8A8475', fontSize: 18 }}>›</span>
        </div>
      </div>

      {/* Bottom action */}
      <div style={{ padding: '12px 18px 20px', flexShrink: 0, borderTop: '1px solid #DED5C3', background: '#F7F3EC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total pembayaran</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#C1543C', fontFamily: "'Fraunces', serif" }}>{formatRupiah(total)}</span>
        </div>
        <button
          onClick={handleBuatPesanan}
          disabled={isProcessing}
          style={{
            width: '100%',
            background: isProcessing ? '#8A8475' : '#2C4533',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            padding: 15,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 14.5,
            cursor: isProcessing ? 'default' : 'pointer',
            opacity: isProcessing ? 0.7 : 1,
          }}
        >
          {isProcessing ? 'Memproses...' : 'Buat Pesanan'}
        </button>
      </div>

      {/* Payment bottom sheet */}
      {showPaymentSheet && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowPaymentSheet(false)}>
          <div style={{ width: '100%', background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 18px 30px' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#DED5C3', margin: '0 auto 18px' }} />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: '#2C4533', marginBottom: 14 }}>Pilih Pembayaran</div>
            {paymentMethods.map(method => (
              <div
                key={method}
                onClick={() => { setSelectedPayment(method); setShowPaymentSheet(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid #DED5C3', cursor: 'pointer' }}
              >
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedPayment === method ? '#2C4533' : '#DED5C3'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedPayment === method && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2C4533' }} />}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#232A22' }}>{method}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}