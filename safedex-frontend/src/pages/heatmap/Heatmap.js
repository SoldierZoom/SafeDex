import { useState, useEffect } from 'react';
import * as neighbourhoodApi from 'services/api/neighbourhoodApi';
import { processPolygon, displayCrimeType } from './HeatmapUtils';

import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup,
    Tooltip,
    Circle,
    CircleMarker
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import HeatmapLayer from 'react-leaflet-heat-layer';
import { Filter, House, Cctv, Map } from 'lucide-react';

import 'leaflet/dist/leaflet.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'

export default function Heatmap() {
    const [neighbourhoods, setNeighbourhoods] = useState([]);
    const [crimeOptions, setCrimeOptions] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Map Options
    const [showNeighbourhood, setShowNeighbourhood] = useState(true);
    const [showCrimeTotal, setShowCrimeTotal] = useState(true);
    const [showHeatmap, setShowHeatmap] = useState(false);

    useEffect(() => {
        function fetchNeighbourhoods() {
            neighbourhoodApi.getAllNeighbourhoods()
                .then(data => {
                    const processedNeighbourhoods = data.map(h => ({
                        ...h, boundaryPoints: processPolygon(h.boundaryPoints),
                    }))

                    setNeighbourhoods(processedNeighbourhoods);
                    setIsLoading(false);

                    const crimeTypes = {};
                    data.forEach(h => {
                        const keys = Object.keys(h.crimeTotalsByType);
                        keys.forEach(k => {
                            if (Object.keys(crimeTypes).includes(k)) {
                                crimeTypes[k].count += h.crimeTotalsByType[k];
                            } else {
                                crimeTypes[k] = {
                                    count: h.crimeTotalsByType[k],
                                    show: true,
                                }
                            }
                        });
                    });

                    setCrimeOptions({...crimeTypes});
                })
                .catch(error => {
                    console.error(`An error occured when fetching neighbourhoods: ${error.message}`);
                });
        }

        fetchNeighbourhoods();
    }, []);


    console.log({ neighbourhoods, crimeOptions });

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    function handleCrimeOptionsToggle(e) {
        const crime = e.target.name;
        setCrimeOptions(prev => ({
            ...prev,
            [crime]: {
                ...prev[crime],
                show: e.target.checked,
            }
        }));
    }

    const Heatmap = () => {
        const crimePoints = [];
        neighbourhoods.forEach(neigh => {
            neigh.recentCrimes.forEach(crime => {
                if (crimeOptions[crime.type].show) {
                    crimePoints.push([crime.latitude, crime.longitude]);
                }
            })
        });

        return (
            <HeatmapLayer latlngs={crimePoints} />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-10 text-4xl font-bold">Crime Heatmap</h1>
            <div className="flex justify-center h-[80vh] w-full gap-3">
                <div className="h-full min-w-max w-[25%] p-3 border-2 rounded-2xl overflow-y-scroll">
                    <label className="flex m-2 space-x-2 items-center">
                        <Filter />
                        <h3 className="text-2xl font-bold">Crime Filter</h3>
                    </label>
                    <hr className="my-3 border-2"/>
                    <div className="flex my-4 space-x-3">
                        <button
                            onClick={() => setShowNeighbourhood(p => !p)}
                            className={`flex items-center gap-1 py-1 px-2 border-2 rounded-xl font-semibold ${(showNeighbourhood)? 'text-blue-800 bg-blue-300 border-blue-900' : 'text-gray-500 border-gray-500'}`}
                        >
                            <House /> Neighbourhood
                        </button>
                        <button
                            onClick={() => setShowCrimeTotal(p => !p)}
                            className={`flex items-center gap-1 py-1 px-2 border-2 rounded-xl font-semibold ${(showCrimeTotal)? 'text-blue-800 bg-blue-300 border-blue-900' : 'text-gray-500 border-gray-500'}`}
                        >
                            <Cctv /> Total
                        </button>
                        <button
                            onClick={() => setShowHeatmap(p => !p)}
                            className={`flex items-center gap-1 py-1 px-2 border-2 rounded-xl font-semibold ${(showHeatmap)? 'text-blue-800 bg-blue-300 border-blue-900' : 'text-gray-500 border-gray-500'}`}
                        >
                            <Map /> Heatmap
                        </button>
                    </div>
                    <ul className="flex flex-col space-y-2">
                        {Object.keys(crimeOptions).map((crime, i) => (
                            <li
                                key={i} 
                                className="flex mx-1 px-2 text-xl"
                            >
                                <label className="flex-grow font-semibold text-slate-600">{displayCrimeType(crime)}</label>
                                <div className="flex space-x-3 items-center">
                                    <span className="px-3 bg-slate-300 rounded-3xl">{crimeOptions[crime].count}</span>
                                    <input
                                        id={crime}
                                        name={crime}
                                        type="checkbox"
                                        defaultChecked={crimeOptions[crime].show}
                                        onChange={(e) => handleCrimeOptionsToggle(e)}
                                        className="size-4"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative flex p-1 justify-center border-2 border-black rounded-xl">
                    <MapContainer
                        center={[neighbourhoods[0].latitude, neighbourhoods[0].longitude]}
                        zoom={13}
                        scrollWheelZoom={true}
                        className="h-[100%] w-[60vw]"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {showNeighbourhood && (
                            <div>
                                {neighbourhoods.map((neigh, i) => (
                                    <CircleMarker
                                        key={i}
                                        center={[neigh.latitude, neigh.longitude]}
                                        radius={10}
                                    >
                                        <Polygon
                                            pathOptions={{ color: 'black' }}
                                            positions={neigh.boundaryPoints}
                                        />
                                        <Popup>
                                            <label className="text-lg font-bond">{neigh.name}</label>
                                            <hr className="my-1"/>
                                            <ul>
                                                {Object.keys(neigh.crimeTotalsByType).map((k, i) => (
                                                    <li key={i}>
                                                        {displayCrimeType(k)}: {neigh.crimeTotalsByType[k]}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Popup>
                                        <Tooltip>{neigh.name}</Tooltip>
                                    </CircleMarker>
                                ))}
                            </div>
                        )}
                        {showHeatmap && (<Heatmap />)}
                        {showCrimeTotal && (
                            <MarkerClusterGroup
                                chunkedLoading
                                animate
                                showCoverageOnHover={false}
                            >
                                {neighbourhoods.map((neigh, i) =>(
                                    <div key={i}>
                                        {neigh.recentCrimes.map((crime, j) => {
                                            return (
                                                <div key={j}>
                                                    {crimeOptions[crime.type].show && (
                                                        <Circle
                                                            key={j}
                                                            center={[crime.latitude, crime.longitude]}
                                                            pathOptions={{ color: 'red', fillColor: 'orange' }}
                                                            radius={8}
                                                        >
                                                            <Tooltip>
                                                                <p><strong>Location: </strong>{crime.location}</p>
                                                                <p><strong>Type: </strong>{displayCrimeType(crime.type)}</p>
                                                            </Tooltip>
                                                        </Circle>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </MarkerClusterGroup>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};
