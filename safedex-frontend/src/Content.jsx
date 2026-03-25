import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './lib/routes';
import SafetyScorePage from './pages/safety-score/SafetyScore';

export default function Content() {
    return (
        <Routes>
            {routes.map(({ path, component }) => (
                <Route
                    key={path}
                    path={path}
                    element={component}
                />
            ))}
            {/* route to show safety score breakdown */}
            <Route path="/neighbourhood/:id" element={<SafetyScorePage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
