import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import './Auth.css';
import axios from "axios";

export function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const navigate = useNavigate();

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        try {
            await api.post('/auth/register', {nome, email, senha});
            setSucesso('Conta criada com sucesso! Redirecionando...');
            setTimeout(() => navigate('/login'), 2000);
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
                    <h2 className="auth-title">Criar Nova Conta</h2>

                    <form onSubmit={handleCadastro} className="auth-form">
                        <div className="auth-field">
                            <label>Nome Completo</label>
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
                                   placeholder="Maria Silva"/>
                        </div>

                        <div className="auth-field">
                            <label>E-mail</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                   placeholder="maria@email.com"/>
                        </div>

                        <div className="auth-field">
                            <label>Senha</label>
                            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required
                                   placeholder="Crie uma senha forte"/>
                        </div>

                        {erro && <p className="auth-message msg-error">{erro}</p>}
                        {sucesso && <p className="auth-message msg-success">{sucesso}</p>}

                        <button type="submit" className="auth-btn auth-btn-success">Registar agora</button>
                    </form>

                    <p className="auth-footer">
                        Já tem uma conta? <Link to="/login" className="auth-link">Faça Login aqui</Link>
                    </p>
                </div>
            </div>
        );
    }

