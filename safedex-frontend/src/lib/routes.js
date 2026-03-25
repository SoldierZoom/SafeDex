import {
    LandingPage,
    ListingsPage,
    FavouritePage,
    HeatmapPage,
    IndividualListingPage,
} from '../pages';

import {
    Home,
    Heart,
} from 'lucide-react';

const routes = [
    {
        name: 'Home',
        path: '/',
        component: LandingPage,
        icon: <Home className="inline text-slate-700" />,
    },
    {
        name: 'Listings',
        path: '/listings',
        component: ListingsPage,
        icon: null,
    },
    {
        name: 'Favourites',
        path: '/favourite',
        component: FavouritePage,
        icon: <Heart className="inline text-red-400" />,
    },
    {
        name: 'Crime Map',
        path: '/heatmap',
        component: HeatmapPage,
        icon: null,
    },
    {
        name: null,
        path: '/listings/:id',
        component: IndividualListingPage,
        icon: null,
    },
];

export default routes;
