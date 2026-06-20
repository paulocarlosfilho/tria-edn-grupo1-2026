import React, { useState } from 'react';
import { Amplify, API } from 'aws-amplify';
import config from './aws-exports';

// Removi as importações do 'withAuthenticator' e do CSS dele.

Amplify.configure(config);

// A função agora é só 'App', sem precisar de 'signOut' ou 'user'.
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
      const path = `/sinistros/${sinistroId}`; // Ajuste o path se sua API for diferente
      
      // A chamada agora é mais simples, sem precisar de autenticação.
      const response = await API.get(apiName, path, {});
      setResultado(JSON.stringify(response, null, 2));

    } catch (error) {
      console.error('Erro ao consultar API:', error);
      setErro('Falha ao consultar o sinistro. Verifique o ID e tente novamente. (Veja o console para mais detalhes)');
      setResultado(JSON.stringify(error.response, null, 2));
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

// Removi o 'withAuthenticator' que criava a tela de login.
export default App;