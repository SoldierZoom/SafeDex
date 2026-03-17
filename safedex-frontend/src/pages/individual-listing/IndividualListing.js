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

    return (
        //stuff goes here
        <div>
            
        </div>
    );
}