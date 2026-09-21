import ScreenHeader from '../components/preloved/ScreenHeader';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface JualBarangScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#2C4533', marginBottom: 7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #DED5C3', background: '#fff', borderRadius: 12,
  padding: '12px 14px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5,
  color: '#232A22', appearance: 'none' as const, boxSizing: 'border-box' as const, outline: 'none'
};

export default function JualBarangScreen({ onNavigate }: JualBarangScreenProps) {
  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Jual Barang" onBack={() => onNavigate(2)} />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        {/* Upload box */}
        <div style={{ border: '1.5px dashed #C68B59', borderRadius: 16, background: '#F1E2CC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '30px 10px', marginBottom: 20, color: '#C68B59', textAlign: 'center', cursor: 'pointer' }}>
          <svg width="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2z"/>
            <circle cx="12" cy="13" r="3.5"/>
          </svg>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: '#2C4533', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tambah Foto</div>
          <div style={{ fontSize: 11.5, color: '#8A8475', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>(maks. 5 foto)</div>
        </div>

        <Field label="Nama Barang">
          <input type="text" placeholder="—" style={inputStyle} />
        </Field>
        <Field label="Kategori">
          <select style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%238A8475' stroke-width='2'><path d='M3 5l4 4 4-4'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
            <option>Pilih kategori</option>
            <option>Pakaian</option>
            <option>Tas</option>
            <option>Sepatu</option>
            <option>Aksesoris</option>
            <option>Elektronik</option>
            <option>Lainnya</option>
          </select>
        </Field>
        <Field label="Kondisi">
          <select style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%238A8475' stroke-width='2'><path d='M3 5l4 4 4-4'/></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
            <option>Pilih kondisi</option>
            <option>Seperti baru</option>
            <option>Sangat baik</option>
            <option>Baik</option>
            <option>Cukup baik</option>
          </select>
        </Field>
        <Field label="Harga">
          <input type="text" placeholder="Rp" style={inputStyle} />
        </Field>
        <Field label="Deskripsi">
          <textarea style={{ ...inputStyle, resize: 'none', height: 80 }} />
        </Field>
      </div>
      <div style={{ padding: '6px 18px 20px', flexShrink: 0 }}>
        <button
          onClick={() => onNavigate(2)}
          style={{ width: '100%', background: '#2C4533', color: '#fff', border: 'none', borderRadius: 999, padding: 15, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}
        >
          Posting
        </button>
      </div>
    </div>
  );
}
