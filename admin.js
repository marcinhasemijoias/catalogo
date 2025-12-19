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
const storage = firebase.storage();

function login() {
  const senha = document.getElementById("senha").value;
  if (senha === "eezz0237") {
    document.getElementById("painel").style.display = "block";
  } else {
    alert("Senha incorreta");
  }
}

function salvarProduto() {
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const file = document.getElementById("imagem").files[0];

  const ref = storage.ref("produtos/" + Date.now());
  ref.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.collection("produtos").add({ nome, preco, imagem: url });
      alert("Produto cadastrado");
      carregarProdutos();
    });
  });
}

function carregarProdutos() {
  const div = document.getElementById("listaAdmin");
  div.innerHTML = "";
  db.collection("produtos").get().then(snap => {
    snap.forEach(doc => {
      const p = doc.data();
      div.innerHTML += `
        <div>
          <img src="${p.imagem}">
          ${p.nome} - R$ ${p.preco}
          <button onclick="excluir('${doc.id}')">Excluir</button>
        </div>
      `;
    });
  });
}

function excluir(id) {
  db.collection("produtos").doc(id).delete();
  carregarProdutos();
}

function carregarPedidos() {
  const div = document.getElementById("listaPedidos");
  div.innerHTML = "";
  db.collection("pedidos").get().then(snap => {
    snap.forEach(doc => {
      const p = doc.data();
      div.innerHTML += `
        <div>
          Total: R$ ${p.total}
          <a href="https://wa.me/55SEUNUMERO" target="_blank">WhatsApp</a>
        </div>
      `;
    });
  });
}

carregarProdutos();
carregarPedidos();
