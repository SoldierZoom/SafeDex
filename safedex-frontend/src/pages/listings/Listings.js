import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPropertiesPage } from '../../services/api/propertyAPI';
import { normalizeSortField, normalizeSortOrder, sortProperties, filterProperties, paginate } from './ListingsUtils';

export default function Listings() {
    const [allProperties, setAllProperties] = useState([]);
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

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllProperties();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allProperties, filters, sortBy, sortOrder]);

    const fetchAllProperties = async () => {
        try {
            setLoading(true);
            const data = await getPropertiesPage(1, null, null, null, null, null, null, null, null, null, 'price', 'ASC');
            setAllProperties(data);
            setError(null);
        } catch (err) {
            setError('Failed to load properties');
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = filterProperties(allProperties, filters);
        filtered = sortProperties(filtered, sortBy, sortOrder);

        setFilteredProperties(filtered);
        setCurrentPage(1); // Reset to first page when filters change
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
    const itemsPerPage = 6;
    const { currentItems: currentProperties, totalPages } = paginate(filteredProperties, currentPage, itemsPerPage);

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
                                        onClick={() => navigate(`/listings/${property.id}`)}
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

        </div>
    );
}
