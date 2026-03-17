// import { useParams } from 'react-router-dom';
import { useState } from 'react';

// Mock data - replace with real API call
const mockProperty = {
    id: 1,
    address: "123 Bristol Road",
    city: "Birmingham",
    postcode: "B29 6DA",
    rent: 1800,
    bedrooms: 3,
    safety_score: 51,
    crime_stats: {
        total_crimes: 5020,
        categories: [
            { label: "Shoplifting",                     count: 824, color: "#3B8BD4" },
            { label: "Bicycle theft",                   count: 63, color: "#EF9F27" },
            { label: "Anti social behaviour",           count: 314, color: "#E24B4A" },
            { label: "Drugs",                           count: 123, color: "#D4537E" },
            { label: "Theft from the person",           count: 36, color: "#1D9E75" },
            { label: "Robbery",                         count: 129, color: "#0d3572" },
            { label: "Violent crime",                   count: 1755, color: "#f00404" },
            { label: "Public order",                    count: 285, color: "#95f1a1" },
            { label: "Vehicle crime",                   count: 378, color: "#0e0e0e" },
            { label: "Burglary",                        count: 342, color: "#5e1fd3" },
            { label: "Other crime",                     count: 71, color: "#888780" },
            { label: "Other theft",                     count: 311, color: "#496650" },
            { label: "Possession of weapons",           count: 96, color: "#460c0a" },
            { label: "Criminal damage arson",           count: 293, color: "#f17209" },
        ]
    }
};

// Helper function to label score by color
function getSafetyColor(score) {
    if (score >= 75) return {color: "#1D9E75", label: "Safe", bg: "#E1F5EE"};
    if (score >= 50) return { color: "#BA7517", label: "Moderate", bg: "#FAEEDA" };
    return               { color: "#A32D2D", label: "High Risk",bg: "#FCEBEB" };
}

export default function SafetyScorePage() {
    // const { id } = useParams();
    // Fetch from API using id in future
    const property = mockProperty;
    const { color, label, bg } = getSafetyColor(property.safety_score);
    const total = property.crime_stats.categories.reduce((s, c) => s + c.count, 0)

    return (
        <div className="max-w-2x1 mx-auto px-4 py-8">

            {/* Address header */}
            <div className="mb-6">
                <p className="text-sm ">{property.city} · {property.postcode} </p>
                <h1 className="text-2x1 font-semibold ">{property.address}</h1>
                <p className="mt-1">{property.bedrooms} bed · £{property.rent.toLocaleString()}/mo</p>
            </div>

            {/* Overall safety score card */}
            <div className="rounded-x1 border  p-6 mb-6 flex items-center gap-6">
                <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 80, height: 80, background: bg, border: `3px solid ${color}` }}>
                    <span style={{ color, fontSize: 24, fontWeight: 600 }}>
                        {property.safety_score}
                    </span>
                </div>
                <div>
                    <p className="text-sm  mb-1">Overall safety score</p>
                    <span className="text-sm font-medium px-3 py-1 rounded-full"
                    style={{ background: bg, color }}>
                        {label}
                    </span>
                    <p className=" text-sm mt-2">Based on {property.crime_stats.total_crimes} reported crimes in the past 12 months.
                    </p>
                </div>
            </div>

            { /* Crime breakdown */}
            <div className="rounded-x1 border p-6 mb-6">
                <h2 className="text-base font-semibold mb-4">Crime breakdown</h2>
                <div className="space-y-3">
                    {property.crime_stats.categories.map((cat) => { 
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

            {/* Pie chart */}
            <div className="rounded-x1 border border-slate-200 p-6 mb-6">
                <h2 className="text-base font-semibold text-slate-700 mb-4">Crime distribution - past 12 months</h2>
                <PieChart categories={property.crime_stats.categories} total={total} />
            </div>

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
            {/* Pie */}
            <div className="text-center mb-2">
                <p className="text-sm">Total</p>
                <p className="text-lg font-semibold">{total}</p>
            </div>
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