const { useState } = React;

function AdminApp() {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);

  function handleLogin() {
    if (password === "1234") {
      setLogged(true);
    } else {
      alert("Senha incorreta");
    }
  }

  if (!logged) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow w-80">
          <h1 className="text-xl font-bold mb-4 text-center">
            Admin – Marcinha Semijoias
          </h1>

          <input
            type="password"
            placeholder="Senha"
            className="w-full border p-2 mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Painel Administrativo
      </h1>
      <p className="mt-2 text-gray-600">
        Login realizado com sucesso ✅
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
