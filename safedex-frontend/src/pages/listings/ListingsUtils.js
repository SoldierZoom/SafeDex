// Utility functions extracted from Listings.js for testing

export const normalizeSortField = (field) => {
    const validFields = ['price', 'safetyScore', 'date'];
    return validFields.includes(field) ? field : 'price';
};

export const normalizeSortOrder = (order) => (order === 'DESC' ? 'DESC' : 'ASC');

export const sortProperties = (properties, sortBy, sortOrder) => {
    const field = normalizeSortField(sortBy);
    const order = normalizeSortOrder(sortOrder);

    return [...properties].sort((a, b) => {
        let aValue;
        let bValue;

        if (field === 'price') {
            aValue = a.ppm ?? 0;
            bValue = b.ppm ?? 0;
        } else if (field === 'safetyScore') {
            aValue = a.neighbourhood?.safetyScore ?? 0;
            bValue = b.neighbourhood?.safetyScore ?? 0;
        } else {
            const parseDate = (obj) => {
                const value = obj?.date || obj?.createdAt || obj?.created_at;
                const parsed = value ? Date.parse(value) : NaN;
                return Number.isNaN(parsed) ? 0 : parsed;
            };
            aValue = parseDate(a);
            bValue = parseDate(b);
        }

        if (aValue === bValue) return 0;
        const comparison = aValue > bValue ? 1 : -1;
        return order === 'ASC' ? comparison : -comparison;
    });
};

export const filterProperties = (properties, filters) => {
    let filtered = properties;

    if (filters.minSafetyScore) {
        filtered = filtered.filter(property =>
            property.neighbourhood && property.neighbourhood.safetyScore >= parseInt(filters.minSafetyScore)
        );
    }

    if (filters.maxPrice) {
        filtered = filtered.filter(property => property.ppm <= parseFloat(filters.maxPrice));
    }

    if (filters.neighbourhood) {
        filtered = filtered.filter(property =>
            property.neighbourhood && property.neighbourhood.name.toLowerCase().includes(filters.neighbourhood.toLowerCase())
        );
    }

    return filtered;
};

export const paginate = (items, currentPage, itemsPerPage = 6) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
        currentItems: items.slice(startIndex, endIndex),
        totalPages: Math.ceil(items.length / itemsPerPage),
    };
};
