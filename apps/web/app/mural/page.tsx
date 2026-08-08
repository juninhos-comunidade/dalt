import { cookies } from "next/headers";

export default async function MuralPage() {
  // Simulando verificação de autenticação para a rota mista
  // Em uma aplicação real, você validaria um JWT ou cookie de sessão.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const isAuthenticated = !!sessionToken;

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Mural / Calendário</h1>
      
      <div className="w-full max-w-4xl p-8 border rounded-lg shadow-sm bg-white text-black">
        <h2 className="text-2xl font-semibold mb-4">Eventos Públicos</h2>
        <p className="mb-8">Aqui você pode visualizar os eventos disponíveis para todos.</p>
        
        {/* Renderização Condicional Baseada no Estado de Autenticação */}
        {isAuthenticated ? (
          <div className="p-6 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-xl font-bold text-green-800 mb-2">Interação Liberada</h3>
            <p className="text-green-700 mb-4">
              Você está autenticado! Agora você pode marcar datas no calendário e postar no mural.
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Adicionar Evento
            </button>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Acesso Limitado</h3>
            <p className="text-gray-600 mb-4">
              Você está vendo o mural no modo leitura. Faça login para interagir e marcar eventos no calendário.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Abrir Modal de Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
