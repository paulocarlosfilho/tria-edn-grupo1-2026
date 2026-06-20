import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { get } from 'aws-amplify/api'; // MUDANÇA 1: Importa a função 'get' diretamente
import config from './aws-exports';

Amplify.configure(config);

function App() {
  const [sinistroId, setSinistroId] = useState('');
  const [resultado, setResultado] = useState('');
  const [erro, setErro] = useState('');

  const handleConsulta = async (e) => {
    e.preventDefault();
    setResultado('');
    setErro('');

    if (!sinistroId) {
      setErro('Por favor, insira um ID de sinistro.');
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
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Portal de Consulta Tria</h1>
      <hr />
      <h2>Consultar Sinistro</h2>
      <form onSubmit={handleConsulta}>
        <input
          type="text"
          value={sinistroId}
          onChange={(e) => setSinistroId(e.target.value)}
          placeholder="ID do Sinistro"
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>Consultar</button>
      </form>

      {erro && <pre style={{ color: 'red', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{erro}</pre>}
      
      <h3>Resultado:</h3>
      <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {resultado || 'Aguardando consulta...'}
      </pre>
    </div>
  );
}

export default App;