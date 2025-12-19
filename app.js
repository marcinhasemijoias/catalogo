function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const container = document.getElementById("produtos");

  if (produtos.length === 0) {
    container.innerHTML = "<p>Nenhum produto disponível.</p>";
    return;
  }

  produtos.forEach(p => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <img src="${p.imagem}" style="max-width:150px;display:block;margin-bottom:5px"/>
      <strong>${p.nome}</strong><br>
      Preço: R$ ${p.desconto || p.preco}
    `;
    container.appendChild(div);
  });
}

carregarProdutos();
