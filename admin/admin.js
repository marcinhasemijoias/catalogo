const { useState, useEffect } = React;

function Admin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  }, []);

  const add = () => {
    if (!name || !price) return alert("Preencha tudo");

    const updated = [
      ...products,
      { id: Date.now(), name, price: Number(price) }
    ];

    localStorage.setItem("products", JSON.stringify(updated));
    setProducts(updated);
    setName(""); setPrice("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl">Admin – Marcinha Semijoias</h1>

      <input className="border p-2 w-full" placeholder="Produto"
        value={name} onChange={e => setName(e.target.value)} />

      <input className="border p-2 w-full" placeholder="Preço"
        value={price} onChange={e => setPrice(e.target.value)} />

      <button className="bg-black text-white px-4 py-2" onClick={add}>
        Adicionar Produto
      </button>

      <hr />

      {products.map(p => (
        <p key={p.id}>{p.name} – R$ {p.price.toFixed(2)}</p>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Admin />);
