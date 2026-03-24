import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPropertiesPage } from '../../services/api/propertyAPI';

export default function Listings() {
    const [properties, setProperties] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        minBedrooms: '',
        maxBedrooms: '',
        minBathrooms: '',
        maxBathrooms: '',
        houseType: '',
        minSafetyScore: '',
        search: ''
    });
    const [sortBy, setSortBy] = useState('price');
    const [sortOrder, setSortOrder] = useState('ASC');

    const navigate = useNavigate();

    useEffect(() => {
        fetchProperties();
    }, [currentPage, filters, sortBy, sortOrder]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await getPropertiesPage(
                currentPage,
                filters.search || null,
                filters.minPrice ? parseInt(filters.minPrice) : null,
                filters.maxPrice ? parseInt(filters.maxPrice) : null,
                filters.minSafetyScore ? parseInt(filters.minSafetyScore) : null,
                filters.minBedrooms ? parseInt(filters.minBedrooms) : null,
                filters.maxBedrooms ? parseInt(filters.maxBedrooms) : null,
                filters.minBathrooms ? parseInt(filters.minBathrooms) : null,
                filters.maxBathrooms ? parseInt(filters.maxBathrooms) : null,
                filters.houseType ? [filters.houseType] : null,
                sortBy,
                sortOrder
            );
            setProperties(data.properties || data);
            setTotalPages(data.totalPages || 1);
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
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        const { name, value } = e.target;
        if (name === 'sortBy') {
            setSortBy(value);
        }
        if (name === 'sortOrder') {
            setSortOrder(value);
        }
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            minBedrooms: '',
            maxBedrooms: '',
            minBathrooms: '',
            maxBathrooms: '',
            houseType: '',
            minSafetyScore: '',
            search: ''
        });
        setCurrentPage(1);
    };

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
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search by Postcode or Location
                    </label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="e.g., SW1A or Baker Street or Downtown"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Min Price (£/month)
                        </label>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="e.g., 500"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Price (£/month)
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
                            Min Bedrooms
                        </label>
                        <input
                            type="number"
                            name="minBedrooms"
                            value={filters.minBedrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Bedrooms
                        </label>
                        <input
                            type="number"
                            name="maxBedrooms"
                            value={filters.maxBedrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Min Bathrooms
                        </label>
                        <input
                            type="number"
                            name="minBathrooms"
                            value={filters.minBathrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Bathrooms
                        </label>
                        <input
                            type="number"
                            name="maxBathrooms"
                            value={filters.maxBathrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            House Type
                        </label>
                        <select
                            name="houseType"
                            value={filters.houseType}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="DETACHED">Detached</option>
                            <option value="SEMI_DETACHED">Semi Detached</option>
                            <option value="FLAT">Flat</option>
                            <option value="TERRACED">Terraced</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Min Safety Score
                        </label>
                        <input
                            type="number"
                            name="minSafetyScore"
                            value={filters.minSafetyScore}
                            onChange={handleFilterChange}
                            placeholder="e.g., 50"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max="100"
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
                Showing {properties.length} properties
            </div>

            {properties.length === 0 ? (
                <div className="text-center text-gray-500">
                    No properties match your filters.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {properties.map((property) => (
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
