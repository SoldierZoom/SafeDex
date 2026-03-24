// Unit Tests - testing helper functions 
import { getSafetyColor, getCategoryColor } from './SafetyScore';

describe('getSafetyColor', () => {
    test('returns Safe and green for score 70 and above', () => {
        const result = getSafetyColor(70);
        expect(result.label).toBe('Safe');
        expect(result.color).toBe('#1D9E75');
    });

    test('returns Safe for score 100', () => {
        const result = getSafetyColor(100);
        expect(result.label).toBe('Safe');
    });

    test('returns Moderate and amber for score between 40 and 69', () => {
        const result = getSafetyColor(60);
        expect(result.label).toBe('Moderate');
        expect(result.color).toBe('#f1ce08');
    });

    test('returns Moderate for score exactly 50', () => {
        const result = getSafetyColor(50);
        expect(result.label).toBe('Moderate');
    });

    test('returns High Risk and red for score below 40', () => {
        const result = getSafetyColor(30);
        expect(result.label).toBe('High Risk');
        expect(result.color).toBe('#A32D2D');
    });

    test('returns High Risk for score 0', () => {
        const result = getSafetyColor(0);
        expect(result.label).toBe('High Risk');
    });
});

describe('getCategoryColor', () => {
    test('returns correct colour for violent-crime', () => {
        expect(getCategoryColor('violent-crime')).toBe('#D4537E');
    });

    test('returns correct colour for anti-social-behaviour', () => {
        expect(getCategoryColor('anti-social-behaviour')).toBe('#3B8BD4');
    });

    test('returns default grey for unknown category', () => {
        expect(getCategoryColor('unknown-category')).toBe('#888780');
    });
});
