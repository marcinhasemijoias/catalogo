const { useState } = React;

function AdminApp() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState('');

  const PASSWORD = '1234';

  function handleLogin() {
    if (password === PASSWORD) {
      setLogged(true);
    } else {
      alert('Senha incorreta');
    }
  }

  if (!logged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-80">
          <h1 className="text-xl font-bold mb-4 text-center">
            Admin – Marcinha Semijoias
          </h1>

          <input
            type="password"
            placeholder="Senha"
            className="w-full border p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white p-2"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Painel Administrativo
      </h1>

      <p className="text-green-600 font-semibold">
        Login realizado com sucesso ✅
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
