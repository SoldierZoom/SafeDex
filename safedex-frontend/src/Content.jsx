import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './lib/routes';

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
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
