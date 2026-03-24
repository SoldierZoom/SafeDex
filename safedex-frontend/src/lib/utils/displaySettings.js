// displaySettings.js
// Centralized logic for display customization (text size, color, contrast)

export const defaultDisplaySettings = {
  textSize: 'medium', // 'small', 'medium', 'large'
  colorScheme: 'default', // 'default', 'high-contrast', 'dark', etc.
  background: '#fff',
  foreground: '#222',
  contrast: 'normal', // 'normal', 'high'
};

export function applyDisplaySettings(settings) {
  // Apply CSS variables or classes to document root
  const root = document.documentElement;
  root.style.setProperty('--text-size', getTextSizeValue(settings.textSize));
  root.style.setProperty('--background', settings.background);
  root.style.setProperty('--foreground', settings.foreground);
  root.style.setProperty('--contrast', settings.contrast === 'high' ? '2' : '1');
  // Add more as needed
}

function getTextSizeValue(size) {
  switch (size) {
    case 'small': return '14px';
    case 'large': return '20px';
    default: return '16px';
  }
}

export function getDisplaySettingsFromStorage() {
  try {
    const stored = localStorage.getItem('displaySettings');
    return stored ? JSON.parse(stored) : defaultDisplaySettings;
  } catch {
    return defaultDisplaySettings;
  }
}

export function saveDisplaySettingsToStorage(settings) {
  localStorage.setItem('displaySettings', JSON.stringify(settings));
}
