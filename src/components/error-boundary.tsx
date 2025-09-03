import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-red-200 rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-red-600 text-xl font-semibold mb-4">Erro na aplicação</h1>

        <div className="bg-gray-100 p-4 rounded border overflow-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {isRouteErrorResponse(error) 
              ? `${error.status} - ${error.statusText || 'Erro desconhecido'}\n\n${error.data || 'Nenhuma informação adicional'}`
              : error instanceof Error 
                ? `${error.message}\n\n${error.stack || 'Stack trace não disponível'}`
                : `Erro: ${JSON.stringify(error, null, 2)}`
            }
          </pre>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Recarregar
        </button>
      </div>
    </div>
  )
}