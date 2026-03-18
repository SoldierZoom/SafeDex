// import { useParams } from 'react-router-dom';
import { useState} from 'react';
// import { getNeighbourhoodById } from '../../services/api/neighbourhoodApi';
// import { getRecentCrimes } from '../../services/api/neighbourhoodApi';

// Updated mock data to match real data shape from backend
const mockNeighbourhood = {
    id: 1,
    name: "Selly Oak",
    safetyScore: 51,
    latitude: 51.5137,
    longitude: -0.1337,
    population: 15000,
    crimeTotalsByType: {
        "Shoplifting": 824,
        "Bicycle theft": 63,
        "Anti social behaviour": 314,
        "Drugs": 123,
        "Theft from the person": 36,
        "Robbery": 129,
        "Violent crime": 1755,
        "Public order": 285,
        "Vehicle crime": 378,
        "Burglary": 342,
        "Other crime": 71,
        "Other theft": 311,
        "Possession of weapons": 96,
        "Criminal damage arson": 293,
    },
    // most recent month of crimes from backend (CrimeRecord.java)
    recentCrimes: [
        { id: 1, type: "Vehicle crime",         latitude: 51.5237, longitude: -0.1585, location: "Near Selly Oak Station" },
        { id: 2, type: "Anti-social behaviour", latitude: 51.5313, longitude: -0.1570, location: "Near Selly Oak Park" },
        { id: 3, type: "Bicycle theft",      latitude: 51.5220, longitude: -0.1560, location: "Near Tesco Express" },
        { id: 4, type: "Violence",              latitude: 51.5198, longitude: -0.1610, location: "Near Bristol Pear" },
        { id: 5, type: "Drugs",       latitude: 51.5240, longitude: -0.1590, location: "Near Bristol Pear" },
        { id: 6, type: "Vehicle crime",         latitude: 51.5201, longitude: -0.1550, location: "Near Sainsbury" },
    ]
};

// Helper function to label score by color
function getSafetyColor(score) {
    if (score >= 75) return {color: "#1D9E75", label: "Safe", bg: "#E1F5EE"};
    if (score >= 50) return { color: "#BA7517", label: "Moderate", bg: "#FAEEDA" };
    return               { color: "#A32D2D", label: "High Risk",bg: "#FCEBEB" };
}

// Assign colors to crime categories
function getCategoryColor(label) {
    const colors = {
        "Shoplifting": "#3B8BD4",
        "Bicycle theft": "#EF9F27",
        "Anti social behaviour": "#E24B4A",
        "Drugs": "#D4537E",
        "Theft from the person": "#1D9E75",
        "Robbery": "#0d3572",
        "Violent crime": "#f00404",
        "Public order": "#95f1a1",
        "Vehicle crime": "#0e0e0e",
        "Burglary": "#5e1fd3",
        "Other crime": "#888780",
        "Other theft": "#496650",
        "Possession of weapons": "#460c0a",
        "Criminal damage arson": "#f17209",
    };
    return colors[label] || "#888780";
}

export default function SafetyScorePage() {
    /* 
    const { id } = useParams();
    const [property, setProperty] = useState(null)

    useEffect(() => {
        getPropertyById(id)
            .then(data => setProperty(data))
    }, [id])

    if (!property) return <p className="p-6">Loading...</p>
    */
    const neighbourhood= mockNeighbourhood;
    const [page, setPage] = useState(1);
    const { color, label, bg } = getSafetyColor(neighbourhood.safetyScore);
    const categories = Object.entries(neighbourhood.crimeTotalsByType)
        .map(([crimeLabel, count]) => ({
            label: crimeLabel,
            count,
            color: getCategoryColor(crimeLabel)
        }));
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);

    const CRIMES_PER_PAGE = 6;

    // slice the crimes array based on current page
    const totalPages = Math.ceil(neighbourhood.recentCrimes.length / CRIMES_PER_PAGE);
    const visibleCrimes = neighbourhood.recentCrimes.slice(
        (page - 1) * CRIMES_PER_PAGE,
        page * CRIMES_PER_PAGE
    );

    return (
        <div className="max-w-2x1 mx-auto px-4 py-8">

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
            <div className="rounded-x1 border  p-6 mb-6 flex items-center gap-6">
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
            <div className="rounded-x1 border p-6 mb-6">
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
            <div className="rounded-xl border border-slate-200 p-6 mb-6">
                <h2 className="text-base font-semibold mb-4">
                    Recent crimes — latest month
                    <span className="font-normal text-sm ml-2">
                        ({neighbourhood.recentCrimes.length} recorded)
                    </span>
                </h2>
 
                <div className="space-y-3">
                    {visibleCrimes.map((crime) => (
                        <div
                            key={crime.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
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
                        className="text-sm px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-30"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="text-sm">Page {page}</span>
                    <button
                        className="text-sm px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-30"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Pie chart
            <div className="rounded-x1 border border-slate-200 p-6 mb-6">
                <h2 className="text-base font-semibold text-slate-700 mb-4">Crime distribution - past 12 months</h2>
                <PieChart categories={categories} total={total} /> 
            </div> */}

        </div>
    );
}

function PieChart({ categories, total }) {
    const [hovered, setHovered] = useState(null);
    let cAngle = -Math.PI / 2;
    const cx = 100, cy = 100, r = 80;

    const slices = categories.map((cat) => {
        const angle = (cat.count / total) * 2 * Math.PI;
        const start = cAngle;
        cAngle += angle;
        const end = cAngle;
        const x1 = cx + r * Math.cos(start);
        const y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end);
        const y2 = cy + r * Math.sin(end);
        const large = angle > Math.PI ? 1 : 0;
        return { ...cat, path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2}Z`, midAngle: start + angle / 2};
    });

    // const active = hovered !== null ? categories[hovered] : null;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
                {/* Total label */}
                <div className="text-center mb-2">
                    <p className="text-sm">Total</p>
                    <p className="text-lg font-semibold">{total}</p>
                </div>

                {/* Pie */}
                <svg viewBox="0 0 200 200" width={200} height={200} style={{ flexShrink: 0 }}>
                    {slices.map((s, i) => (
                        <path
                            key={s.label}
                            d={s.path}
                            fill={s.color}
                            stroke="white"
                            strokeWidth={2}
                            opacity={hovered === null || hovered === i ? 1 : 0.4}
                            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        />    
                    ))}
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 w-full">
                {categories.map((cat, i) => {
                    const pct = Math.round((cat.count / total) * 100);
                    return (
                        <div
                            key={cat.label}
                            className="flex items-center gap-2 text-sm cursor-pointer" style={{ opacity: hovered === null || hovered === i ? 1 : 0.4, transition: 'opacity 0.2s' }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: cat.color, flexShrink: 0}} />
                            <span className="flex-1">{cat.label}</span>
                            <span className="">{pct}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}