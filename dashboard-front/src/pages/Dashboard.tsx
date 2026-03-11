import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './Dashboard.css';

interface Categoria { id: number; nome: string; }
interface Tarefa {
    id: number; titulo: string; descricao: string; status: string;
    prioridade: string; dataVencimento: string; categoria?: Categoria;
}

export function Dashboard() {


    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [prioridade, setPrioridade] = useState('BAIXA');
    const [categoriaId, setCategoriaId] = useState('');
    const [novaCategoria, setNovaCategoria] = useState('');
    const [erro, setErro] = useState('');
    const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

    const navigate = useNavigate();

    const handleCriarCategoria = async () => {
        if (!novaCategoria.trim()) return;
        try {
            await api.post('/categorias', { nome: novaCategoria });
            setNovaCategoria('');
            carregarCategorias();
        } catch (error) { alert('Erro ao criar categoria.'); }
    };


    const carregarTarefas = async () => {
        try { const resposta = await api.get('/tarefas'); setTarefas(resposta.data); }
        catch (error) { console.error("Erro ao buscar tarefas", error); }
    };
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);

    const carregarCategorias = async () => {
        try { const resposta = await api.get('/categorias'); setCategorias(resposta.data); }
        catch (error) { console.error("Erro ao buscar categorias", error); }
    };

    useEffect(() => {
        carregarTarefas();
        carregarCategorias();
    }, []);


    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const iniciarEdicao = (tarefa: Tarefa) => {
        setTarefaEditando(tarefa);
        setTitulo(tarefa.titulo);
        setDescricao(tarefa.descricao || '');
        setPrioridade(tarefa.prioridade);
        setCategoriaId(tarefa.categoria ? tarefa.categoria.id.toString() : '');

        if (tarefa.dataVencimento) {
            const [dataPart, horaPart] = tarefa.dataVencimento.split(' ');
            const [dia, mes, ano] = dataPart.split('/');
            const [hora, min] = horaPart.split(':');
            setDataVencimento(`${ano}-${mes}-${dia}T${hora}:${min}`);
        } else { setDataVencimento(''); }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };



    const cancelarEdicao = () => {
        setTarefaEditando(null); setTitulo(''); setDescricao('');
        setDataVencimento(''); setPrioridade('BAIXA'); setCategoriaId(''); setErro('');
    };

    const handleSalvarTarefa = async (e: React.FormEvent) => {
        e.preventDefault(); setErro('');
        try {
            let dataFormatada = null;
            if (dataVencimento) {
                const [data, hora] = dataVencimento.split('T');
                const [ano, mes, dia] = data.split('-');
                dataFormatada = `${dia}/${mes}/${ano} ${hora}:00`;
            }
            const catId = categoriaId ? Number(categoriaId) : null;

            if (tarefaEditando) {
                await api.put(`/tarefas/${tarefaEditando.id}`, {
                    titulo, descricao, prioridade, dataVencimento: dataFormatada,
                    status: tarefaEditando.status, categoriaId: catId
                });
            } else {
                await api.post('/tarefas', {
                    titulo, descricao, prioridade, dataVencimento: dataFormatada, categoriaId: catId
                });
            }
            cancelarEdicao(); carregarTarefas();
        } catch (error) { setErro('Erro ao guardar a tarefa. Verifique os dados!'); }
    };

    const handleConcluirTarefa = async (tarefa: Tarefa) => {
        try {
            await api.put(`/tarefas/${tarefa.id}`, {
                ...tarefa, status: 'CONCLUIDA', categoriaId: tarefa.categoria ? tarefa.categoria.id : null
            });
            carregarTarefas();
        } catch (error) { alert('Erro ao concluir a tarefa.'); }
    };

    const handleExcluirTarefa = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            try { await api.delete(`/tarefas/${id}`); carregarTarefas(); }
            catch (error) { alert('Erro ao excluir a tarefa.'); }
        }
    };

    const totalTarefas = tarefas.length;
    const concluidas = tarefas.filter(t => t.status === 'CONCLUIDA').length;
    const pendentes = tarefas.filter(t => t.status === 'PENDENTE').length;
    return (
        <div className="dashboard-container">

            <header className="header">
                <h1>Meu Dashboard</h1>
                <button className="btn btn-danger" onClick={handleLogout}>Sair do Sistema</button>
            </header>

            <div className="stats-container">
                <div className="stat-card">
                    <h4>Total</h4>
                    <span className="text-blue">{totalTarefas}</span>
                </div>
                <div className="stat-card">
                    <h4>Pendentes</h4>
                    <span className="text-orange">{pendentes}</span>
                </div>
                <div className="stat-card">
                    <h4>Concluídas</h4>
                    <span className="text-green">{concluidas}</span>
                </div>
            </div>

            <div className={`form-container ${tarefaEditando ? 'edit-mode' : ''}`}>
                <h3 className="form-title">
                    {tarefaEditando ? `✏️ Editando: ${tarefaEditando.titulo}` : '✨ Nova Tarefa'}
                </h3>

                <form onSubmit={handleSalvarTarefa} className="form-group">
                    <div className="input-row">
                        <div className="input-field">
                            <label>Título da Tarefa</label>
                            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Estudar React" />
                        </div>
                        <div className="input-field">
                            <label>Descrição</label>
                            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes adicionais..." />
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-field">
                            <label>Data de Vencimento</label>
                            <input type="datetime-local" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
                        </div>
                        <div className="input-field">
                            <label>Prioridade</label>
                            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                                <option value="BAIXA">Baixa</option>
                                <option value="MEDIA">Média</option>
                                <option value="ALTA">Alta</option>
                            </select>
                        </div>
                        <div className="input-field">
                            <label>Categoria</label>
                            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                                <option value="">Nenhuma</option>
                                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                            </select>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                <input type="text" placeholder="Nova pasta..." value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)} style={{ flex: 1, padding: '6px' }} />
                                <button type="button" className="btn btn-success" onClick={handleCriarCategoria} style={{ padding: '6px 12px' }}>+</button>
                            </div>
                        </div>
                    </div>

                    {erro && <p style={{ color: 'red', margin: '0' }}>{erro}</p>}

                    <div className="input-row" style={{ marginTop: '10px' }}>
                        <button type="submit" className={`btn ${tarefaEditando ? 'btn-warning' : 'btn-primary'}`} style={{ flex: 1 }}>
                            {tarefaEditando ? '💾 Salvar Alterações' : '+ Adicionar Tarefa'}
                        </button>
                        {tarefaEditando && (
                            <button type="button" className="btn btn-secondary" onClick={cancelarEdicao}>Cancelar</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="task-list">
                {tarefas.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b' }}>Nenhuma tarefa encontrada. Aproveite o dia! ☕</p>
                ) : (
                    tarefas.map((tarefa) => (
                        <div key={tarefa.id} className="task-card">
                            <div>
                                <h3 className={`task-title ${tarefa.status === 'CONCLUIDA' ? 'title-riscado' : ''}`}>
                                    {tarefa.titulo}
                                </h3>
                                <p className="task-desc">{tarefa.descricao}</p>
                                <div className="task-meta">
                                    <span className="badge">📅 {tarefa.dataVencimento || 'Sem data'}</span>
                                    {tarefa.categoria && <span className="badge">📁 {tarefa.categoria.nome}</span>}
                                    <span className="badge">⚡ {tarefa.prioridade}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <span style={{ fontWeight: 'bold' }} className={tarefa.status === 'PENDENTE' ? 'status-pendente' : 'status-concluida'}>
                  {tarefa.status}
                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-warning" onClick={() => iniciarEdicao(tarefa)}>✏️</button>
                                    {tarefa.status === 'PENDENTE' && (
                                        <button className="btn btn-success" onClick={() => handleConcluirTarefa(tarefa)}>✓</button>
                                    )}
                                    <button className="btn btn-danger" onClick={() => handleExcluirTarefa(tarefa.id)}>🗑️</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}