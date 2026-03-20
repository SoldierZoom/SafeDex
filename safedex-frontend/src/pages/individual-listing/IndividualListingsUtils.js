//exported functions so they can be used in unit testing
export const formatPropertyType = (type) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export const getSafetyScoreColour = (score) => {
    return score >= 70 ? 'bg-green-100 text-green-600' :
        score >= 40 ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-600';
}