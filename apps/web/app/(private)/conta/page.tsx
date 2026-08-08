export default function ContaPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Minha Conta</h1>
      <p className="text-lg text-center max-w-2xl">
        Esta rota é privada e protegida pelo Middleware. Somente usuários autenticados deveriam ver isso.
      </p>
    </div>
  );
}
