let editIndex = null;

/* ===== CONFIGURAÇÕES DA LOJA ===== */
function getConfig() {
  return JSON.parse(localStorage.getItem("configLoja")) || {
    pixDesconto: 0,
    parcelas: 1
  };
}

function salvarConfig() {
  const pixDesconto = Number(document.getElementById("pixDesconto").value || 0);
  const parcelas = Number(document.getElementById("parcelas").value || 1);

  localStorage.setItem(
    "configLoja",
    JSON.stringify({ pixDesconto, parcelas })
  );

  alert("Configurações salvas!");
}

function carregarConfig() {
  const config = getConfig();
  document.getElementById("pixDesconto").value = config.pixDesconto;
  document.getElementById("parcelas").value = config.parcelas;
}

/* ===== PRODUTOS ===== */
function getProdutos() {
  return JSON.parse(localStorage.getItem("produtos")) || [];
}

function salvarProdutos(produtos) {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function salvarProduto() {
  const sku = document.getElementById("sku").value;
  const nome = document.getElementById("nome").value;
  const preco = Number(document.getElementById("preco").value);
  const imagemInput = document.getElementById("imagem");

  if (!sku || !nome || !preco) {
    alert("Preencha todos os campos");
    return;
  }

  const produtos = getProdutos();

  // ✏️ EDITAR
  if (editIndex !== null) {
    produtos[editIndex].sku = sku;
    produtos[editIndex].nome = nome;
    produtos[editIndex].preco = preco;

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

  // ➕ NOVO
  if (imagemInput.files.length === 0) {
    alert("Selecione uma imagem");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    produtos.push({ sku, nome, preco, imagem: reader.result });
    salvarProdutos(produtos);
    resetForm();
    listarProdutos();
  };
  reader.readAsDataURL(imagemInput.files[0]);
}

function editarProduto(index) {
  const p = getProdutos()[index];
  document.getElementById("sku").value = p.sku;
  document.getElementById("nome").value = p.nome;
  document.getElementById("preco").value = p.preco;
  editIndex = index;
}

function excluirProduto(index) {
  if (!confirm("Excluir produto?")) return;
  const produtos = getProdutos();
  produtos.splice(index, 1);
  salvarProdutos(produtos);
  listarProdutos();
}

function resetForm() {
  document.getElementById("sku").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("imagem").value = "";
  editIndex = null;
}

function listarProdutos() {
  const lista = document.getElementById("listaProdutos");
  lista.innerHTML = "";

  getProdutos().forEach((p, i) => {
    lista.innerHTML += `
      <div class="produto">
        <img src="${p.imagem}" style="max-width:100px"/>
        <strong>${p.nome}</strong><br>
        Preço: R$ ${p.preco.toFixed(2)}<br><br>
        <button onclick="editarProduto(${i})">✏️ Editar</button>
        <button onclick="excluirProduto(${i})">🗑️ Excluir</button>
      </div>
    `;
  });
}

carregarConfig();
listarProdutos();


