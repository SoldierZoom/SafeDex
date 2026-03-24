import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getNeighbourhoodById } from '../../services/api/neighbourhoodApi';
import { getRecentCrimes } from '../../services/api/neighbourhoodApi';

// Helper function to label score by color
function getSafetyColor(score) {
    if (score >= 75) return {color: "#1D9E75", label: "Safe", bg: "#E1F5EE"};
    if (score >= 50) return { color: "#BA7517", label: "Moderate", bg: "#FAEEDA" };
    return               { color: "#A32D2D", label: "High Risk",bg: "#FCEBEB" };
}

// Assign colors to crime categories
function getCategoryColor(label) {
    const colors = {
        "anti-social-behaviour": "#3B8BD4",
        "vehicle-crime":         "#EF9F27",
        "theft-from-the-person": "#E24B4A",
        "violent-crime":         "#D4537E",
        "criminal-damage-arson": "#1D9E75",
        "other-crime":           "#888780",
        "shoplifting":           "#9B59B6",
        "burglary":              "#E67E22",
        "robbery":               "#E74C3C",
        "drugs":                 "#2ECC71",
        "bicycle-theft":         "#1ABC9C",
        "possession-of-weapons": "#C0392B",
        "public-order":          "#F39C12",
        "other-theft":           "#8E44AD",
    };
    return colors[label] || "#888780";
}

export default function SafetyScorePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [neighbourhood, setNeighbourhood] = useState(null);
    const [recentCrimes, setRecentCrimes] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        getNeighbourhoodById(id)
            .then(data => setNeighbourhood(data))
            .catch(() => setError("Failed to load neighbourhood data. Please try again."))
    }, [id])

    useEffect(() => {
        getRecentCrimes(id, page)
            .then(data => setRecentCrimes(data))
    }, [id, page])

    if (!neighbourhood) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-red-500 font-semibold text-lg">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                Try again
            </button>
        </div>
    );
    
    const { color, label, bg } = getSafetyColor(neighbourhood.safetyScore);
    const categories = Object.entries(neighbourhood.crimeTotalsByType)
        .map(([crimeLabel, count]) => ({
            label: crimeLabel,
            count,
            color: getCategoryColor(crimeLabel)
        }));
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);

    const visibleCrimes = recentCrimes;

    return (
        <div className="container mx-auto px-4 py-4">

            {/* Neighbourhood header */}
            <div className="mb-6">
                <p className="text-sm">Neighbourhood</p>
                <h1 className="text-2xl font-semibold">{neighbourhood.name}</h1>
                <p className="mt-1">
                    Population: {neighbourhood.population.toLocaleString()} ·{' '}
                    {neighbourhood.latitude.toFixed(4)}, {neighbourhood.longitude.toFixed(4)}
                </p>
            </div>

            {/* Overall safety score card */}
            <div className="rounded-xl border p-4 mb-6 flex flex-wrap items-center gap-6">
                <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 80, height: 80, background: bg, border: `3px solid ${color}` }}>
                    <span style={{ color, fontSize: 24, fontWeight: 600 }}>
                        {neighbourhood.safetyScore}
                    </span>
                </div>
                <div>
                    <p className="text-sm  mb-1">Overall safety score</p>
                    <span className="text-sm font-medium px-3 py-1 rounded-full"
                    style={{ background: bg, color }}>
                        {label}
                    </span>
                    <p className="text-sm mt-2">Based on {total} reported crimes in the past 12 months.
                    </p>
                </div>
            </div>

            { /* Crime breakdown bars */}
            <div className="rounded-x1 border p-4 mb-6 overflow-hidden">
                <h2 className="text-base font-semibold mb-4">Crime breakdown - past year</h2>
                <div className="space-y-3">
                    {categories.map((cat) => {
                        const pct = Math.round((cat.count / total) * 100);
                        return (
                            <div key={cat.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{cat.label}</span>
                                    <span>{cat.count} ({pct}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="h-2 roundd-full"
                                    style={{ width: `${pct}%`, background: cat.color }}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent crimes list - latest month */}
            <div className="rounded-xl border border-slate-200 p-4 mb-6 overflow-x-auto">
                <h2 className="text-base font-semibold mb-4">
                    Recent crimes — latest month
                    <span className="font-normal text-sm ml-2">
                        (page {page})
                    </span>
                </h2>
 
                <div className="space-y-3">
                    {visibleCrimes.map((crime) => (
                        <div
                            key={crime.id}
                            tabIndex={0}
                            className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 focus:outline-2 focus:outline-blue-500"
                        >
                            {/* colour dot matching crime type */}
                            <div
                                className="rounded-full shrink-0 mt-1"
                                style={{ width: 10, height: 10, background: getCategoryColor(crime.type) }}
                            />
 
                            <div className="flex-1">
                                {/* crime type */}
                                <p className="text-sm font-medium">{crime.type}</p>
                                {/* rough location */}
                                <p className="text-sm">{crime.location}</p>
                                {/* coordinates */}
                                <p className="text-xs mt-1">
                                    {crime.latitude.toFixed(4)}, {crime.longitude.toFixed(4)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center justify-between mt-4">
                    <button
                        className="text-sm px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-30 focus:outline focus:outline-2 focus:outline-blue-500"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="text-sm">Page {page}</span>
                    <button
                        className="text-sm px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-30 focus:outline focus:outline-2 focus:outline-blue-500"
                        onClick={() => setPage(p => p + 1)}
                        disabled={recentCrimes.length === 0}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Back button */}
            <div className="flex justify-start mt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-lg bg-gray-300 px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold focus:outline focus:outline-2 focus:outline-blue-500">
                    Back
                </button>
            </div>
        </div>
    );
}
