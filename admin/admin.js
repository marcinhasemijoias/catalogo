function getProdutos() {
  return JSON.parse(localStorage.getItem("produtos")) || [];
}

function salvarProduto() {
  const sku = document.getElementById("sku").value;
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const desconto = document.getElementById("desconto").value;
  const imagemInput = document.getElementById("imagem");

  if (!sku || !nome || !preco || imagemInput.files.length === 0) {
    alert("Preencha todos os campos obrigatórios e selecione uma imagem");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const produtos = getProdutos();

    produtos.push({
      sku,
      nome,
      preco,
      desconto,
      imagem: reader.result // Base64
    });

    localStorage.setItem("produtos", JSON.stringify(produtos));

    document.getElementById("sku").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("desconto").value = "";
    document.getElementById("imagem").value = "";

    listarProdutos();
  };

  reader.readAsDataURL(imagemInput.files[0]);
}

function listarProdutos() {
  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = "";

  const produtos = getProdutos();

  produtos.forEach(p => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <img src="${p.imagem}" style="max-width:100px;display:block;margin-bottom:5px"/>
      <strong>${p.nome}</strong><br>
      SKU: ${p.sku}<br>
      Preço: R$ ${p.preco}<br>
      Desconto: R$ ${p.desconto || "-"}
    `;
    lista.appendChild(div);
  });
}

listarProdutos();

