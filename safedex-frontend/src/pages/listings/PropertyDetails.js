import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../../services/api/propertyAPI';

export default function PropertyDetails() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            const data = await getPropertyById(id);
            setProperty(data);
            setError(null);
        } catch (err) {
            setError('Failed to load property details');
            console.error('Error fetching property:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading property details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Property not found.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-semibold mb-4">{property.name}</h1>
                <p className="text-2xl font-bold text-green-600 mb-4">£{property.ppm}/month</p>
                <p className="mb-2">{property.description || 'No description available.'}</p>
                <p className="mb-2">Type: {property.type || 'N/A'}</p>
                <p className="mb-2">Bedrooms: {property.bedrooms || 'N/A'}</p>
                <p className="mb-2">Bathrooms: {property.bathrooms || 'N/A'}</p>
                <p className="mb-2">Road: {property.road || 'N/A'}</p>
                <p className="mb-2">Postcode: {property.postcode || 'N/A'}</p>
                <p className="mb-2">Phone: {property.phoneNumber || 'N/A'}</p>
                <p className="mb-4">Email: {property.email || 'N/A'}</p>
                {property.neighbourhood ? (
                    <div className="text-sm text-gray-600">
                        <p>Neighbourhood: {property.neighbourhood.name}</p>
                        <p>Safety Score: {property.neighbourhood.safetyScore}/100</p>
                        <p>Population: {property.neighbourhood.population.toLocaleString()}</p>
                    </div>
                ) : (
                    <p>No neighbourhood data.</p>
                )}
                <button
                    onClick={() => window.history.back()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Back to Listings
                </button>
            </div>
        </div>
    );
}