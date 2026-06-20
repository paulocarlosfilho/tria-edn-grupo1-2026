import React, { useState } from 'react';
import { Amplify, API } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import config from './aws-exports';
Amplify.configure(config);

function App({ signOut, user }) {
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
      
      // A configuração em aws-exports.js já cuida da autorização
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Olá, {user.attributes.email}!</p>
        <button onClick={signOut} style={{ padding: '8px 12px' }}>Sair</button>
      </div>
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

export default withAuthenticator(App);