// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD5RdWTYOnaTov7VtM9ZGenUpFYSZVGoPs",
  authDomain: "marcinha-semijoias.firebaseapp.com",
  projectId: "marcinha-semijoias",
  storageBucket: "marcinha-semijoias.firebasestorage.app",
  messagingSenderId: "830107812924",
  appId: "1:830107812924:web:1ee54d9b875514e48eef39"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const listaProdutos = document.getElementById("listaProdutos");
const carrinho = [];

function carregarProdutos() {
  db.collection("produtos").get().then(snapshot => {
    listaProdutos.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      listaProdutos.innerHTML += `
        <div class="produto">
          <img src="${p.imagem}">
          <h3>${p.nome}</h3>
          <p>R$ ${p.preco.toFixed(2)}</p>
          <button onclick='addCarrinho("${doc.id}", "${p.nome}", ${p.preco})'>
            Adicionar
          </button>
        </div>
      `;
    });
  });
}

function addCarrinho(id, nome, preco) {
  carrinho.push({ id, nome, preco });
  renderCarrinho();
}

function renderCarrinho() {
  const ul = document.getElementById("itensCarrinho");
  ul.innerHTML = "";
  let total = 0;

  carrinho.forEach(item => {
    total += item.preco;
    ul.innerHTML += `<li>${item.nome} - R$ ${item.preco.toFixed(2)}</li>`;
  });

  document.getElementById("total").innerText = "Total: R$ " + total.toFixed(2);
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  db.collection("pedidos").add({
    itens: carrinho,
    total: carrinho.reduce((s, i) => s + i.preco, 0),
    data: new Date()
  });

  alert("Pedido enviado com sucesso!");
  carrinho.length = 0;
  renderCarrinho();
}

carregarProdutos();
