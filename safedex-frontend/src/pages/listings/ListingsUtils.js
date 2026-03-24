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

    if (filters.minPrice) {
        filtered = filtered.filter(property => property.ppm >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
        filtered = filtered.filter(property => property.ppm <= parseFloat(filters.maxPrice));
    }

    if (filters.minBedrooms) {
        filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.minBedrooms));
    }

    if (filters.maxBedrooms) {
        filtered = filtered.filter(property => property.bedrooms <= parseInt(filters.maxBedrooms));
    }

    if (filters.minBathrooms) {
        filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.minBathrooms));
    }

    if (filters.maxBathrooms) {
        filtered = filtered.filter(property => property.bathrooms <= parseInt(filters.maxBathrooms));
    }

    if (filters.houseType) {
        filtered = filtered.filter(property => property.type === filters.houseType);
    }

    if (filters.minSafetyScore) {
        filtered = filtered.filter(property => (property.neighbourhood?.safetyScore ?? 0) >= parseFloat(filters.minSafetyScore));
    }

    if (filters.search) {
        const term = filters.search.toLowerCase();
        filtered = filtered.filter(property => {
            const postcode = (property.postcode || '').toLowerCase();
            const road = (property.road || '').toLowerCase();
            const neighbourhood = (property.neighbourhood?.name || '').toLowerCase();
            return postcode.includes(term) || road.includes(term) || neighbourhood.includes(term);
        });
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
