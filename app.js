const config = JSON.parse(localStorage.getItem("configLoja")) || {
  pixDesconto: 0,
  parcelas: 1
};

let carrinho = [];

function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const container = document.getElementById("produtos");

  container.innerHTML = "";

  produtos.forEach((p, index) => {
    const precoPix = p.preco - (p.preco * config.pixDesconto) / 100;

    container.innerHTML += `
      <div class="produto">
        <img src="${p.imagem}" style="max-width:150px"><br>
        <strong>${p.nome}</strong><br>
        R$ ${p.preco.toFixed(2)}<br>
        <small>PIX: R$ ${precoPix.toFixed(2)}</small><br><br>
        <button onclick="adicionarCarrinho(${index})">
          🛒 Adicionar
        </button>
      </div>
      <hr>
    `;
  });
}

function adicionarCarrinho(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  carrinho.push(produtos[index]);
  renderCarrinho();
}

function renderCarrinho() {
  const div = document.getElementById("carrinho");
  div.innerHTML = "";

  let total = 0;

  carrinho.forEach((p, i) => {
    total += p.preco;
    div.innerHTML += `
      ${p.nome} - R$ ${p.preco.toFixed(2)}
      <button onclick="removerItem(${i})">❌</button><br>
    `;
  });

  div.innerHTML += `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
}

function removerItem(index) {
  carrinho.splice(index, 1);
  renderCarrinho();
}

function finalizarPedido() {
  const nome = document.getElementById("clienteNome").value;
  const whats = document.getElementById("clienteWhats").value;

  if (!nome || !whats || carrinho.length === 0) {
    alert("Preencha os dados e adicione produtos");
    return;
  }

  const total = carrinho.reduce((s, p) => s + p.preco, 0);

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos.push({
    cliente: nome,
    whatsapp: whats,
    itens: carrinho,
    total: total,
    data: new Date().toLocaleString()
  });

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert("Pedido enviado com sucesso!");

  carrinho = [];
  renderCarrinho();

  document.getElementById("clienteNome").value = "";
  document.getElementById("clienteWhats").value = "";
}

carregarProdutos();
