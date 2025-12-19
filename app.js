const config = JSON.parse(localStorage.getItem("configLoja")) || {
  pixDesconto: 0,
  parcelas: 1
};

function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const container = document.getElementById("produtos");

  produtos.forEach(p => {
    const precoPix =
      p.preco - (p.preco * config.pixDesconto) / 100;

    const valorParcela =
      p.preco / config.parcelas;

    container.innerHTML += `
      <div class="produto">
        <img src="${p.imagem}" style="max-width:150px"/><br>
        <strong>${p.nome}</strong><br>
        R$ ${p.preco.toFixed(2)}<br>
        <small>
          PIX: R$ ${precoPix.toFixed(2)} (${config.pixDesconto}% OFF)<br>
          Cartão: ${config.parcelas}x de R$ ${valorParcela.toFixed(2)}
        </small>
      </div>
    `;
  });
}

carregarProdutos();
