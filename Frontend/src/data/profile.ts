export type UserProfile = {
  photo: string;
  name: string;
  bio: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  domicile: string;
};

export const profileStorageKey = 'preloved-profile';

export const defaultProfile: UserProfile = {
  photo: '',
  name: 'Anam Programmer Handal',
  bio: 'Penggemar barang preloved berkualitas, suka berburu fashion rapi, dan teliti menjaga detail setiap transaksi.',
  gender: 'Laki-laki',
  birthDate: '2002-08-17',
  phone: '081234567890',
  email: 'anam@example.com',
  domicile: 'Jakarta, Indonesia',
};

export const getSavedProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(profileStorageKey);
    const parsed = raw ? JSON.parse(raw) : {};

    return {
      ...defaultProfile,
      ...parsed,
      bio: parsed.bio ?? parsed.about ?? defaultProfile.bio,
    };
  } catch {
    return defaultProfile;
  }
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(profileStorageKey, JSON.stringify(profile));
};

export const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || 'US';
};
