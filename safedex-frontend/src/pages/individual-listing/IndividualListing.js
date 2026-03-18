//nts copied from heatmsp
import { useState, useEffect } from 'react';
import { getPropertyById } from 'services/api/propertyAPI';
//to get id from url
import { useParams } from 'react-router-dom';

export default function IndividualListing() {
    const {id} = useParams();
    const [property, setProperty] = useState(null);
    
        //nts remodelled from heatmap
        useEffect(() => {
            fetchProperty();
        }, []);
    
        function fetchProperty() {
            getPropertyById(id)
                .then(data => setProperty(data))
                .catch(error => {
                    console.error(`An error occured when fetching a property: ${error.message}`);
                });
        }

    //shows loading if getting stuff from API
    if (property == null) return <div>Loading property...</div>;

    let propertyTypeReformat = property.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    return (
        //stuff goes here
        <div>
            <h1>{property.road}, {property.neighbourhood.name}, {property.postcode}</h1>
            <h1>£{property.ppm} ppm</h1>

            <h2>Property details:</h2>
            <p>PROPERTY TYPE:</p>
            <p>{propertyTypeReformat}</p>
            <p>BEDROOMS:</p>
            <p>{property.bedrooms}</p>
            <p>BATHROOMS:</p>
            <p>{property.bathrooms}</p>
            <h2>Description</h2>
            {property.description ?
            <p>{property.description}</p> :
            <p>This lovely {propertyTypeReformat.toLowerCase()} located on {property.road} in {property.neighbourhood.name} has {property.bedrooms} bedrooms and {property.bathrooms} bathrooms!</p>}
            <h2>Contact information</h2>
            <p>Phone number: {property.phoneNumber}</p>
            {property.email && <p>email : {property.email}</p>}
            <h2>Neighbourhood safety score:</h2>
            <p>{property.neighbourhood.safetyScore}</p>
            <p>The neighbourhood safety score is calculated out of 100 based on recent local crime data. See the safety score overview or neighbourhood map for more information.</p>
        </div>
    );
}