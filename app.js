const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";


let productos = [];

fetch(url)
  .then(r => r.text())
  .then(data => {
    const filas = data.split("\n").slice(1);

    filas.forEach(f => {
      let c = f.split(",");
      if (c.length < 8) return;

      productos.push({
        cliente: (c[0] || "").trim(),
        nombre: (c[2] || "").trim(),
        precio: (c[3] || "").trim(),
        oferta: (c[4] || "").trim(),
        descripcion: (c[5] || "").trim(),
        imagen: (c[6] || "").trim(),
        obsequio: (c[7] || "").trim()
      });
    });

    iniciar();
  });

/* =========================
   Helpers
========================= */
function getCliente(){
  const params = new URLSearchParams(window.location.search);
  return params.get("cliente");
}

function num(v){
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

/* =========================
   Init
========================= */
function iniciar(){
  const cliente = getCliente();

  if(!cliente){
    document.getElementById("mensaje").innerHTML =
      "⚠️ Esta es una cotización personalizada. Solicita tu link al asesor.";
    return;
  }

  const lista = productos.filter(p =>
    p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  document.getElementById("tituloCliente").innerHTML =
    `🧾 Cotización para <b>${cliente}</b>`;

  render(lista);
  renderTotal(lista);
}

/* =========================
   Render
========================= */
function render(lista){
  let html = "";

  lista.forEach(p => {
    const img = (p.imagen.split("|")[0] || "").trim();

    const tieneOferta =
      p.oferta &&
      p.oferta !== "0" &&
      p.oferta !== "" &&
      p.oferta !== p.precio;

    html += `
      <div class="card">
        ${tieneOferta ? `<div class="badge">OFERTA</div>` : ``}

        <div class="card-img">
          <img src="${img}" alt="${p.nombre}"
               onclick="verImagen('${img}')">
        </div>

        <div class="card-body">
          <div class="nombre">${p.nombre}</div>

          ${
            tieneOferta
            ? `<div class="precio-old">S/ ${p.precio}</div>
               <div class="precio">S/ ${p.oferta}</div>`
            : `<div class="precio">S/ ${p.precio}</div>`
          }

          <div class="actions">
            <button class="btn secondary"
                    onclick="verDesc('${escapeHtml(p.descripcion)}')">
              Detalle
            </button>

            ${
              p.obsequio
              ? `<button class="btn gift"
                   onclick="verGift('${escapeHtml(p.obsequio)}')">
                   🎁 Obsequio
                 </button>`
              : ``
            }
          </div>

          ${
            p.obsequio
            ? `<div class="gift-row">🎁 ${p.obsequio} — S/ 0</div>`
            : ``
          }
        </div>
      </div>
    `;
  });

  document.getElementById("productos").innerHTML = html;
}

/* =========================
   Total
========================= */
function renderTotal(lista){
  const suma = lista.reduce((acc, p) => {
    return acc + num(p.oferta || p.precio);
  }, 0);

  document.getElementById("total").innerHTML =
    `💰 Total: S/ ${suma}`;
}

/* =========================
   Modal
========================= */
function abrirModal(html){
  document.getElementById("contenidoModal").innerHTML = html;
  document.getElementById("modal").style.display = "flex";
}

function cerrarModal(){
  document.getElementById("modal").style.display = "none";
}

function verImagen(img){
  abrirModal(`<img src="${img}" style="width:100%; border-radius:10px;">`);
}

function verDesc(texto){
  abrirModal(`<p style="font-size:13px; line-height:1.5;">${texto || "Sin descripción"}</p>`);
}

function verGift(texto){
  abrirModal(`<p style="font-size:13px;">🎁 ${texto}</p>`);
}

/* =========================
   Seguridad básica
========================= */
function escapeHtml(str){
  return (str || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}
