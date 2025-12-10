// src/app/adm/sync/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function SyncPage() {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  const executarSync = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cursos/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      setLastResult(result);
      console.log('Sincronização:', result);
      
      // Atualizar status após sincronização
      await verificarStatus();
    } catch (error) {
      console.error('Erro:', error);
      setLastResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const verificarStatus = async () => {
    try {
      const response = await fetch('/api/cursos/sync');
      const result = await response.json();
      setStatus(result);
      console.log('Status:', result);
    } catch (error) {
      console.error('Erro:', error);
      setStatus({ error: error instanceof Error? error.message : String(error) });
    }
  };

  const verificarCursos = async () => {
    try {
      const response = await fetch('/api/cursos');
      const cursos = await response.json();
      console.log('Cursos atuais:', cursos);
      alert(`Total de cursos: ${cursos.length}\n\nVerifique o console para detalhes.`);
    } catch (error) {
      alert('Erro ao buscar cursos: ' + error);
    }
  };

  // Auto-carregar status ao entrar na página
  useEffect(() => {
    verificarStatus();
  }, []);

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🔧 Painel de Sincronização de Cursos
      </h1>
      
      {/* Botões de Ação */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Ações Disponíveis</h2>
        <div className="space-x-4">
          <button 
            onClick={verificarStatus}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            📊 Verificar Status
          </button>
          
          <button 
            onClick={executarSync}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? '⏳ Sincronizando...' : '🔄 Executar Sincronização'}
          </button>

          <button 
            onClick={verificarCursos}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
          >
            📚 Ver Cursos Atuais
          </button>
        </div>
      </div>

      {/* Status Atual */}
      {status && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">📈 Status Atual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{status.tutorialsEncontrados}</div>
              <div className="text-sm text-gray-600">Tutoriais Encontrados</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{status.cursosEmMemoria}</div>
              <div className="text-sm text-gray-600">Cursos em Memória</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{status.tutorialsSemCard?.length || 0}</div>
              <div className="text-sm text-gray-600">Tutoriais sem Card</div>
            </div>
          </div>
          
          {status.tutorialsSemCard?.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
              <h3 className="font-semibold text-yellow-800">⚠️ Tutoriais sem Card:</h3>
              <ul className="list-disc list-inside text-yellow-700">
                {status.tutorialsSemCard.map((tutorial: string) => (
                  <li key={tutorial}>{tutorial}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Resultado da Última Sincronização */}
      {lastResult && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 Último Resultado</h2>
          <div className="bg-white p-4 rounded border">
            <pre className="text-sm overflow-auto max-h-64">
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          </div>
          
          {lastResult.novosCardsCriados > 0 && (
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <div className="text-green-800 font-semibold">
                ✅ {lastResult.novosCardsCriados} novo(s) card(s) criado(s) com sucesso!
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instruções */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📖 Como Usar</h3>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Verificar Status:</strong> Mostra quantos tutoriais e cursos existem</li>
          <li><strong>Executar Sincronização:</strong> Cria cards automáticos para tutoriais sem card</li>
          <li><strong>Ver Cursos Atuais:</strong> Lista todos os cursos disponíveis (check no console)</li>
        </ul>
      </div>
    </div>
  );
}