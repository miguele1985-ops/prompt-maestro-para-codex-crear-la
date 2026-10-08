export const privacyPreferenceKey = "mcs-cookie-consent";
export const privacyPreferenceEvent = "mcs-privacy-change";

export type PrivacyPreferences = { version: 1; analytics: boolean };
let failedSave = false;

export function readPrivacyPreferences(): PrivacyPreferences | null {
  if (typeof window === "undefined" || failedSave) return null;
  try {
    const value = JSON.parse(localStorage.getItem(privacyPreferenceKey) || "null");
    return value?.version === 1 && typeof value.analytics === "boolean" ? value : null;
  } catch {
    // Legacy generic acceptance is not permission for the new, specific purpose.
    return null;
  }
}

export function analyticsAllowed() {
  return readPrivacyPreferences()?.analytics === true;
}

export function savePrivacyPreferences(analytics: boolean) {
  try {
    localStorage.setItem(privacyPreferenceKey, JSON.stringify({ version: 1, analytics }));
    failedSave = false;
  } catch {
    // If storage is unavailable, optional collection stays disabled.
    failedSave = true;
  }
  window.dispatchEvent(new Event(privacyPreferenceEvent));
}
