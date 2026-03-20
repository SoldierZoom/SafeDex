//nts copied from heatmsp
import { useState, useEffect } from 'react';
import { getPropertyById } from 'services/api/propertyAPI';
//to get id from url and to navigate back to listings
import { useParams, useNavigate } from 'react-router-dom';
//icons for styling from https://lucide.dev/icons/
import { House, Bed, Bath, PhoneCall, Mail, Heart,TriangleAlert } from 'lucide-react';

export default function IndividualListing() {
    const {id} = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    
        //nts remodelled from heatmap
        useEffect(() => {
            fetchProperty();
        }, []);
    
        function fetchProperty() {
            getPropertyById(id)
                .then(data =>{
                    setProperty(data);
                    setLoading(false);})
                .catch(error => {
                    console.error(`An error occured when fetching a property: ${error.message}`);
                    setLoading(false);
                });
        }

    //For navigating back to listings
    const navigate = useNavigate();

    //shows loading whilst accessing the API
    if (loading) return (
        <div className = "container font-semibold text-3xl py-5 text-center">
            <h1>Loading...</h1>
        </div>
    );

    //shows error if can't api doesn't return a listing
    if (property == null) return (<div className = "container px-2 py-5 font-semibold text-center">
            <TriangleAlert className= " mt-5 text-red-600 place-self-center w-20 h-20"/>
            <h1 className = "mt-3 text-3xl">Listing Not Found</h1>
            <button 
            onClick={() => navigate('/listings')}
            className="mt-5 text-lg bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200">
                Return to Listings Search
            </button>
        </div>);

    //reformats the property type listing e.g. SEMI_DETACHED goes to Semi Detached
    let propertyTypeReformat = property.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    //sets the colours for displaying the safety score
    const safetyScoreColour = 
    property.neighbourhood.safetyScore >= 70 ? 'bg-green-100 text-green-600' :
    property.neighbourhood.safetyScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
    'bg-red-100 text-red-600';

    return (
        //stuff goes here
        <div className="container mx-auto px-2 py-4">
            {/*address and price*/}
            <h1 className="text-4xl font-bold mb-1">{property.road}, {property.neighbourhood.name}, {property.postcode}</h1>
            <h2 className="text-3xl font-semibold mb-6">£{property.ppm} ppm</h2>
            
           {/*two columns, left side has property info, right has contant infi*/}
            <div className='flex px-2 gap-4 items-center'>
            
                {/*left col */}
                <div className = "">
                
                {/*property info column*/}
                <h2 className="text-2xl font-semibold mb-4">Property details:</h2>

                    <div className = "flex justify-between gap-2 text-center bg-gray-50 rounded shadow-md p-4 mb-8 min-w-96">
                        <div className = "ml-5">
                            <House className="inline w-8 h-8 mb-1"/>
                            <p className="text-gray-500 text-sm"> PROPERTY TYPE:</p>
                            <p className="text-lg">{propertyTypeReformat}</p>
                        </div>
                        <div>
                            <Bed className="inline w-8 h-8 mb-1"/>
                            <p className="text-gray-500 text-sm">BEDROOMS:</p>
                            <p className="text-lg">{property.bedrooms}</p>
                        </div>
                        <div className = "mr-5">
                            <Bath className="inline w-8 h-8 mb-1"/>
                            <p className="text-gray-500 text-sm">BATHROOMS:</p>
                            <p className="text-lg">{property.bathrooms}</p>
                        </div>
                    </div>

                {/*description*/}
                <h2 className="text-2xl font-semibold mb-2">Description</h2>

                <div className='flex max-w-xl mb-4 text-xl'>
                    {property.description ?
                    <p>{property.description}</p> :
                    <p>This lovely {propertyTypeReformat.toLowerCase()} located on {property.road} in {property.neighbourhood.name} has {property.bedrooms} bedrooms and {property.bathrooms} bathrooms!</p>}
                </div>
                </div>
                
                {/*right columh*/}
                <div className = "flex gap-4 p-3">

                {/*safety score*/}
                    <div className={`rounded-lg p-4 text-center ${safetyScoreColour}`}>
                        <h2 className="text-2xl font-semibold mb-2">Safety score</h2>
                        <p className="text-5xl font-bold mb-2">{property.neighbourhood.safetyScore}</p>
                        <p className="text-gray-500 text-md">out of 100</p>
                    </div>

                {/*contact info*/}
                <div className="bg-blue-100 flex flex-col justify-center rounded-lg p-4 text-center">
                    <h2 className = "text-2xl font-semibold mb-2">Contact information</h2>

                    <div className = "text-center text-lg p-4">
                        <div>
                            <PhoneCall className="inline w-5 h-5 mb-1"/>
                            <p>Phone number:</p>
                            <p className = "mb-3">{property.phoneNumber}</p>
                        </div>
                        {property.email &&  <div>
                            <Mail className="inline w-5 h-5 mr-1"/>
                            <p>Email address:</p> 
                            <p className = "mb-3">{property.email}</p></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <button className="mt-5 text-lg bg-red-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-500">
                <Heart className="inline w-5 h-5 mr-1"/>
                Add to favourites!
            </button>
       
        </div>
    );
}