function getProdutos() {
  return JSON.parse(localStorage.getItem("produtos")) || [];
}

function salvarProduto() {
  const sku = document.getElementById("sku").value;
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const desconto = document.getElementById("desconto").value;

  if (!sku || !nome || !preco) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  const produtos = getProdutos();

  produtos.push({
    sku,
    nome,
    preco,
    desconto
  });

  localStorage.setItem("produtos", JSON.stringify(produtos));

  document.getElementById("sku").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("desconto").value = "";

  listarProdutos();
}

function listarProdutos() {
  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = "";

  const produtos = getProdutos();

  produtos.forEach(p => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <strong>${p.nome}</strong><br>
      SKU: ${p.sku}<br>
      Preço: R$ ${p.preco}<br>
      Desconto: R$ ${p.desconto || "-"}
    `;
    lista.appendChild(div);
  });
}

listarProdutos();

