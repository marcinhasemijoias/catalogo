const SENHA_ADMIN = "eezz0237";

const app = document.getElementById("app");

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let config = JSON.parse(localStorage.getItem("configLoja")) || {
  pixDesconto: 0,
  parcelas: 1
};

function salvar() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  localStorage.setItem("configLoja", JSON.stringify(config));
}

/* ================= LOGIN ================= */
function telaLogin() {
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 shadow-md w-full max-w-sm space-y-6">
        <h2 class="text-center uppercase tracking-widest text-sm">
          Admin • Marcinha Semijoias
        </h2>

        <input id="senha" type="password" placeholder="Senha"
          class="w-full border-b py-3 outline-none">

        <button onclick="login()"
          class="w-full bg-[#2D2926] text-white py-3 uppercase text-xs tracking-widest">
          Entrar
        </button>
      </div>
    </div>
  `;
}

function login() {
  const senha = document.getElementById("senha").value;
  if (senha === SENHA_ADMIN) {
    localStorage.setItem("adminLogado", "1");
    dashboard();
  } else {
    alert("Senha incorreta");
  }
}

/* ================= DASHBOARD ================= */
function dashboard() {
  if (!localStorage.getItem("adminLogado")) {
    telaLogin();
    return;
  }

  app.innerHTML = `
    <header class="bg-white border-b px-6 py-4 flex justify-between">
      <h1 class="uppercase tracking-widest text-sm">Painel Administrativo</h1>
      <button onclick="logout()" class="text-xs text-red-400">Sair</button>
    </header>

    <main class="max-w-5xl mx-auto p-6 space-y-12">

      <!-- CONFIG -->
      <section class="bg-white p-6 shadow space-y-4">
        <h3 class="uppercase text-xs tracking-widest text-gray-400">
          Configurações da Loja
        </h3>

        <input type="number" id="pix"
          placeholder="% desconto no PIX"
          value="${config.pixDesconto}"
          class="w-full border-b py-2">

        <input type="number" id="parcelas"
          placeholder="Parcelas no cartão"
          value="${config.parcelas}"
          class="w-full border-b py-2">

        <button onclick="salvarConfig()"
          class="bg-[#A68966] text-white px-6 py-2 text-xs uppercase tracking-widest">
          Salvar
        </button>
      </section>

      <!-- PRODUTOS -->
      <section class="bg-white p-6 shadow space-y-6">
        <h3 class="uppercase text-xs tracking-widest text-gray-400">
          Produtos
        </h3>

        <input id="nome" placeholder="Nome do produto" class="w-full border-b py-2">
        <input id="preco" type="number" placeholder="Preço" class="w-full border-b py-2">

        <input id="imagem" type="file" class="w-full">

        <button onclick="adicionarProduto()"
          class="bg-black text-white py-2 uppercase text-xs tracking-widest">
          Adicionar Produto
        </button>

        <div class="space-y-3">
          ${produtos.map((p, i) => `
            <div class="flex justify-between items-center border p-3">
              <div>
                <strong>${p.nome}</strong><br>
                R$ ${p.preco.toFixed(2)}
              </div>
              <div class="space-x-2">
                <button onclick="editarProduto(${i})">✏️</button>
                <button onclick="excluirProduto(${i})">🗑️</button>
              </div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- PEDIDOS -->
      <section class="bg-white p-6 shadow space-y-6">
        <h3 class="uppercase text-xs tracking-widest text-gray-400">
          Relatório de Vendas
        </h3>

        ${pedidos.length === 0 ? `<p class="text-sm text-gray-400">Nenhum pedido</p>` :
          pedidos.map((p, i) => `
            <div class="border p-4 space-y-2">
              <strong>${p.cliente}</strong> – ${p.data}<br>
              Total: R$ ${p.total.toFixed(2)}
              <div class="flex gap-2 mt-2">
                <button onclick="pdf(${i})" class="border px-3 py-1 text-xs">PDF</button>
                <button onclick="whats(${i})" class="border px-3 py-1 text-xs">WhatsApp</button>
              </div>
            </div>
          `).join("")
        }
      </section>
    </main>
  `;
}

/* ================= FUNÇÕES ================= */
function logout() {
  localStorage.removeItem("adminLogado");
  telaLogin();
}

function salvarConfig() {
  config.pixDesconto = Number(document.getElementById("pix").value);
  config.parcelas = Number(document.getElementById("parcelas").value);
  salvar();
  alert("Configurações salvas");
}

function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const preco = Number(document.getElementById("preco").value);
  const file = document.getElementById("imagem").files[0];

  if (!nome || !preco || !file) {
    alert("Preencha todos os campos");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    produtos.push({ nome, preco, imagem: reader.result });
    salvar();
    dashboard();
  };
  reader.readAsDataURL(file);
}

function excluirProduto(i) {
  if (confirm("Excluir produto?")) {
    produtos.splice(i, 1);
    salvar();
    dashboard();
  }
}

function editarProduto(i) {
  const p = produtos[i];
  const nome = prompt("Nome", p.nome);
  const preco = prompt("Preço", p.preco);
  if (nome && preco) {
    produtos[i].nome = nome;
    produtos[i].preco = Number(preco);
    salvar();
    dashboard();
  }
}

function pdf(i) {
  const pedido = pedidos[i];
  const div = document.createElement("div");
  div.innerHTML = `
    <h2>Marcinha Semijoias</h2>
    Cliente: ${pedido.cliente}<br>
    Data: ${pedido.data}<br><br>
    Total: R$ ${pedido.total.toFixed(2)}
  `;
  html2pdf().from(div).save(`pedido_${i}.pdf`);
}

function whats(i) {
  const p = pedidos[i];
  const msg = `Olá ${p.cliente}, seu pedido foi registrado! Total R$ ${p.total.toFixed(2)}`;
  window.open(`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(msg)}`);
}

/* INIT */
if (localStorage.getItem("adminLogado")) {
  dashboard();
} else {
  telaLogin();
}
