const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

let productos = [];
let categorias = new Set();

fetch(url)
  .then(res => res.text())
  .then(data => {
    const filas = data.split("\n").slice(1);

    filas.forEach(fila => {
      const col = fila.split(",");

      if(col.length < 8) return;

      let prod = {
        categoria: col[1],
        nombre: col[2],
        promocion: col[3],
        precio: col[4],
        oferta: col[5],
        descripcion: col[6],
        imagen: col[7]
      };

      productos.push(prod);
      categorias.add(prod.categoria);
    });

    renderFiltros();
    renderProductos(productos);
  });

function renderFiltros() {
  let html = `<button class="filtro-btn" onclick="filtrar('all')">Todos</button>`;

  categorias.forEach(cat => {
    html += `<button class="filtro-btn" onclick="filtrar('${cat}')">${cat}</button>`;
  });

  document.getElementById("filtros").innerHTML = html;
}

function filtrar(cat) {
  if (cat === "all") {
    renderProductos(productos);
  } else {
    renderProductos(productos.filter(p => p.categoria === cat));
  }
}

function renderProductos(lista) {
  let html = "";

  lista.forEach((p, i) => {
    html += `
      <div class="card">
        <img src="${p.imagen}" onclick="abrirModal('${p.imagen}')">

        <div class="card-body">
          <b>${p.nombre}</b>
          <p class="precio">S/ ${p.precio}</p>

          ${
            p.promocion.trim().toLowerCase() === "si"
              ? `<button class="btn btn-oferta" onclick="mostrarOferta(${i})">Ver oferta</button>
                 <p id="oferta-${i}" class="oferta" style="display:none;">S/ ${p.oferta}</p>`
              : ""
          }

          <a class="btn btn-wsp" target="_blank"
          href="https://wa.me/51921891070?text=Hola, quiero cotizar ${p.nombre}">
          Cotizar
          </a>
        </div>
      </div>
    `;
  });

  document.getElementById("productos").innerHTML = html;
}

function mostrarOferta(i) {
  document.getElementById("oferta-" + i).style.display = "block";
}

function abrirModal(img) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-img").src = img;
}

document.getElementById("modal").onclick = function() {
  this.style.display = "none";
};
