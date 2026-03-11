import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {api} from "../services/api.ts";
import axios from "axios";
import "./auth.css";

export function Login(){

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            const resposta = await api.post('/auth/login', { email, senha });
            const token = resposta.data.token;
            localStorage.setItem('token', token);
            navigate('/tarefas');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const mensagem = error.response?.data?.message || "E-mail ou senha incorretos.";
                setErro(mensagem);
            } else {
                setErro("Ocorreu um erro inesperado.");
            }
        }
    };

    return (
    <div className="auth-container">
        <div className="auth-card">
            <h2 className="auth-title">Acesso ao Dashboard</h2>

            <form onSubmit={handleLogin} className="auth-form">
                <div className="auth-field">
                    <label>E-mail</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
                </div>

                <div className="auth-field">
                    <label>Senha</label>
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" />
                </div>

                {erro && <p className="auth-message msg-error">{erro}</p>}

                <button type="submit" className="auth-btn">Entrar na Conta</button>
            </form>

            <p className="auth-footer">
                Não tem uma conta? <Link to="/cadastro" className="auth-link">Registe-se aqui</Link>
            </p>
        </div>
    </div>
    )
}