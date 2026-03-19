import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getPropertiesPage } from '../../services/api/propertyAPI';

export default function Listings() {
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        minSafetyScore: '',
        maxPrice: '',
        neighbourhood: ''
    });
    const [sortBy, setSortBy] = useState('price'); // "price", "safetyScore", or "date"
    const [sortOrder, setSortOrder] = useState('ASC'); // "ASC" or "DESC"
    const [selectedProperty, setSelectedProperty] = useState(null); // details state

    // Debouncing ref
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        applyFilters();
    }, [sortBy, sortOrder]);

    // Debounced filter application
    const debouncedApplyFilters = useCallback(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            applyFilters();
        }, 1000); // 1000ms delay after user stops typing
    }, []);

    useEffect(() => {
        debouncedApplyFilters();
    }, [filters, debouncedApplyFilters]);

    const normalizeSortField = (field) => {
        const validFields = ['price', 'safetyScore', 'date'];
        return validFields.includes(field) ? field : 'price';
    };

    const normalizeSortOrder = (order) => (order === 'DESC' ? 'DESC' : 'ASC');

    const sortProperties = (properties) => {
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

    const applyFilters = async () => {
        try {
            setLoading(true);
            // Convert frontend filter names to backend parameter names
            const query = filters.neighbourhood ? filters.neighbourhood : null;
            const minPrice = null; // Not implemented in UI yet
            const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : null;
            const minSafetyScore = filters.minSafetyScore ? parseInt(filters.minSafetyScore) : null;

            const data = await getPropertiesPage(1, query, minPrice, maxPrice, minSafetyScore, null, null, null, null, null, sortBy, sortOrder);
            setFilteredProperties(data);
            setCurrentPage(1); // Reset to first page when filters change
            setError(null);
        } catch (err) {
            setError('Failed to load properties');
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSortChange = (e) => {
        const { name, value } = e.target;
        if (name === 'sortBy') {
            setSortBy(value);
            return;
        }
        if (name === 'sortOrder') {
            setSortOrder(value);
        }
    };

    const clearFilters = () => {
        setFilters({
            minSafetyScore: '',
            maxPrice: '',
            neighbourhood: ''
        });
    };

    // Pagination logic for filtered results
    const itemsPerPage = 6; // Show more items per page in filtered view
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProperties = filteredProperties.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Property Listings</h1>
                <div className="text-center">Loading properties...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Property Listings</h1>
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Property Listings</h1>

            {/* Filters */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Safety Score
                        </label>
                        <input
                            type="number"
                            name="minSafetyScore"
                            value={filters.minSafetyScore}
                            onChange={handleFilterChange}
                            placeholder="e.g., 70"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Price (£/month)
                        </label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="e.g., 1500"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Neighbourhood
                        </label>
                        <input
                            type="text"
                            name="neighbourhood"
                            value={filters.neighbourhood}
                            onChange={handleFilterChange}
                            placeholder="e.g., Downtown"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort by
                        </label>
                        <select
                            name="sortBy"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="price">Price</option>
                            <option value="safetyScore">Safety Score</option>
                            <option value="date">Date</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort direction
                        </label>
                        <select
                            name="sortOrder"
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Results count */}
            <div className="mb-4 text-gray-600">
                Showing {filteredProperties.length} properties
            </div>

            {currentProperties.length === 0 ? (
                <div className="text-center text-gray-500">
                    No properties match your filters.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {currentProperties.map((property) => (
                            <div key={property.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
                                <div className="text-2xl font-bold text-green-600 mb-2">
                                    £{property.ppm}/month
                                </div>
                                {property.neighbourhood && (
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-600">
                                            Neighbourhood: {property.neighbourhood.name}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm text-gray-600 mr-2">Safety Score:</span>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                                                property.neighbourhood.safetyScore >= 80 ? 'bg-green-100 text-green-800' :
                                                property.neighbourhood.safetyScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {property.neighbourhood.safetyScore}/100
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Population: {property.neighbourhood.population.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setSelectedProperty(property)}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                        ❤️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedProperty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-lg bg-white rounded-lg p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{selectedProperty.name}</h2>
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Close
                            </button>
                        </div>
                        <p className="mb-2 font-bold">£{selectedProperty.ppm}/month</p>
                        <p className="mb-2">{selectedProperty.description || 'No description available.'}</p>
                        <p className="mb-2">Type: {selectedProperty.type || 'N/A'}</p>
                        <p className="mb-2">Bedrooms: {selectedProperty.bedrooms || 'N/A'}</p>
                        <p className="mb-2">Bathrooms: {selectedProperty.bathrooms || 'N/A'}</p>
                        <p className="mb-2">Road: {selectedProperty.road || 'N/A'}</p>
                        <p className="mb-2">Postcode: {selectedProperty.postcode || 'N/A'}</p>
                        <p className="mb-2">Phone: {selectedProperty.phoneNumber || 'N/A'}</p>
                        <p className="mb-4">Email: {selectedProperty.email || 'N/A'}</p>
                        {selectedProperty.neighbourhood ? (
                            <div className="text-sm text-gray-600">
                                <p>Neighbourhood: {selectedProperty.neighbourhood.name}</p>
                                <p>Safety Score: {selectedProperty.neighbourhood.safetyScore}/100</p>
                                <p>Population: {selectedProperty.neighbourhood.population.toLocaleString()}</p>
                            </div>
                        ) : (
                            <p>No neighbourhood data.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
