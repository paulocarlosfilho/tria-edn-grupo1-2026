import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { get } from 'aws-amplify/api'; // MUDANÇA 1: Importa a função 'get' diretamente
import config from './aws-exports';

Amplify.configure(config);

function App() {
  const [sinistroId, setSinistroId] = useState('');
  const [resultado, setResultado] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConsulta = async (e) => {
    e.preventDefault();
    setResultado('');
    setErro('');
    setLoading(true);

    if (!sinistroId) {
      setErro('Por favor, insira um ID de sinistro.');
      setLoading(false);
      return;
    }

    try {
      const apiName = 'TriaAPI';
      const path = `/sinistros/${sinistroId}`;
      
      // MUDANÇA 2: A forma de chamar a API mudou para o padrão da v6
      const restOperation = get({
        apiName: apiName,
        path: path
      });

      const { body } = await restOperation.response;
      const responseData = await body.json(); // O corpo da resposta agora precisa ser lido como JSON

      setResultado(JSON.stringify(responseData, null, 2));

    } catch (error) {
      console.error('Erro ao consultar API:', error);
      setErro('Falha ao consultar o sinistro. Verifique o ID e tente novamente. (Veja o console para mais detalhes)');
      // A resposta de erro também pode vir de forma diferente
      const errorBody = await error.response?.body.json();
      setResultado(JSON.stringify(errorBody || error.response, null, 2));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="text-center mb-0">Portal de Consulta Tria</h1>
        </div>
        <div className="card-body">
          <h2 className="card-title">Consultar Sinistro</h2>
          <form onSubmit={handleConsulta}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                value={sinistroId}
                onChange={(e) => setSinistroId(e.target.value)}
                placeholder="Digite o ID do Sinistro"
                disabled={loading}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="visually-hidden">Loading...</span> Consultando...
                  </>
                ) : 'Consultar'}
              </button>
            </div>
          </form>

          {erro && <div className="alert alert-danger mt-4">{erro}</div>}
          
          <h3 className="mt-4">Resultado:</h3>
          <pre className="bg-dark text-white p-3 rounded">
            <code>
              {resultado || 'Aguardando consulta...'}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;