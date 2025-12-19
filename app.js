const { useState, useEffect, useMemo } = React;

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  }, []);

  const total = useMemo(
    () => cart.reduce((a, i) => a + i.price * i.qty, 0),
    [cart]
  );

  const addToCart = p => {
    setCart(prev => {
      const e = prev.find(i => i.id === p.id);
      return e
        ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...p, qty: 1 }];
    });
  };

  const finalize = () => {
    if (!customer.name || !customer.phone) {
      alert("Preencha nome e WhatsApp");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const order = {
      id: Date.now(),
      customer,
      items: cart,
      total,
      date: new Date().toLocaleString("pt-BR")
    };

    localStorage.setItem("orders", JSON.stringify([order, ...orders]));
    setCart([]);

    const msg = `Olá, sou ${customer.name} e fiz um pedido na Marcinha Semijoias.%0ATotal: R$ ${total.toFixed(2)}`;
    window.open(`https://wa.me/55SEUNUMEROAQUI?text=${msg}`, "_blank");
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-center text-2xl tracking-widest">MARCINHA SEMIJOIAS</h1>

      {products.length === 0 && (
        <p className="text-center text-gray-400">Catálogo vazio</p>
      )}

      {products.map(p => (
        <div key={p.id} className="bg-white p-4 shadow">
          <p className="font-bold">{p.name}</p>
          <p>R$ {p.price.toFixed(2)}</p>
          <button
            className="mt-2 bg-black text-white px-4 py-2"
            onClick={() => addToCart(p)}
          >
            Adicionar
          </button>
        </div>
      ))}

      <hr />

      <h2 className="text-lg">Sacola</h2>
      {cart.map(i => (
        <p key={i.id}>{i.qty}x {i.name}</p>
      ))}

      <input className="border p-2 w-full" placeholder="Seu nome"
        onChange={e => setCustomer({...customer, name:e.target.value})}
      />
      <input className="border p-2 w-full" placeholder="Seu WhatsApp"
        onChange={e => setCustomer({...customer, phone:e.target.value})}
      />

      <button className="w-full bg-[#A68966] text-white py-3" onClick={finalize}>
        Finalizar Pedido
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
