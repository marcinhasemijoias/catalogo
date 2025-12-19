let editIndex = null;

function getProdutos() {
  return JSON.parse(localStorage.getItem("produtos")) || [];
}

function salvarProdutos(produtos) {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function salvarProduto() {
  const sku = document.getElementById("sku").value;
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const desconto = document.getElementById("desconto").value;
  const imagemInput = document.getElementById("imagem");

  if (!sku || !nome || !preco) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  const produtos = getProdutos();

  // 👉 EDIÇÃO
  if (editIndex !== null) {
    produtos[editIndex].sku = sku;
    produtos[editIndex].nome = nome;
    produtos[editIndex].preco = preco;
    produtos[editIndex].desconto = desconto;

    if (imagemInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        produtos[editIndex].imagem = reader.result;
        salvarProdutos(produtos);
        resetForm();
        listarProdutos();
      };
      reader.readAsDataURL(imagemInput.files[0]);
    } else {
      salvarProdutos(produtos);
      resetForm();
      listarProdutos();
    }

    return;
  }

  // 👉 NOVO PRODUTO
  if (imagemInput.files.length === 0) {
    alert("Selecione uma imagem");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    produtos.push({
      sku,
      nome,
      preco,
      desconto,
      imagem: reader.result
    });

    salvarProdutos(produtos);
    resetForm();
    listarProdutos();
  };
  reader.readAsDataURL(imagemInput.files[0]);
}

function editarProduto(index) {
  const produtos = getProdutos();
  const p = produtos[index];

  document.getElementById("sku").value = p.sku;
  document.getElementById("nome").value = p.nome;
  document.getElementById("preco").value = p.preco;
  document.getElementById("desconto").value = p.desconto || "";

  editIndex = index;
}

function excluirProduto(index) {
  if (!confirm("Deseja excluir este produto?")) return;

  const produtos = getProdutos();
  produtos.splice(index, 1);
  salvarProdutos(produtos);
  listarProdutos();
}

function resetForm() {
  document.getElementById("sku").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("desconto").value = "";
  document.getElementById("imagem").value = "";
  editIndex = null;
}

function listarProdutos() {
  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = "";

  const produtos = getProdutos();

  produtos.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <img src="${p.imagem}" style="max-width:100px;display:block;margin-bottom:5px"/>
      <strong>${p.nome}</strong><br>
      SKU: ${p.sku}<br>
      Preço: R$ ${p.preco}<br>
      Desconto: R$ ${p.desconto || "-"}<br><br>
      <button onclick="editarProduto(${index})">✏️ Editar</button>
      <button onclick="excluirProduto(${index})" style="background:#d9534f">🗑️ Excluir</button>
    `;
    lista.appendChild(div);
  });
}

listarProdutos();


