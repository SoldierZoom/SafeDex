import {
    LandingPage,
    ListingsPage,
    FavouritePage,
    HeatmapPage,
    SafetyScorePage,
} from '../pages';

import {
    Home,
    Heart,
    List,
    Map,
} from 'lucide-react';

const routes = [
    {
        name: 'Home',
        path: '/',
        component: <LandingPage />,
        icon: <Home className="inline text-slate-700" />,
    },
    {
        name: 'Listings',
        path: '/listings',
        component: <ListingsPage />,
        icon: <List className="inline text-slate-700" />,
    },
    {
        name: 'Favourite',
        path: '/favourite',
        component: <FavouritePage />,
        icon: <Heart className="inline text-red-400" />,
    },
    {
        name: 'Crime Heatmap',
        path: '/heatmap',
        component: <HeatmapPage />,
        icon: <Map className="inline text-slate-700" />,
    },
    {
        name: 'Safety Score',
        path: '/neighbourhood/:id',
        component: <SafetyScorePage />,
        icon: null,
    }
];

export default routes;
