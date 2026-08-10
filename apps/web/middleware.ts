import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Definição das rotas privadas (pode usar regex ou match exato)
const privateRoutes = ['/conta', '/configuracoes', '/privacidade'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verifica se a rota acessada é privada
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute) {
    // Busca o cookie de autenticação
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      // Se não houver token, redireciona para a raiz (home)
      // Onde um modal de login pode ser acionado, se necessário.
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Deixa prosseguir normalmente se for pública ou tiver sessão
  return NextResponse.next();
}

export const config = {
  // Configuração para interceptar apenas rotas de páginas e ignorar estáticos, imagens e API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
