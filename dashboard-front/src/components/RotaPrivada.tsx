import { Navigate } from 'react-router-dom';

export function RotaPrivada({ children }: any) {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}