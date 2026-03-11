import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import {Cadastro} from "./pages/Cadastro.tsx";
import {RotaPrivada} from "./components/RotaPrivada.tsx";
import {Dashboard} from "./pages/Dashboard.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route
                    path="/tarefas"
                    element={
                        <RotaPrivada>
                            <Dashboard />
                        </RotaPrivada>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}