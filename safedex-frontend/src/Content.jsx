import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './lib/routes';


export default function Content({
    favourites,
    addFavourite,
    onDeleteFavourite
}) {
    return (
        <Routes>
            {routes.map(({ path, component: Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <Component
                            favourites={favourites}
                            addFavourite={addFavourite}
                            onDeleteFavourite={onDeleteFavourite}
                        />
                    }
                />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
