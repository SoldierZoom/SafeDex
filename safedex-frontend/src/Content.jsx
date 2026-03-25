import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './lib/routes';
import SafetyScorePage from './pages/safety-score/SafetyScore';


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
            {/* route to show safety score breakdown */}
            <Route path="/neighbourhood/:id" element={<SafetyScorePage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
