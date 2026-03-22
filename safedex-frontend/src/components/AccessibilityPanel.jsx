import { useState } from 'react';
import { getDisplaySettingsFromStorage, saveDisplaySettingsToStorage, applyDisplaySettings, defaultDisplaySettings } from '../lib/utils/displaySettings';
import { trapFocus } from '../lib/utils/keyboardAccessibility';

export default function AccessibilityPanel({ onClose }) {
    const [settings, setSettings] = useState(getDisplaySettingsFromStorage());

    const handleChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveDisplaySettingsToStorage(newSettings);
        applyDisplaySettings(newSettings);
    };

    const handleReset = () => {
        setSettings(defaultDisplaySettings);
        saveDisplaySettingsToStorage(defaultDisplaySettings);
        applyDisplaySettings(defaultDisplaySettings);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-2"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="a11y-panel-title"
            >
                <h2 id="a11y-panel-title" className="text-2xl font-bold mb-4">Accessibility Settings</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="text-size" className="block text-sm font-medium mb-1">Text Size</label>
                        <select
                            id="text-size"
                            value={settings.textSize}
                            onChange={(e) => handleChange('textSize', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="small">Small (14px)</option>
                            <option value="medium">Medium (16px)</option>
                            <option value="large">Large (20px)</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="color-scheme" className="block text-sm font-medium mb-1">Color Scheme</label>
                        <select
                            id="color-scheme"
                            value={settings.colorScheme}
                            onChange={(e) => handleChange('colorScheme', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="default">Default</option>
                            <option value="dark">Dark Mode</option>
                            <option value="high-contrast">High Contrast</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="contrast" className="block text-sm font-medium mb-1">Contrast</label>
                        <select
                            id="contrast"
                            value={settings.contrast}
                            onChange={(e) => handleChange('contrast', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="normal">Normal</option>
                            <option value="high">High Contrast</option>
                        </select>
                    </div>

                    <div className="bg-blue-50 p-3 rounded text-sm">
                        <p><strong>Keyboard Shortcut:</strong> Press <kbd>Alt+A</kbd> to toggle this panel</p>
                        <p><strong>Close:</strong> Press <kbd>Esc</kbd> to close</p>
                    </div>
                </div>

                <div className="mt-6 flex space-x-2">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 duration-200"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
