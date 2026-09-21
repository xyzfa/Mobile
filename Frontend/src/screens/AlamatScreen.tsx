import { useState, useRef, useEffect } from 'react';
import BottomNav from '../components/preloved/BottomNav';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix untuk icon marker Leaflet di React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface AlamatScreenProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  lat: number;
  lng: number;
  isPrimary: boolean;
}

const defaultCenter: [number, number] = [-6.2088, 106.8456];

// Daftar Provinsi di Indonesia
const provinces = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau',
  'Jambi', 'Bengkulu', 'Sumatera Selatan', 'Kepulauan Bangka Belitung',
  'Lampung', 'Banten', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah',
  'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat',
  'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah',
  'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan',
  'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat', 'Maluku',
  'Maluku Utara', 'Papua Barat', 'Papua', 'Papua Tengah', 'Papua Pegunungan',
  'Papua Selatan', 'Papua Barat Daya'
];

// Daftar Kota/Kabupaten di Indonesia
const citiesByProvince: { [key: string]: string[] } = {
  'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'],
  'Jawa Barat': ['Bandung', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon', 'Depok', 'Sukabumi', 'Tasikmalaya', 'Banjar'],
  'Jawa Tengah': ['Semarang', 'Surakarta', 'Pekalongan', 'Tegal', 'Magelang', 'Salatiga', 'Kudus', 'Purwokerto'],
  'Jawa Timur': ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Kediri', 'Blitar', 'Madiun'],
  'DI Yogyakarta': ['Yogyakarta', 'Sleman', 'Bantul', 'Gunungkidul', 'Kulon Progo'],
  'Banten': ['Serang', 'Tangerang', 'Cilegon', 'Tangerang Selatan', 'Lebak', 'Pandeglang'],
  'Sumatera Utara': ['Medan', 'Binjai', 'Pematangsiantar', 'Tebing Tinggi', 'Tanjungbalai', 'Sibolga'],
  'Sumatera Barat': ['Padang', 'Bukittinggi', 'Payakumbuh', 'Solok', 'Pariaman'],
  'Riau': ['Pekanbaru', 'Dumai', 'Siak', 'Rengat', 'Tembilahan'],
  'Kepulauan Riau': ['Tanjung Pinang', 'Batam', 'Karimun', 'Natuna'],
  'Jambi': ['Jambi', 'Sungai Penuh', 'Muara Bungo', 'Bangko'],
  'Bengkulu': ['Bengkulu', 'Manna', 'Arga Makmur'],
  'Sumatera Selatan': ['Palembang', 'Prabumulih', 'Lubuklinggau', 'Pagar Alam'],
  'Kepulauan Bangka Belitung': ['Pangkal Pinang', 'Mentok', 'Tanjung Pandan'],
  'Lampung': ['Bandar Lampung', 'Metro', 'Kotabumi', 'Pringsewu'],
  'Bali': ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Klungkung', 'Karangasem'],
  'Nusa Tenggara Barat': ['Mataram', 'Bima', 'Sumbawa', 'Dompu'],
  'Nusa Tenggara Timur': ['Kupang', 'Ende', 'Maumere', 'Rote', 'Atambua'],
  'Kalimantan Barat': ['Pontianak', 'Singkawang', 'Sintang', 'Ketapang'],
  'Kalimantan Tengah': ['Palangka Raya', 'Sampit', 'Pangkalan Bun', 'Kuala Kapuas'],
  'Kalimantan Selatan': ['Banjarmasin', 'Banjarbaru', 'Martapura', 'Barabai'],
  'Kalimantan Timur': ['Samarinda', 'Balikpapan', 'Bontang', 'Tenggarong'],
  'Kalimantan Utara': ['Tarakan', 'Bulungan', 'Malinau', 'Nunukan'],
  'Sulawesi Utara': ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu'],
  'Sulawesi Tengah': ['Palu', 'Poso', 'Luwuk', 'Tolitoli'],
  'Sulawesi Selatan': ['Makassar', 'Parepare', 'Palopo', 'Bone', 'Bulukumba'],
  'Sulawesi Tenggara': ['Kendari', 'Baubau', 'Kolaka', 'Raha'],
  'Gorontalo': ['Gorontalo', 'Limboto', 'Marisa'],
  'Sulawesi Barat': ['Mamuju', 'Polewali', 'Majene'],
  'Maluku': ['Ambon', 'Tual', 'Masohi', 'Saumlaki'],
  'Maluku Utara': ['Ternate', 'Tidore', 'Sofifi', 'Labuha'],
  'Papua': ['Jayapura', 'Merauke', 'Timika', 'Nabire'],
  'Papua Barat': ['Manokwari', 'Sorong', 'Fakfak', 'Bintuni'],
  'Papua Tengah': ['Nabire', 'Enarotali', 'Wamena'],
  'Papua Pegunungan': ['Wamena', 'Oksibil', 'Kenyam'],
  'Papua Selatan': ['Merauke', 'Ewer', 'Tanah Miring'],
  'Papua Barat Daya': ['Sorong', 'Raja Ampat', 'Maybrat'],
  'Aceh': ['Banda Aceh', 'Sabang', 'Lhokseumawe', 'Langsa', 'Meulaboh', 'Takengon']
};

