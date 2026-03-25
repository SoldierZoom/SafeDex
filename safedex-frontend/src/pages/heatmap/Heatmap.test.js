import { processPolygon, displayCrimeType } from './HeatmapUtils';

describe('processPolygon', () => {

    test('processPolygon test 1', () => {
        expect(processPolygon([
            { latitude: 0, longitude: 0 },
            { latitude: 1, longitude: 1 },
            { latitude: 2, longitude: 2 },
        ])).toStrictEqual([[0, 0], [1, 1], [2, 2]]);
    });

    test('processPolygon test 2', () => {
        expect(processPolygon([
            { latitude: 56.6, longitude: 45.5 },
            { latitude: 56.7, longitude: 45.6 },
            { latitude: 56.8, longitude: 45.7 },
        ])).toStrictEqual([[56.6, 45.5], [56.7, 45.6], [56.8, 45.7]]);
    });
});

describe('displayCrimeType', () => {

    test('display ShopLifting crimeType correctly', () => {
        expect(displayCrimeType("shoplifting")).toBe("Shoplifting");
    });

    test('display Bicycle Theft crimeType correctly', () => {
        expect(displayCrimeType("bicycle-theft")).toBe("Bicycle Theft");
    });

    test('display Anti Social Behavior crimeType correctly', () => {
        expect(displayCrimeType("anti-social-behaviour")).toBe("Anti Social Behaviour");
    });

    test('display unlisted crimeType correctly', () => {
        expect(displayCrimeType("none-existent-crimetype")).toBe("none-existent-crimetype");
    });
});

