import {
    LandingPage,
    ListingsPage,
    FavouritePage,
    HeatmapPage,
<<<<<<< HEAD
    SafetyScorePage,
=======
    IndividualListingPage,
>>>>>>> c2ca0c3a855d44057a58edac8f393e576773ea9c
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
        path: '/listings/:id/safety',
        component: <SafetyScorePage />,
        icon: null,
    }
        name: null,
        path: '/listings/:id',
        component: <IndividualListingPage />,
        icon: null,
    },
];

export default routes;