// Fungsi untuk reverse geocoding menggunakan Nominatim (OpenStreetMap)
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      let street = '';
      let city = '';
      let province = '';
      let postalCode = '';
      
      if (address.road) street = address.road;
      if (address.house_number) street = `${address.house_number} ${street}`;
      if (address.city) city = address.city;
      else if (address.town) city = address.town;
      else if (address.village) city = address.village;
      if (address.state) province = address.state;
      if (address.postcode) postalCode = address.postcode;
      
      return {
        address: street || data.display_name || '',
        city: city || '',
        province: province || '',
        postalCode: postalCode || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

// Komponen untuk menangani klik pada peta
function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Komponen untuk marker yang bisa digeser
function DraggableMarker({ 
  position, 
  onDragEnd 
}: { 
  position: [number, number], 
  onDragEnd: (lat: number, lng: number) => void 
}) {
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const pos = marker.getLatLng();
        onDragEnd(pos.lat, pos.lng);
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

export default function AlamatScreen({ onNavigate }: AlamatScreenProps) {
  // State untuk menyimpan daftar alamat (akan tetap tersimpan)
  const [addresses, setAddresses] = useState<Address[]>(() => {
    // Load dari localStorage jika ada
    const saved = localStorage.getItem('addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [tempAddress, setTempAddress] = useState(''); // Temporary address from map
  
  // Form state - dipisahkan dari lokasi
  const [formData, setFormData] = useState({
    label: 'Rumah',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });

  // State untuk filter dropdown
  const [provinceSearch, setProvinceSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Ref untuk dropdown
  const provinceRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Simpan ke localStorage setiap kali addresses berubah
  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Filter provinces berdasarkan search
  const filteredProvinces = provinces.filter(p => 
    p.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  // Filter cities berdasarkan search dan province yang dipilih
  const filteredCities = formData.province 
    ? (citiesByProvince[formData.province] || []).filter(c => 
        c.toLowerCase().includes(citySearch.toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provinceRef.current && !provinceRef.current.contains(event.target as Node)) {
        setShowProvinceDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSetPrimary = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isPrimary: addr.id === id
    })));
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleAddAddress = () => {
    if (!selectedLocation) {
      alert('Silakan pilih lokasi di peta terlebih dahulu');
      return;
    }

    if (!formData.address || !formData.city || !formData.province || !formData.postalCode) {
      alert('Silakan isi semua field alamat');
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      isPrimary: addresses.length === 0,
    };

    setAddresses([...addresses, newAddress]);
    setShowAddForm(false);
    setSelectedLocation(null);
    setFormData({
      label: 'Rumah',
      address: '',
      city: '',
      province: '',
      postalCode: '',
    });
    setProvinceSearch('');
    setCitySearch('');
    setTempAddress('');
  };

  const handleSelectLocation = () => {
    setShowMap(true);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setMapCenter([lat, lng]);
    setIsLoadingLocation(true);
    
    // Reverse geocoding hanya untuk mendapatkan alamat sebagai referensi
    const addressData = await reverseGeocode(lat, lng);
    setIsLoadingLocation(false);
    
    if (addressData) {
      setTempAddress(addressData.address || '');
    }
    
    // Auto close map after selecting location
    setTimeout(() => {
      setShowMap(false);
    }, 300);
  };

  const handleMarkerDragEnd = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setMapCenter([lat, lng]);
    setIsLoadingLocation(true);
    
    const addressData = await reverseGeocode(lat, lng);
    setIsLoadingLocation(false);
    
    if (addressData) {
      setTempAddress(addressData.address || '');
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSelectedLocation({ lat, lng });
          setMapCenter([lat, lng]);
          
          const addressData = await reverseGeocode(lat, lng);
          setIsLoadingLocation(false);
          
          if (addressData) {
            setTempAddress(addressData.address || '');
          }
          
          // Auto close map after selecting location
          setTimeout(() => {
            setShowMap(false);
          }, 300);
        },
        () => {
          setIsLoadingLocation(false);
          alert('Gagal mendapatkan lokasi. Silakan pilih lokasi di peta.');
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolokasi. Silakan pilih lokasi di peta.');
    }
  };

  const handleProvinceSelect = (province: string) => {
    setFormData(prev => ({ ...prev, province, city: '' }));
    setProvinceSearch(province);
    setShowProvinceDropdown(false);
    setCitySearch('');
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  const toggleProvinceDropdown = () => {
    setShowProvinceDropdown(!showProvinceDropdown);
    if (!showProvinceDropdown) {
      setProvinceSearch('');
    }
  };

  const toggleCityDropdown = () => {
    if (formData.province) {
      setShowCityDropdown(!showCityDropdown);
      if (!showCityDropdown) {
        setCitySearch('');
      }
    } else {
      alert('Silakan pilih provinsi terlebih dahulu');
    }
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '14px 18px 12px', 
        background: '#fff', 
        borderBottom: '1px solid #DED5C3', 
        flexShrink: 0 
      }}>
        <button
          onClick={() => onNavigate(8)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            cursor: 'pointer',
            color: '#2C4533',
            padding: '0 8px',
          }}
        >
          ‹
        </button>
        <h2 style={{ 
          fontFamily: "'Fraunces', serif", 
          fontSize: 17, 
          fontWeight: 600, 
          margin: 0, 
          color: '#2C4533', 
          flex: 1, 
          textAlign: 'center' 
        }}>
          Alamat Saya
        </h2>
        <div style={{ width: 32, flexShrink: 0 }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '18px' }}>
        {/* Add Address Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            width: '100%',
            padding: '14px',
            background: '#2C4533',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: 18,
            transition: 'all 0.2s',
          }}
        >
          + Tambah Alamat Baru
        </button>

        {/* Add Address Form */}
        {showAddForm && (
          <div style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: 18,
          }}>
            <h3 style={{ 
              fontFamily: "'Plus Jakarta Sans', sans-serif", 
              fontSize: 16, 
              fontWeight: 700, 
              margin: '0 0 16px 0',
              color: '#2C4533'
            }}>
              Tambah Alamat Baru
            </h3>

            {/* Label */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#2C4533',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'block',
                marginBottom: 4
              }}>
                Label Alamat
              </label>
              <select
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #DED5C3',
                  fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: '#fff',
                }}
              >
                <option value="Rumah">Rumah</option>
                <option value="Kantor">Kantor</option>
                <option value="Apartemen">Apartemen</option>
                <option value="Sekolah">Sekolah</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Alamat */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#2C4533',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'block',
                marginBottom: 4
              }}>
                Alamat Lengkap
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Masukkan alamat lengkap"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #DED5C3',
                  fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
              {tempAddress && (
                <div style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: '#8A8475',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontStyle: 'italic',
                }}>
                  {/* 📍 Referensi lokasi: {tempAddress} */}
                </div>
              )}
            </div>

            {/* Provinsi - Dropdown with Search */}
            <div style={{ marginBottom: 14, position: 'relative' }} ref={provinceRef}>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#2C4533',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'block',
                marginBottom: 4
              }}>
                Provinsi
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={provinceSearch}
                  onChange={(e) => {
                    setProvinceSearch(e.target.value);
                    setShowProvinceDropdown(true);
                    if (e.target.value === '') {
                      setFormData(prev => ({ ...prev, province: '' }));
                    }
                  }}
                  onFocus={() => setShowProvinceDropdown(true)}
                  placeholder="Pilih provinsi"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '40px',
                    borderRadius: '8px',
                    border: '1px solid #DED5C3',
                    fontSize: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
                <button
                  onClick={toggleProvinceDropdown}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: 18,
                    cursor: 'pointer',
                    color: '#8A8475',
                    padding: '0 4px',
                  }}
                >
                  ▼
                </button>
              </div>
              {showProvinceDropdown && filteredProvinces.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 200,
                  overflowY: 'auto',
                  background: '#fff',
                  border: '1px solid #DED5C3',
                  borderRadius: '8px',
                  marginTop: 4,
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  {filteredProvinces.map((province) => (
                    <div
                      key={province}
                      onClick={() => handleProvinceSelect(province)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        borderBottom: '1px solid #F0EDE8',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E7EEE3'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {province}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kota - Dropdown with Search */}
            <div style={{ marginBottom: 14, position: 'relative' }} ref={cityRef}>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#2C4533',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'block',
                marginBottom: 4
              }}>
                Kota / Kabupaten
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setShowCityDropdown(true);
                    if (e.target.value === '') {
                      setFormData(prev => ({ ...prev, city: '' }));
                    }
                  }}
                  onFocus={() => {
                    if (formData.province) {
                      setShowCityDropdown(true);
                    } else {
                      alert('Silakan pilih provinsi terlebih dahulu');
                    }
                  }}
                  placeholder={formData.province ? "Pilih kota" : "Pilih provinsi terlebih dahulu"}
                  disabled={!formData.province}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: '40px',
                    borderRadius: '8px',
                    border: '1px solid #DED5C3',
                    fontSize: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    background: formData.province ? '#fff' : '#F7F3EC',
                  }}
                />
                <button
                  onClick={toggleCityDropdown}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: 18,
                    cursor: 'pointer',
                    color: formData.province ? '#8A8475' : '#DED5C3',
                    padding: '0 4px',
                  }}
                  disabled={!formData.province}
                >
                  ▼
                </button>
              </div>
              {showCityDropdown && filteredCities.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 200,
                  overflowY: 'auto',
                  background: '#fff',
                  border: '1px solid #DED5C3',
                  borderRadius: '8px',
                  marginTop: 4,
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  {filteredCities.map((city) => (
                    <div
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        borderBottom: '1px solid #F0EDE8',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#E7EEE3'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kode Pos */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#2C4533',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'block',
                marginBottom: 4
              }}>
                Kode Pos
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="Kode pos"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #DED5C3',
                  fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
            </div>

            {/* Pilih Lokasi di Peta */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#2C4533',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'block',
                marginBottom: 4
              }}>
                Pilih Titik Lokasi
              </label>
              <button
                onClick={handleSelectLocation}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#F7F3EC',
                  border: '1px solid #DED5C3',
                  borderRadius: '8px',
                  fontSize: 14,
                  color: '#2C4533',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 20 }}>📍</span>
                {selectedLocation ? 'Lokasi sudah dipilih' : 'Pilih lokasi di peta'}
              </button>
              {selectedLocation && (
                <div style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: '#2C4533',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </div>
              )}
            </div>

            {/* Form Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedLocation(null);
                  setFormData({
                    label: 'Rumah',
                    address: '',
                    city: '',
                    province: '',
                    postalCode: '',
                  });
                  setProvinceSearch('');
                  setCitySearch('');
                  setShowProvinceDropdown(false);
                  setShowCityDropdown(false);
                  setTempAddress('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#E8E3DC',
                  color: '#2C4533',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleAddAddress}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: '#2C4533',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Simpan Alamat
              </button>
            </div>
          </div>
        )}

        {/* Leaflet Map Modal */}
        {showMap && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: 600,
              width: '100%',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #DED5C3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3 style={{ 
                  fontFamily: "'Plus Jakarta Sans', sans-serif", 
                  fontSize: 16, 
                  fontWeight: 700, 
                  margin: 0,
                  color: '#2C4533'
                }}>
                  Pilih Lokasi
                </h3>
                <button
                  onClick={() => setShowMap(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 22,
                    cursor: 'pointer',
                    color: '#2C4533',
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                  attributionControl={false}
                >
                  <TileLayer
                    attribution=''
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onLocationSelect={handleMapClick} />
                  {selectedLocation && (
                    <DraggableMarker 
                      position={[selectedLocation.lat, selectedLocation.lng]} 
                      onDragEnd={handleMarkerDragEnd}
                    />
                  )}
                </MapContainer>
                
                {isLoadingLocation && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
                  }}>
                    Memuat lokasi...
                  </div>
                )}
              </div>

              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #DED5C3',
                display: 'flex',
                gap: 10,
              }}>
                <button
                  onClick={handleUseCurrentLocation}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#2C4533',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Lokasi Saat Ini
                </button>
                <button
                  onClick={() => {
                    if (selectedLocation) {
                      setShowMap(false);
                    } else {
                      alert('Silakan pilih lokasi terlebih dahulu dengan mengklik peta');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#2C4533',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Pilih Lokasi Ini                </button>
              </div>
            </div>
          </div>
        )}

        {/* Address List */}
        <div style={{ marginTop: addresses.length > 0 ? 0 : 18 }}>
          {addresses.map((address) => (
            <div
              key={address.id}
              style={{
                background: '#fff',
                border: address.isPrimary ? '2px solid #2C4533' : '1px solid #DED5C3',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: 12,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: 15, 
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: '#2C4533'
                    }}>
                      {address.label}
                    </span>
                    {address.isPrimary && (
                      <span style={{
                        background: '#2C4533',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>
                        Utama
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: 13, 
                    color: '#4A4A4A', 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.5,
                    marginBottom: 2,
                  }}>
                    {address.address}
                  </div>
                  <div style={{ 
                    fontSize: 13, 
                    color: '#4A4A4A', 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.5,
                  }}>
                    {address.city}, {address.province} - {address.postalCode}
                  </div>
                  <div style={{ 
                    fontSize: 11, 
                    color: '#8A8475', 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    marginTop: 4,
                  }}>
                    📍 {address.lat.toFixed(6)}, {address.lng.toFixed(6)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 12 }}>
                  {!address.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(address.id)}
                      style={{
                        padding: '4px 12px',
                        background: 'transparent',
                        border: '1px solid #2C4533',
                        borderRadius: '6px',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#2C4533',
                        cursor: 'pointer',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Jadikan Utama
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    style={{
                      padding: '4px 12px',
                      background: 'transparent',
                      border: '1px solid #FF6B6B',
                      borderRadius: '6px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#FF6B6B',
                      cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !showAddForm && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#8A8475',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
              <p style={{ fontSize: 14 }}>Tambahkan Alamat Anda</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav active={8} onNavigate={onNavigate} />
    </div>
  );
}