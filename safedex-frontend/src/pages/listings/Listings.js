import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getPropertiesPage } from '../../services/api/propertyAPI';

export default function Listings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get('page')) || 1);
    const [filters, setFilters] = useState(() => ({
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        minBedrooms: searchParams.get('minBedrooms') || '',
        maxBedrooms: searchParams.get('maxBedrooms') || '',
        minBathrooms: searchParams.get('minBathrooms') || '',
        maxBathrooms: searchParams.get('maxBathrooms') || '',
        houseType: searchParams.get('types') ? searchParams.get('types').split(',') : [],
        minSafetyScore: searchParams.get('minSafetyScore') || '',
        search: searchParams.get('search') || ''
    }));
    const [sortBy, setSortBy] = useState(() => searchParams.get('sortBy') || 'price');
    const [sortOrder, setSortOrder] = useState(() => searchParams.get('sortOrder') || 'ASC');

    // Sync state from URL and fetch whenever URL params change (including browser back/forward)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1;
        const urlFilters = {
            search: params.get('search') || '',
            minPrice: params.get('minPrice') || '',
            maxPrice: params.get('maxPrice') || '',
            minBedrooms: params.get('minBedrooms') || '',
            maxBedrooms: params.get('maxBedrooms') || '',
            minBathrooms: params.get('minBathrooms') || '',
            maxBathrooms: params.get('maxBathrooms') || '',
            houseType: params.get('types') ? params.get('types').split(',') : [],
            minSafetyScore: params.get('minSafetyScore') || '',
        };
        const urlSortBy = params.get('sortBy') || 'price';
        const urlSortOrder = params.get('sortOrder') || 'ASC';

        setCurrentPage(page);
        setFilters(urlFilters);
        setSortBy(urlSortBy);
        setSortOrder(urlSortOrder);

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getPropertiesPage(
                    page,
                    urlFilters.search || null,
                    urlFilters.minPrice ? parseInt(urlFilters.minPrice) : null,
                    urlFilters.maxPrice ? parseInt(urlFilters.maxPrice) : null,
                    urlFilters.minSafetyScore ? parseInt(urlFilters.minSafetyScore) : null,
                    urlFilters.minBedrooms ? parseInt(urlFilters.minBedrooms) : null,
                    urlFilters.maxBedrooms ? parseInt(urlFilters.maxBedrooms) : null,
                    urlFilters.minBathrooms ? parseInt(urlFilters.minBathrooms) : null,
                    urlFilters.maxBathrooms ? parseInt(urlFilters.maxBathrooms) : null,
                    urlFilters.houseType.length > 0 ? urlFilters.houseType : null,
                    urlSortBy,
                    urlSortOrder
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
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleHouseTypeChange = (e) => {
        const { value, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            houseType: checked
                ? [...prev.houseType, value]
                : prev.houseType.filter(t => t !== value)
        }));
    };

    const handleSortChange = (e) => {
        const { name, value } = e.target;
        if (name === 'sortBy') {
            setSortBy(value);
        }
        if (name === 'sortOrder') {
            setSortOrder(value);
        }
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.minBedrooms) params.set('minBedrooms', filters.minBedrooms);
        if (filters.maxBedrooms) params.set('maxBedrooms', filters.maxBedrooms);
        if (filters.minBathrooms) params.set('minBathrooms', filters.minBathrooms);
        if (filters.maxBathrooms) params.set('maxBathrooms', filters.maxBathrooms);
        if (filters.houseType.length > 0) params.set('types', filters.houseType.join(','));
        if (filters.minSafetyScore) params.set('minSafetyScore', filters.minSafetyScore);
        if (sortBy !== 'price') params.set('sortBy', sortBy);
        if (sortOrder !== 'ASC') params.set('sortOrder', sortOrder);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const params = new URLSearchParams(searchParams);
            params.set('page', String(currentPage + 1));
            setSearchParams(params);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const params = new URLSearchParams(searchParams);
            if (currentPage - 1 <= 1) {
                params.delete('page');
            } else {
                params.set('page', String(currentPage - 1));
            }
            setSearchParams(params);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 hc:text-hc-text">Property Listings</h1>
                <div className="text-center hc:text-hc-text">Loading properties...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 hc:text-hc-text">Property Listings</h1>
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 hc:text-hc-text">Property Listings</h1>

            {/* Filters */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8 dark:bg-slate-800 dark:border dark:border-gray-600 hc:bg-zinc-900 hc:border hc:border-hc-border">
                <h2 className="text-xl font-semibold mb-4 hc:text-hc-text">Filter Properties</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                        Search by Postcode or Location
                    </label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="e.g., SW1A or Baker Street or Downtown"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                        dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                        hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Min Price (£/month)
                        </label>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="e.g., 500"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                            dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                            hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Max Price (£/month)
                        </label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="e.g., 1500"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                            dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                            hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Min Bedrooms
                        </label>
                        <input
                            type="number"
                            name="minBedrooms"
                            value={filters.minBedrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                            dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                            hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Max Bedrooms
                        </label>
                        <input
                            type="number"
                            name="maxBedrooms"
                            value={filters.maxBedrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                            dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                            hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Min Bathrooms
                        </label>
                        <input
                            type="number"
                            name="minBathrooms"
                            value={filters.minBathrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                            dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                            hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Max Bathrooms
                        </label>
                        <input
                            type="number"
                            name="maxBathrooms"
                            value={filters.maxBathrooms}
                            onChange={handleFilterChange}
                            placeholder="e.g., 3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50 
                            dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                            hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            House Type
                        </label>
                        <div className="space-y-1 mt-1">
                            {[{ value: 'DETACHED', label: 'Detached' }, { value: 'SEMI_DETACHED', label: 'Semi Detached' }, { value: 'FLAT', label: 'Flat' }, { value: 'TERRACED', label: 'Terraced' }].map(type => (
                                <label key={type.value} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-white hc:text-hc-text">
                                    <input
                                        type="checkbox"
                                        value={type.value}
                                        checked={filters.houseType.includes(type.value)}
                                        onChange={handleHouseTypeChange}
                                        className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span>{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Min Safety Score
                        </label>
                        <input
                            type="number"
                            name="minSafetyScore"
                            value={filters.minSafetyScore}
                            onChange={handleFilterChange}
                            placeholder="e.g., 50"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 t-yellow-500 
                            dark:bg-slate-700 dark:text-white dark:placeholder-gray-300
                            hc:placeholder:text-yellow-500 hc:bg-hc-layer hc:text-hc-text hc:border-hc-border"
                            min="0"
                            max="100"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Sort by
                        </label>
                        <select
                            name="sortBy"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-700 hc:text-gray-700"
                            aria-label="Sort Filter"
                        >
                            <option value="price">Price</option>
                            <option value="safetyScore">Safety Score</option>
                            <option value="date">Date</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white hc:text-hc-text">
                            Sort direction
                        </label>
                        <select
                            name="sortOrder"
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-700 hc:text-gray-700"
                            aria-label="Sort Direction"
                        >
                            <option value="ASC" >Ascending</option>
                            <option value="DESC" >Descending</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex space-x-3">
                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Search Properties
                    </button>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Results count */}
            <div className="mb-4 text-gray-600 dark:text-white hc:text-hc-text">
                Showing {properties.length} properties
            </div>

            {properties.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-white hc:text-hc-text">
                    No properties match your filters.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {properties.map((property) => (
                            <div key={property.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border dark:border-gray-600 hc:bg-zinc-900 hc:border hc:border-hc-border hover:scale-105 transition-transform duration-100">
                                <h2 className="text-xl font-semibold mb-2 ">{property.name}</h2>
                                <div className="text-2xl font-bold text-green-600 mb-2 dark:text-green-400">
                                    £{property.ppm}/month
                                </div>
                                {property.neighbourhood && (
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-600 dark:text-white hc:text-hc-text">
                                            Neighbourhood: {property.neighbourhood.name}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm text-gray-600 mr-2 dark:text-white hc:text-hc-text">Safety Score:</span>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                                                property.neighbourhood.safetyScore >= 80 ? 'bg-green-100 text-green-800' :
                                                property.neighbourhood.safetyScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {property.neighbourhood.safetyScore}/100
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1 dark:text-white hc:text-hc-text">
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
