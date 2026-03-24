import { normalizeSortField, normalizeSortOrder, sortProperties, filterProperties, paginate } from './ListingsUtils';

// Mock data for testing
const mockProperties = [
    { id: 1, name: 'Property A', ppm: 1500, bedrooms: 3, bathrooms: 2, type: 'DETACHED', road: '10 Baker Street', postcode: 'SW1A 1AA', neighbourhood: { name: 'Downtown', safetyScore: 80 }, date: '2024-01-01' },
    { id: 2, name: 'Property B', ppm: 2000, bedrooms: 4, bathrooms: 3, type: 'SEMI_DETACHED', road: '25 Oxford Road', postcode: 'M1 4BH', neighbourhood: { name: 'Uptown', safetyScore: 50 }, date: '2024-06-01' },
    { id: 3, name: 'Property C', ppm: 1200, bedrooms: 2, bathrooms: 1, type: 'FLAT', road: '5 Baker Avenue', postcode: 'SW1A 2PQ', neighbourhood: { name: 'Downtown', safetyScore: 30 }, date: '2024-03-01' },
    { id: 4, name: 'Property D', ppm: 1800, bedrooms: 3, bathrooms: 2, type: 'TERRACED', road: '42 High Street', postcode: 'LS1 3AD', neighbourhood: { name: 'Midtown', safetyScore: 65 }, date: '2024-09-01' },
    { id: 5, name: 'Property E', ppm: 900, bedrooms: 1, bathrooms: 1, type: 'FLAT', road: '8 Elm Close', postcode: 'E1 6AN', neighbourhood: { name: 'Eastside', safetyScore: 0 }, date: '2024-02-01' },
    { id: 6, name: 'Property F', ppm: 2500, bedrooms: 5, bathrooms: 4, type: 'DETACHED', road: '100 Park Lane', postcode: 'LS2 7HP', neighbourhood: { name: 'Safetown', safetyScore: 100 }, date: '2024-11-01' },
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
    const emptyFilters = { minPrice: '', maxPrice: '', minBedrooms: '', maxBedrooms: '', minBathrooms: '', maxBathrooms: '', houseType: '', minSafetyScore: '', search: '' };

    test('returns all properties when no filters applied', () => {
        const filtered = filterProperties(mockProperties, emptyFilters);
        expect(filtered.length).toBe(6);
    });

    test('filters by minPrice', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minPrice: '1500' });
        expect(filtered.length).toBe(4);
        expect(filtered.every(p => p.ppm >= 1500)).toBe(true);
    });

    test('filters by maxPrice', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, maxPrice: '1500' });
        expect(filtered.length).toBe(3);
        expect(filtered.every(p => p.ppm <= 1500)).toBe(true);
    });

    test('filters by minPrice and maxPrice together', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minPrice: '1200', maxPrice: '1800' });
        expect(filtered.length).toBe(3);
        expect(filtered.every(p => p.ppm >= 1200 && p.ppm <= 1800)).toBe(true);
    });

    test('filters by minBedrooms', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minBedrooms: '3' });
        expect(filtered.length).toBe(4);
        expect(filtered.every(p => p.bedrooms >= 3)).toBe(true);
    });

    test('filters by maxBedrooms', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, maxBedrooms: '3' });
        expect(filtered.length).toBe(4);
        expect(filtered.every(p => p.bedrooms <= 3)).toBe(true);
    });

    test('filters by minBathrooms', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minBathrooms: '2' });
        expect(filtered.length).toBe(4);
        expect(filtered.every(p => p.bathrooms >= 2)).toBe(true);
    });

    test('filters by maxBathrooms', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, maxBathrooms: '2' });
        expect(filtered.length).toBe(4);
        expect(filtered.every(p => p.bathrooms <= 2)).toBe(true);
    });

    test('filters by houseType', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, houseType: 'DETACHED' });
        expect(filtered.length).toBe(2);
        expect(filtered.every(p => p.type === 'DETACHED')).toBe(true);
    });

    test('filters by houseType FLAT', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, houseType: 'FLAT' });
        expect(filtered.length).toBe(2);
        expect(filtered.every(p => p.type === 'FLAT')).toBe(true);
    });

    test('applies multiple filters together', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minPrice: '1000', maxPrice: '2000', minBedrooms: '3', houseType: 'DETACHED' });
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toBe('Property A');
    });

    test('returns empty array when no properties match', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minPrice: '5000' });
        expect(filtered.length).toBe(0);
    });

    test('boundary: includes property at exact minPrice', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minPrice: '900' });
        expect(filtered.some(p => p.ppm === 900)).toBe(true);
    });

    test('boundary: includes property at exact maxPrice', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, maxPrice: '2500' });
        expect(filtered.some(p => p.ppm === 2500)).toBe(true);
    });

    test('filters by minSafetyScore', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minSafetyScore: '60' });
        expect(filtered.length).toBe(3);
        expect(filtered.every(p => p.neighbourhood.safetyScore >= 60)).toBe(true);
    });

    test('minSafetyScore includes score of 0 when min is 0', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minSafetyScore: '0' });
        expect(filtered.length).toBe(6);
    });

    test('minSafetyScore of 100 returns only perfect score', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, minSafetyScore: '100' });
        expect(filtered.length).toBe(1);
        expect(filtered[0].neighbourhood.safetyScore).toBe(100);
    });

    test('search by postcode', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, search: 'SW1A' });
        expect(filtered.length).toBe(2);
        expect(filtered.every(p => p.postcode.includes('SW1A'))).toBe(true);
    });

    test('search by road name', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, search: 'Baker' });
        expect(filtered.length).toBe(2);
        expect(filtered.every(p => p.road.toLowerCase().includes('baker'))).toBe(true);
    });

    test('search by neighbourhood name', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, search: 'Downtown' });
        expect(filtered.length).toBe(2);
        expect(filtered.every(p => p.neighbourhood.name === 'Downtown')).toBe(true);
    });

    test('search is case insensitive', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, search: 'sw1a' });
        expect(filtered.length).toBe(2);
    });

    test('search combined with other filters', () => {
        const filtered = filterProperties(mockProperties, { ...emptyFilters, search: 'LS', minBedrooms: '4' });
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toBe('Property F');
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
