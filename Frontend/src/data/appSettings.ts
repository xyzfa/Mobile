export const notificationSettingKey = 'preloved-notifications-enabled';
export const notificationSettingEvent = 'preloved-notification-setting-change';

export const getNotificationsEnabled = () => {
  const raw = localStorage.getItem(notificationSettingKey);
  return raw === null ? true : raw === 'true';
};

export const setNotificationsEnabled = (enabled: boolean) => {
  localStorage.setItem(notificationSettingKey, String(enabled));
  window.dispatchEvent(new CustomEvent(notificationSettingEvent, { detail: enabled }));
};
