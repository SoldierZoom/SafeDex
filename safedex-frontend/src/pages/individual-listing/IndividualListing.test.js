import { formatPropertyType, getSafetyScoreColour } from './IndividualListingsUtils';

//checks the property type is reformatted correctly
describe('formatPropertyType', () => {

    test('formats SEMI_DETACHED correctly', () => {
        expect(formatPropertyType('SEMI_DETACHED')).toBe('Semi Detached');});

    test('formats FLAT correctly', () => {
        expect(formatPropertyType('FLAT')).toBe('Flat'); });

    test('formats TERRACED correctly', () => {
        expect(formatPropertyType('TERRACED')).toBe('Terraced');});

    test('formats DETACHED correctly', () => {
        expect(formatPropertyType('DETACHED')).toBe('Detached'); });

});
//checks the safety score returns the correct colours
describe('getSafetyScoreColour', () => {
    test('returns green for score abve 70', () => {
        expect(getSafetyScoreColour(80)).toBe('bg-green-100 text-green-600');});

    test('returns green for boundary score of 70', () => {
        expect(getSafetyScoreColour(70)).toBe('bg-green-100 text-green-600');});

    test('returns yellow for boundary score of 69', () => {
        expect(getSafetyScoreColour(69)).toBe('bg-yellow-100 text-yellow-700');});

    test('returns yellow for score between 40 to 69', () => {
        expect(getSafetyScoreColour(55)).toBe('bg-yellow-100 text-yellow-700');});

    test('returns yellow for boundary score of 40', () => {
        expect(getSafetyScoreColour(40)).toBe('bg-yellow-100 text-yellow-700');});

    test('returns red for boundary score of 39', () => {
        expect(getSafetyScoreColour(39)).toBe('bg-red-100 text-red-600');});

    test('returns red for score from 0 to 39', () => {
        expect(getSafetyScoreColour(20)).toBe('bg-red-100 text-red-600');});

    test('returns red for score of 0', () => {
        expect(getSafetyScoreColour(0)).toBe('bg-red-100 text-red-600');});
});