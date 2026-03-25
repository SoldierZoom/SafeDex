import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FavouritePage({ favourites = [], onDeleteFavourite}) {
    const navigate = useNavigate();

    // No favourites selected by user yet
    if (!favourites || favourites.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-6 dark:text-white">Your Favourites </h1>
                <p className="text-gray-500 dark:text-slate-200 hc:text-hc-text">
                    You haven't added any properties to your favourites yet.
                </p>
            </div>
        );
    }

    // User has selected at least one favourite - show cards of each property copied from listings 
    if (favourites.length > 0) {
    
        return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Your Favourites</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {favourites.map((property) => {
                    //gets first listing image in order to display it
                    const firstImage = property.images
                    ?.slice()
                    .sort((a, b) => a.position - b.position)[0];
                    return (
                        <button key={property.id} 
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer dark:bg-slate-900 dark:border dark:border-gray-600 hc:border hc:border-yellow-300 hc:bg-zinc-800 hover:scale-105 transition-transform duration-100"
                            onClick={() => navigate(`/listings/${property.id}`)}
                    >
    
                        
                        {firstImage ? (
                        <img
                            src={firstImage.path}
                            alt={`Photo of ${property.road}`}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        ) : (
                            <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400 text-lg">
                                No Image Available
                            </div>
                        )}
                        <h2 className="text-xl font-semibold mb-2 mt-2">{property.road}, {property.neighbourhood.name}, {property.postcode}</h2>
                        <div className="text-2xl font-bold text-green-600 mb-2">
                            £{property.ppm}/month
                        </div>
                        {property.neighbourhood && (
                            <div className="mb-4 text-sm text-gray-600 dark:text-white hc:text-hc-text">
                                <p>Neighbourhood: {property.neighbourhood.name}</p>
                                <p>
                                    Safety Score: 
                                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                        property.neighbourhood.safetyScore >= 80 ? 'bg-green-100 text-green-800' :
                                        property.neighbourhood.safetyScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {property.neighbourhood.safetyScore}/100
                                    </span>
                                </p>
                                <p>Population: {property.neighbourhood.population.toLocaleString()}</p>
                            </div>
                        )}
                        <div className="flex space-x-2">
                            
                            {/*removes the property from favourites*/}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteFavourite(property.id);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                ❌
                            </button>
                        </div>
                    </button>
                );
            })}
            </div>
        </div>
        );
    }
}
