import React, { useState } from 'react';

function App() {
  document.title = "Trai";
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Aguardando envio de laudo...');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(`Arquivo selecionado: ${e.target.files[0].name}`);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Por favor, selecione um arquivo PDF primeiro.');
      return;
    }

    setLoading(true);
    setStatus('Iniciando upload para o Amazon S3...');

    // Simulando o gatilho de upload para o S3 Buckets de Ingestão
    setTimeout(() => {
      setLoading(false);
      setStatus('✅ Upload concluído! O EventBridge já acionou o processamento via IA (Textract + Bedrock).');
      setFile(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans">
      
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-lg font-black text-xl tracking-wider">DS</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Trai</h1>
            <p className="text-xs text-slate-400">EDN • Trai • Grupo 1 • 2026</p>
          </div>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
          AWS Serverless Active
        </span>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ingestão de Sinistros</h2>
          <p className="mt-3 text-lg text-slate-400">
            Envie o laudo médico ou documento técnico. Nossa IA cuidará da extração, triagem e persistência.
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-slate-950 border border-slate-800 w-full rounded-2xl p-8 shadow-2xl transition-all">
          <form onSubmit={handleUpload} className="space-y-6">
            
            {/* AREA DE DROP */}
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-8 text-center cursor-pointer bg-slate-900/50 transition-colors group relative">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <svg className="mx-auto h-12 w-12 text-slate-500 group-hover:text-amber-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <div className="text-sm font-medium text-slate-300">
                  <span className="text-amber-400 group-hover:underline">Clique para anexar</span> ou arraste o PDF aqui
                </div>
                <p className="text-xs text-slate-500">Apenas arquivos PDF são aceitos para processamento OCR</p>
              </div>
            </div>

            {/* STATUS DA OPERAÇÃO */}
            <div className={`p-4 rounded-xl border text-sm font-medium transition-all ${
              status.includes('✅') 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{status}</span>
              </div>
            </div>

            {/* BOTÃO DE SUBMIT */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-3 px-4 rounded-xl font-bold tracking-wide transition-all shadow-lg ${
                !file || loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? 'Processando Evento...' : 'Enviar para Processamento'}
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER COPORATIVO */}
      <footer className="border-t border-slate-800 bg-slate-950/20 px-6 py-4 text-center text-xs text-slate-500">
        Hackathon EdN 2026 • DocuSmart Serverless Ingestion Platform
      </footer>
    </div>
  );
}

export default App;