import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('Pendente')

  const [solicitacoes, setSolicitacoes] = useState(() => {
    try {
      const dadosSalvos = localStorage.getItem('solicitacoes')
      return dadosSalvos ? JSON.parse(dadosSalvos) : []
    } catch {
      return []
    }
  })

  const [filtro, setFiltro] = useState('Todas')

  useEffect(() => {
    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes))
  }, [solicitacoes])

  function cadastrarSolicitacao(event) {
    event.preventDefault()

    if (!titulo.trim() || !descricao.trim()) {
      alert('Preencha o título e a descrição.')
      return
    }

    const novaSolicitacao = {
      id: Date.now(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status,
      data: new Date().toLocaleDateString('pt-BR'),
    }

    setSolicitacoes((listaAtual) => [...listaAtual, novaSolicitacao])

    setTitulo('')
    setDescricao('')
    setStatus('Pendente')
  }

  function alterarStatus(id, novoStatus) {
    setSolicitacoes((listaAtual) =>
      listaAtual.map((solicitacao) =>
        solicitacao.id === id
          ? { ...solicitacao, status: novoStatus }
          : solicitacao
      )
    )
  }

  function excluirSolicitacao(id) {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir esta solicitação?'
    )

    if (confirmar) {
      setSolicitacoes((listaAtual) =>
        listaAtual.filter((solicitacao) => solicitacao.id !== id)
      )
    }
  }

  const solicitacoesFiltradas =
    filtro === 'Todas'
      ? solicitacoes
      : solicitacoes.filter((solicitacao) => solicitacao.status === filtro)

  const pendentes = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Pendente'
  ).length

  const emAndamento = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Em andamento'
  ).length

  const concluidas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Concluída'
  ).length

  return (
    <main className="container">
      <header className="cabecalho">
        <p className="identificacao">SISTEMA DE GESTÃO</p>
        <h1>Solicitações</h1>
        <p>Cadastre e acompanhe suas solicitações em um só lugar.</p>
      </header>

      <section className="resumo" aria-label="Resumo das solicitações">
        <article className="resumo-card">
          <span>Total de solicitações</span>
          <strong>{solicitacoes.length}</strong>
        </article>

        <article className="resumo-card">
          <span>Pendentes</span>
          <strong>{pendentes}</strong>
        </article>

        <article className="resumo-card">
          <span>Em andamento</span>
          <strong>{emAndamento}</strong>
        </article>

        <article className="resumo-card">
          <span>Concluídas</span>
          <strong>{concluidas}</strong>
        </article>
      </section>

      <section className="painel" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">Nova solicitação</h2>

        <form onSubmit={cadastrarSolicitacao}>
          <div className="campo">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Ex.: Problema no computador"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descreva a solicitação..."
              rows="4"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="status">Status inicial</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>

          <button type="submit">Cadastrar solicitação</button>
        </form>
      </section>

      <section className="lista" aria-labelledby="titulo-lista">
        <div className="lista-cabecalho">
          <h2 id="titulo-lista">Solicitações cadastradas</h2>

          <label className="filtro">
            <span>Filtrar:</span>
            <select
              value={filtro}
              onChange={(event) => setFiltro(event.target.value)}
              aria-label="Filtrar solicitações por status"
            >
              <option value="Todas">Todas</option>
              <option value="Pendente">Pendentes</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluída">Concluídas</option>
            </select>
          </label>
        </div>

        {solicitacoesFiltradas.length === 0 ? (
          <p className="vazio">
            Nenhuma solicitação encontrada para este filtro.
          </p>
        ) : (
          <ul className="cartoes">
            {solicitacoesFiltradas.map((solicitacao) => (
              <li className="cartao" key={solicitacao.id}>
                <div className="cartao-topo">
                  <h3>{solicitacao.titulo}</h3>

                  <span
                    className={`etiqueta ${solicitacao.status
                      .toLowerCase()
                      .replace(' ', '-')}`}
                  >
                    {solicitacao.status}
                  </span>
                </div>

                <p>{solicitacao.descricao}</p>

                <p className="data">
                  Cadastrada em: {solicitacao.data || 'Data não disponível'}
                </p>

                <div className="acoes">
                  <div className="campo-status">
                    <label htmlFor={`status-${solicitacao.id}`}>
                      Alterar status
                    </label>

                    <select
                      id={`status-${solicitacao.id}`}
                      value={solicitacao.status}
                      onChange={(event) =>
                        alterarStatus(solicitacao.id, event.target.value)
                      }
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluída">Concluída</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="botao-excluir"
                    onClick={() => excluirSolicitacao(solicitacao.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="rodape">
        <p>Sistema de Registro e Acompanhamento de Solicitações</p>
      </footer>
    </main>
  )
}

export default App