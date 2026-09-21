import { ChangeEvent, useState } from 'react';
import {
  Cake,
  Camera,
  ChevronRight,
  Edit3,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Star,
  UsersRound,
} from 'lucide-react';
import BottomNav from '../components/preloved/BottomNav';
import ScreenHeader from '../components/preloved/ScreenHeader';
import { UserProfile, getInitials, getSavedProfile, saveProfile as persistProfile } from '../data/profile';

type NavigateExtra = { productId?: number; chatId?: number; from?: number };

interface ProfilsayaProps {
  onNavigate: (screen: number, extra?: NavigateExtra) => void;
}

const quickStats = [
  { label: 'Dijual', value: '12', icon: Package },
  { label: 'Dibeli', value: '5', icon: ShoppingBag },
  { label: 'Favorit', value: '3', icon: Heart },
];

const fieldStyle = {
  width: '100%',
  border: '1px solid #DED5C3',
  borderRadius: 10,
  padding: '10px 11px',
  color: '#232A22',
  fontSize: 12.5,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outlineColor: '#2C4533',
  background: '#fff',
};

const labelStyle = {
  display: 'block',
  color: '#8A8475',
  fontSize: 11.5,
  fontWeight: 700,
  marginBottom: 5,
};

const detailIconStyle = {
  width: 28,
  height: 28,
  borderRadius: 9,
  background: '#E7EEE3',
  color: '#2C4533',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const getProfileDetails = (profile: UserProfile) => [
  { icon: UsersRound, label: 'Jenis kelamin', value: profile.gender },
  { icon: Cake, label: 'Tanggal lahir', value: profile.birthDate || '-' },
  { icon: Phone, label: 'No handphone', value: profile.phone },
  { icon: Mail, label: 'Email', value: profile.email },
  { icon: MapPin, label: 'Domisili', value: profile.domicile },
  { icon: Star, label: 'Rating', value: '4.9 dari 32 ulasan' },
  { icon: ShieldCheck, label: 'Status', value: 'Member aktif sejak 2026' },
];

export default function Profilsaya({ onNavigate }: ProfilsayaProps) {
  const [profile, setProfile] = useState(getSavedProfile);
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const profileDetails = getProfileDetails(profile);

  const updateDraft = (key: keyof UserProfile, value: string) => {
    setDraftProfile((current) => ({ ...current, [key]: value }));
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateDraft('photo', String(reader.result ?? ''));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    setProfile(draftProfile);
    persistProfile(draftProfile);
    setIsEditingProfile(false);
  };

  return (
    <div className="screen-enter flex flex-col flex-1 min-h-0" style={{ background: '#F7F3EC' }}>
      <ScreenHeader title="Profil Saya" onBack={() => onNavigate(8)} />

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '16px 18px 18px' }}>
        <section
          style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(44, 69, 51, 0.08)',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              padding: '18px 16px',
              background: 'linear-gradient(135deg, #2C4533 0%, #496B4B 62%, #C68B59 100%)',
              color: '#fff',
            }}
          >
            <p
              style={{
                margin: '0 0 9px',
                color: '#EFE6D2',
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: 0,
                textTransform: 'uppercase',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Masuk sebagai
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#F7F3EC',
                  color: '#2C4533',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: '0 8px 18px rgba(0, 0, 0, 0.12)',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {profile.photo ? (
                  <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getInitials(profile.name)
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    color: '#fff',
                    fontSize: 18,
                    lineHeight: 1.2,
                    fontWeight: 700,
                    fontFamily: "'Fraunces', serif",
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {profile.name}
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 5,
                    color: '#F7E7D6',
                    fontSize: 11.5,
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <ShieldCheck size={14} strokeWidth={2.2} />
                  Akun terverifikasi
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '8px 0' }}>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '11px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: '#FBE1DA',
                  color: '#C1543C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LogOut size={18} strokeWidth={2.2} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', color: '#232A22', fontSize: 13.5, fontWeight: 800 }}>
                  Logout
                </span>
                <span style={{ display: 'block', color: '#8A8475', fontSize: 11.5, marginTop: 2, lineHeight: 1.35 }}>
                  Keluar dari akun Preloved
                </span>
              </span>
              <ChevronRight size={16} color="#C1543C" strokeWidth={2.3} />
            </button>
          </div>
        </section>

        <section
          style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 14,
            padding: '13px 0',
            display: 'flex',
            marginBottom: 14,
          }}
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderRight: index < quickStats.length - 1 ? '1px solid #DED5C3' : 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <Icon size={16} color="#C68B59" strokeWidth={2.2} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: '#2C4533', marginTop: 3 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: '#8A8475', marginTop: 1 }}>{stat.label}</div>
              </div>
            );
          })}
        </section>

        <section
          style={{
            background: '#fff',
            border: '1px solid #DED5C3',
            borderRadius: 16,
            padding: 15,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
            <h2 style={{ margin: 0, color: '#2C4533', fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>
              Detail Profil
            </h2>
            <button
              type="button"
              onClick={() => {
                setDraftProfile(profile);
                setIsEditingProfile(true);
              }}
              style={{
                width: 30,
                height: 30,
                border: '1px solid #DED5C3',
                borderRadius: 10,
                background: '#F7F3EC',
                color: '#2C4533',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Edit3 size={15} strokeWidth={2.2} />
            </button>
          </div>

          {isEditingProfile ? (
            <div style={{ marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E7EEE3', color: '#2C4533', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, fontWeight: 900 }}>
                  {draftProfile.photo ? (
                    <img src={draftProfile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(draftProfile.name)
                  )}
                </div>
                <label style={{ border: '1px solid #DED5C3', background: '#F7F3EC', color: '#2C4533', borderRadius: 999, padding: '9px 12px', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <Camera size={15} strokeWidth={2.2} />
                  Pilih Foto
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </label>
              </div>

              <label style={{ display: 'block', marginBottom: 10 }}>
                <span style={labelStyle}>Nama</span>
                <input value={draftProfile.name} onChange={(event) => updateDraft('name', event.target.value)} style={fieldStyle} />
              </label>
              <label style={{ display: 'block', marginBottom: 10 }}>
                <span style={labelStyle}>Bio</span>
                <textarea value={draftProfile.bio} onChange={(event) => updateDraft('bio', event.target.value)} rows={4} style={{ ...fieldStyle, resize: 'vertical' }} />
              </label>
              <label style={{ display: 'block', marginBottom: 10 }}>
                <span style={labelStyle}>Jenis kelamin</span>
                <select value={draftProfile.gender} onChange={(event) => updateDraft('gender', event.target.value)} style={fieldStyle}>
                  <option value="">Pilih jenis kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </label>
              <label style={{ display: 'block', marginBottom: 10 }}>
                <span style={labelStyle}>Tanggal lahir</span>
                <input type="date" value={draftProfile.birthDate} onChange={(event) => updateDraft('birthDate', event.target.value)} style={fieldStyle} />
              </label>
              <label style={{ display: 'block', marginBottom: 10 }}>
                <span style={labelStyle}>No handphone</span>
                <input type="tel" value={draftProfile.phone} onChange={(event) => updateDraft('phone', event.target.value)} style={fieldStyle} />
              </label>
              <label style={{ display: 'block', marginBottom: 10 }}>
                <span style={labelStyle}>Email</span>
                <input type="email" value={draftProfile.email} onChange={(event) => updateDraft('email', event.target.value)} style={fieldStyle} />
              </label>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <span style={labelStyle}>Domisili</span>
                <input value={draftProfile.domicile} onChange={(event) => updateDraft('domicile', event.target.value)} style={fieldStyle} />
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setDraftProfile(profile);
                    setIsEditingProfile(false);
                  }}
                  style={{ flex: 1, border: '1.5px solid #2C4533', background: '#fff', color: '#2C4533', borderRadius: 999, padding: '10px 0', fontWeight: 800, fontSize: 12.5, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  style={{ flex: 1, border: 'none', background: '#2C4533', color: '#fff', borderRadius: 999, padding: '10px 0', fontWeight: 800, fontSize: 12.5, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer' }}
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <>
              <p style={{ margin: '0 0 12px', color: '#5F665C', fontSize: 12.7, lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {profile.bio}
              </p>
              <div style={{ display: 'grid', gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {profileDetails.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#232A22', fontSize: 12.3 }}>
                      <span style={detailIconStyle}>
                        <Icon size={15} strokeWidth={2.2} />
                      </span>
                      <span style={{ color: '#8A8475', flex: 1 }}>{info.label}</span>
                      <strong style={{ color: '#232A22', fontSize: 12, textAlign: 'right', maxWidth: 150, overflowWrap: 'anywhere' }}>{info.value || '-'}</strong>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>

      <BottomNav active={8} onNavigate={onNavigate} />
    </div>
  );
}
