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
      <div class="bg-white p-8 shadow w-full max-w-sm space-y-6">
        <h2 class="text-center uppercase tracking-widest text-sm">
          Admin • Marcinha Semijoias
        </h2>
        <input id="senha" type="password" placeholder="Senha"
          class="w-full border-b py-3 outline-none">
        <button onclick="login()"
          class="w-full bg-black text-white py-3 uppercase text-xs">
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

    <main class="max-w-6xl mx-auto p-6 space-y-12">

      <!-- CONFIG -->
      <section class="bg-white p-6 shadow space-y-4">
        <h3 class="uppercase text-xs tracking-widest text-gray-400">
          Configurações da Loja
        </h3>
        <input id="pix" type="number" value="${config.pixDesconto}"
          placeholder="% desconto PIX" class="w-full border-b py-2">
        <input id="parcelas" type="number" value="${config.parcelas}"
          placeholder="Parcelas cartão" class="w-full border-b py-2">
        <button onclick="salvarConfig()"
          class="bg-[#A68966] text-white px-6 py-2 text-xs uppercase">
          Salvar
        </button>
      </section>

      <!-- PRODUTOS -->
      <section class="bg-white p-6 shadow space-y-4">
        <h3 class="uppercase text-xs tracking-widest text-gray-400">
          Produtos / Estoque
        </h3>

        <input id="nome" placeholder="Nome" class="w-full border-b py-2">
        <input id="preco" type="number" placeholder="Preço" class="w-full border-b py-2">
        <input id="estoque" type="number" placeholder="Quantidade em estoque" class="w-full border-b py-2">
        <input id="imagem" type="file" class="w-full">

        <button onclick="adicionarProduto()"
          class="bg-black text-white py-2 text-xs uppercase">
          Adicionar Produto
        </button>

        ${produtos.map((p, i) => `
          <div class="flex justify-between items-center border p-3 text-sm">
            <div>
              <strong>${p.nome}</strong><br>
              R$ ${p.preco.toFixed(2)}<br>
              <span class="${p.estoque === 0 ? 'text-red-500' : 'text-gray-500'}">
                Estoque: ${p.estoque}
              </span>
            </div>
            <div class="space-x-2">
              <button onclick="editarProduto(${i})">✏️</button>
              <button onclick="excluirProduto(${i})">🗑️</button>
            </div>
          </div>
        `).join("")}
      </section>

      <!-- PEDIDOS -->
      <section class="bg-white p-6 shadow space-y-4">
        <h3 class="uppercase text-xs tracking-widest text-gray-400">
          Relatório de Vendas
        </h3>

        ${pedidos.length === 0
          ? `<p class="text-sm text-gray-400">Nenhum pedido</p>`
          : pedidos.map((p, i) => `
            <div class="border p-4 space-y-2 text-sm">
              <strong>${p.cliente}</strong><br>
              ${p.data}<br>
              Total: R$ ${p.total.toFixed(2)}
              <div class="flex gap-2 mt-2">
                <button onclick="whats(${i})" class="border px-3 py-1 text-xs">
                  WhatsApp
                </button>
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
  const estoque = Number(document.getElementById("estoque").value);
  const file = document.getElementById("imagem").files[0];

  if (!nome || !preco || !file || estoque < 0) {
    alert("Preencha todos os campos");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    produtos.push({ nome, preco, estoque, imagem: reader.result });
    salvar();
    dashboard();
  };
  reader.readAsDataURL(file);
}

function editarProduto(i) {
  const nome = prompt("Nome", produtos[i].nome);
  const preco = prompt("Preço", produtos[i].preco);
  const estoque = prompt("Estoque", produtos[i].estoque);

  if (nome && preco && estoque !== null) {
    produtos[i].nome = nome;
    produtos[i].preco = Number(preco);
    produtos[i].estoque = Number(estoque);
    salvar();
    dashboard();
  }
}

function excluirProduto(i) {
  if (confirm("Excluir produto?")) {
    produtos.splice(i, 1);
    salvar();
    dashboard();
  }
}

function whats(i) {
  const p = pedidos[i];

  const itens = p.itens
    .map(it => `• ${it.nome} — R$ ${it.preco.toFixed(2)}`)
    .join("%0A");

  const mensagem =
    `🛍️ *Marcinha Semijoias*%0A%0A` +
    `Olá, *${p.cliente}*! 💖%0A%0A` +
    `📦 *Seu pedido:*%0A${itens}%0A%0A` +
    `💰 *Total:* R$ ${p.total.toFixed(2)}%0A` +
    `%0AObrigada pela preferência ✨`;

  window.open(`https://wa.me/${p.whatsapp}?text=${mensagem}`, "_blank");
}

/* INIT */
localStorage.getItem("adminLogado") ? dashboard() : telaLogin();

