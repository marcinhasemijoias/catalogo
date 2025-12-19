const WHATS_LOJA = "5511999999999";

const config = JSON.parse(localStorage.getItem("configLoja")) || {
  pixDesconto: 0,
  parcelas: 1
};

let carrinho = [];

/* ================= PRODUTOS ================= */
function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  produtos.forEach((p, index) => {
    const esgotado = p.estoque === 0;

    container.innerHTML += `
      <div class="bg-white p-4 shadow space-y-4 ${esgotado ? 'opacity-50' : ''}">
        <img src="${p.imagem}" class="w-full h-60 object-cover">
        <div>
          <h3 class="text-sm uppercase font-bold">${p.nome}</h3>
          <p class="text-sm">R$ ${p.preco.toFixed(2)}</p>
          <p class="text-xs text-gray-400">Estoque: ${p.estoque}</p>
        </div>
        <button
          onclick="adicionarCarrinho(${index})"
          ${esgotado ? "disabled" : ""}
          class="w-full ${esgotado ? 'bg-gray-300' : 'bg-black text-white'} py-2 text-xs uppercase">
          ${esgotado ? 'Esgotado' : 'Adicionar'}
        </button>
      </div>
    `;
  });
}

/* ================= CARRINHO ================= */
function adicionarCarrinho(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  if (produtos[index].estoque === 0) {
    alert("Produto esgotado");
    return;
  }

  carrinho.push(produtos[index]);
  renderCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  renderCarrinho();
}

function renderCarrinho() {
  const div = document.getElementById("carrinho");
  div.innerHTML = "";

  let total = 0;

  carrinho.forEach((p, i) => {
    total += p.preco;
    div.innerHTML += `
      <div class="flex justify-between border-b py-2">
        <span>${p.nome}</span>
        <span>
          R$ ${p.preco.toFixed(2)}
          <button onclick="removerItem(${i})">❌</button>
        </span>
      </div>
    `;
  });

  div.innerHTML += `<div class="font-bold text-right pt-2">
    Total: R$ ${total.toFixed(2)}
  </div>`;
}

/* ================= FINALIZAR ================= */
function finalizarPedido() {
  const nome = document.getElementById("clienteNome").value;
  const whats = document.getElementById("clienteWhats").value;

  if (!nome || !whats || carrinho.length === 0) {
    alert("Preencha os dados e adicione produtos");
    return;
  }

  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  carrinho.forEach(item => {
    const prod = produtos.find(p => p.nome === item.nome);
    if (prod) prod.estoque--;
  });

  localStorage.setItem("produtos", JSON.stringify(produtos));

  const total = carrinho.reduce((s, p) => s + p.preco, 0);

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push({
    cliente: nome,
    whatsapp: whats,
    itens: carrinho,
    total,
    data: new Date().toLocaleString()
  });

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  const itensMsg = carrinho
    .map(p => `• ${p.nome} — R$ ${p.preco.toFixed(2)}`)
    .join("%0A");

  const mensagem =
    `🛍️ *Marcinha Semijoias*%0A%0A` +
    `👤 Cliente: ${nome}%0A%0A` +
    `📦 Itens:%0A${itensMsg}%0A%0A` +
    `💰 Total: R$ ${total.toFixed(2)}`;

  window.open(`https://wa.me/${WHATS_LOJA}?text=${mensagem}`, "_blank");

  carrinho = [];
  renderCarrinho();
  carregarProdutos();
}

/* INIT */
carregarProdutos();

