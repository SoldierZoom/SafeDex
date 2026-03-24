import { normalizeSortField, normalizeSortOrder, sortProperties, filterProperties, paginate } from './ListingsUtils';

// Mock data for testing
const mockProperties = [
    { id: 1, name: 'Property A', ppm: 1500, neighbourhood: { name: 'Downtown', safetyScore: 80 }, date: '2024-01-01' },
    { id: 2, name: 'Property B', ppm: 2000, neighbourhood: { name: 'Uptown', safetyScore: 50 }, date: '2024-06-01' },
    { id: 3, name: 'Property C', ppm: 1200, neighbourhood: { name: 'Downtown', safetyScore: 30 }, date: '2024-03-01' },
    { id: 4, name: 'Property D', ppm: 1800, neighbourhood: { name: 'Midtown', safetyScore: 65 }, date: '2024-09-01' },
    { id: 5, name: 'Property E', ppm: 900, neighbourhood: { name: 'Eastside', safetyScore: 0 }, date: '2024-02-01' },
    { id: 6, name: 'Property F', ppm: 2500, neighbourhood: { name: 'Safetown', safetyScore: 100 }, date: '2024-11-01' },
];

describe('normalizeSortField', () => {
    test('returns price for valid price field', () => {
        expect(normalizeSortField('price')).toBe('price');
    });

    test('returns safetyScore for valid safetyScore field', () => {
        expect(normalizeSortField('safetyScore')).toBe('safetyScore');
    });

    test('returns date for valid date field', () => {
        expect(normalizeSortField('date')).toBe('date');
    });

    test('returns price as default for invalid field', () => {
        expect(normalizeSortField('invalid')).toBe('price');
    });

    test('returns price for empty string', () => {
        expect(normalizeSortField('')).toBe('price');
    });
});

describe('normalizeSortOrder', () => {
    test('returns ASC for ASC input', () => {
        expect(normalizeSortOrder('ASC')).toBe('ASC');
    });

    test('returns DESC for DESC input', () => {
        expect(normalizeSortOrder('DESC')).toBe('DESC');
    });

    test('returns ASC as default for invalid input', () => {
        expect(normalizeSortOrder('invalid')).toBe('ASC');
    });
});

describe('sortProperties', () => {
    test('sorts by price ascending', () => {
        const sorted = sortProperties(mockProperties, 'price', 'ASC');
        expect(sorted[0].ppm).toBe(900);
        expect(sorted[sorted.length - 1].ppm).toBe(2500);
    });

    test('sorts by price descending', () => {
        const sorted = sortProperties(mockProperties, 'price', 'DESC');
        expect(sorted[0].ppm).toBe(2500);
        expect(sorted[sorted.length - 1].ppm).toBe(900);
    });

    test('sorts by safetyScore ascending', () => {
        const sorted = sortProperties(mockProperties, 'safetyScore', 'ASC');
        expect(sorted[0].neighbourhood.safetyScore).toBe(0);
        expect(sorted[sorted.length - 1].neighbourhood.safetyScore).toBe(100);
    });

    test('sorts by safetyScore descending', () => {
        const sorted = sortProperties(mockProperties, 'safetyScore', 'DESC');
        expect(sorted[0].neighbourhood.safetyScore).toBe(100);
        expect(sorted[sorted.length - 1].neighbourhood.safetyScore).toBe(0);
    });

    test('sorts by date ascending', () => {
        const sorted = sortProperties(mockProperties, 'date', 'ASC');
        expect(sorted[0].date).toBe('2024-01-01');
        expect(sorted[sorted.length - 1].date).toBe('2024-11-01');
    });

    test('does not modify original array', () => {
        const original = [...mockProperties];
        sortProperties(mockProperties, 'price', 'ASC');
        expect(mockProperties).toEqual(original);
    });
});

describe('filterProperties', () => {
    test('filters by minimum safety score', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '60', maxPrice: '', neighbourhood: '' });
        expect(filtered.length).toBe(3);
        expect(filtered.every(p => p.neighbourhood.safetyScore >= 60)).toBe(true);
    });

    test('filters by maximum price', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '', maxPrice: '1500', neighbourhood: '' });
        expect(filtered.length).toBe(3);
        expect(filtered.every(p => p.ppm <= 1500)).toBe(true);
    });

    test('filters by neighbourhood name', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '', maxPrice: '', neighbourhood: 'Downtown' });
        expect(filtered.length).toBe(2);
        expect(filtered.every(p => p.neighbourhood.name === 'Downtown')).toBe(true);
    });

    test('filters by neighbourhood name case insensitive', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '', maxPrice: '', neighbourhood: 'downtown' });
        expect(filtered.length).toBe(2);
    });

    test('applies multiple filters together', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '60', maxPrice: '1600', neighbourhood: '' });
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toBe('Property A');
    });

    test('returns all properties when no filters applied', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '', maxPrice: '', neighbourhood: '' });
        expect(filtered.length).toBe(6);
    });

    test('returns empty array when no properties match', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '101', maxPrice: '', neighbourhood: '' });
        expect(filtered.length).toBe(0);
    });

    test('includes property with safety score of 0 when min is 0', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '0', maxPrice: '', neighbourhood: '' });
        expect(filtered.length).toBe(6);
        expect(filtered.some(p => p.neighbourhood.safetyScore === 0)).toBe(true);
    });

    test('includes only property with safety score of 100 when min is 100', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '100', maxPrice: '', neighbourhood: '' });
        expect(filtered.length).toBe(1);
        expect(filtered[0].neighbourhood.safetyScore).toBe(100);
    });

    test('excludes property with safety score of 0 when min is 1', () => {
        const filtered = filterProperties(mockProperties, { minSafetyScore: '1', maxPrice: '', neighbourhood: '' });
        expect(filtered.every(p => p.neighbourhood.safetyScore >= 1)).toBe(true);
        expect(filtered.some(p => p.neighbourhood.safetyScore === 0)).toBe(false);
    });
});

describe('paginate', () => {
    test('returns correct items for first page', () => {
        const result = paginate(mockProperties, 1, 2);
        expect(result.currentItems.length).toBe(2);
        expect(result.currentItems[0].name).toBe('Property A');
    });

    test('returns correct items for second page', () => {
        const result = paginate(mockProperties, 2, 2);
        expect(result.currentItems.length).toBe(2);
        expect(result.currentItems[0].name).toBe('Property C');
    });

    test('calculates total pages correctly', () => {
        const result = paginate(mockProperties, 1, 2);
        expect(result.totalPages).toBe(3);
    });

    test('returns empty array for page beyond total', () => {
        const result = paginate(mockProperties, 10, 2);
        expect(result.currentItems.length).toBe(0);
    });

    test('uses default items per page of 6', () => {
        const result = paginate(mockProperties, 1);
        expect(result.currentItems.length).toBe(6);
        expect(result.totalPages).toBe(1);
    });
});
