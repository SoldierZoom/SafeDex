import { useState, useEffect } from 'react';
import * as neighbourhoodApi from 'services/api/neighbourhoodApi';

export default function Heatmap() {
    const [neighbourhoods, setNeighbourhoods] = useState([]);

    useEffect(() => {
        fetchNeighbourhoods();
    }, []);

    function fetchNeighbourhoods() {
        neighbourhoodApi.getAllNeighbourhoods()
            .then(data => setNeighbourhoods(data))
            .catch(error => {
                console.error(`An error occured when fetching neighbourhoods: ${error.message}`);
            });
    }

    return (
        <div>
            {neighbourhoods.map((n, ind) => (
                <div key={ind}>{JSON.stringify(n, null, 2)}</div>
            ))}
        </div>
    );
};
