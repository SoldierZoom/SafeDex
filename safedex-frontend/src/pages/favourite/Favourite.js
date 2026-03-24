<<<<<<< HEAD
import React from 'react';

export default function FavouritesPage({ favourites = [], onDeleteFavourite}) {

    // No favourites selected by user yet
    if (!favourites || favourites.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-6">Your Favourites </h1>
                <p className="text-gray-500">
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
                {favourites.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400 text-lg">
                            Image
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
                        <div className="text-2xl font-bold text-green-600 mb-2">
                            £{property.ppm}/month
                        </div>
                        {property.neighbourhood && (
                            <div className="mb-4 text-sm text-gray-600">
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
                            <button
                                onClick={() => onDeleteFavourite(property.id)} // Removing property from favourites 
                                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

}
=======
import "./Favourite.css";
export default function Favourite() {
    return <h1>This is the favourite listing page</h1>;
}


>>>>>>> origin/feature/propertyListings
