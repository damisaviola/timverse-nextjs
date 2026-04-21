/**
 * Triggers a short haptic feedback vibration on supported devices.
 * Used to give a "native" feel to touch interactions.
 */
export const vibrateDevice = (pattern: number | number[] = 10) => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors (e.g. user gesture requirement)
    }
  }
};
