/* ================= CONFIG ================= */
const WHATS_LOJA = "5511999999999"; // troque pelo WhatsApp da loja

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
    const desconto = (p.preco * config.pixDesconto) / 100;
    const precoPix = p.preco - desconto;

    container.innerHTML += `
      <div class="bg-white p-4 shadow space-y-4">
        <img src="${p.imagem}" class="w-full h-60 object-cover">
        <div>
          <h3 class="text-sm uppercase font-bold">${p.nome}</h3>
          <p class="text-sm">R$ ${p.preco.toFixed(2)}</p>
          ${
            config.pixDesconto > 0
              ? `<p class="text-xs text-green-600">
                   PIX: R$ ${precoPix.toFixed(2)} (${config.pixDesconto}% OFF)
                 </p>`
              : ""
          }
          <p class="text-xs text-gray-400">
            Cartão até ${config.parcelas}x
          </p>
        </div>
        <button onclick="adicionarCarrinho(${index})"
          class="w-full bg-black text-white py-2 text-xs uppercase">
          Adicionar
        </button>
      </div>
    `;
  });
}

/* ================= CARRINHO ================= */
function adicionarCarrinho(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
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
      <div class="flex justify-between items-center border-b py-2">
        <span>${p.nome}</span>
        <span>
          R$ ${p.preco.toFixed(2)}
          <button onclick="removerItem(${i})">❌</button>
        </span>
      </div>
    `;
  });

  div.innerHTML += `
    <div class="font-bold text-right pt-2">
      Total: R$ ${total.toFixed(2)}
    </div>
  `;
}

/* ================= FINALIZAR ================= */
function finalizarPedido() {
  const nome = document.getElementById("clienteNome").value;
  const whats = document.getElementById("clienteWhats").value;

  if (!nome || !whats || carrinho.length === 0) {
    alert("Preencha os dados e adicione produtos");
    return;
  }

  const total = carrinho.reduce((s, p) => s + p.preco, 0);
  const descontoPix = (total * config.pixDesconto) / 100;
  const totalPix = total - descontoPix;

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  const pedido = {
    cliente: nome,
    whatsapp: whats,
    itens: carrinho,
    total,
    totalPix,
    descontoPix,
    data: new Date().toLocaleString()
  };

  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  /* ===== WHATSAPP LOJA ===== */
  const itensMsg = carrinho
    .map(p => `• ${p.nome} — R$ ${p.preco.toFixed(2)}`)
    .join("%0A");

  const mensagem =
    `🛍️ *Marcinha Semijoias*%0A%0A` +
    `👤 *Cliente:* ${nome}%0A` +
    `📦 *Itens:*%0A${itensMsg}%0A%0A` +
    `💰 *Total:* R$ ${total.toFixed(2)}%0A` +
    (config.pixDesconto > 0
      ? `💸 *PIX (${config.pixDesconto}% OFF):* R$ ${totalPix.toFixed(2)}%0A`
      : "") +
    `💳 *Cartão:* até ${config.parcelas}x%0A%0A` +
    `Pedido enviado pelo catálogo online`;

  window.open(
    `https://wa.me/${WHATS_LOJA}?text=${mensagem}`,
    "_blank"
  );

  alert("Pedido enviado com sucesso!");

  carrinho = [];
  renderCarrinho();
  document.getElementById("clienteNome").value = "";
  document.getElementById("clienteWhats").value = "";
}

carregarProdutos();
