const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

const numero = "51921891070";

let productos = [];
let cargando = false;

/* GALERÍA */
let galeriaImgs = [];
let indexActual = 0;

function getCliente(){
  return new URLSearchParams(window.location.search).get("cliente");
}

function cargarDatos(){
  if(cargando) return;
  cargando = true;

  productos = [];

  fetch(url)
  .then(r=>r.text())
  .then(data=>{
    const filas = data.split("\n").slice(1);

    filas.forEach(c=>{
      let col = c.split(",");
      if(col.length < 8) return;

      productos.push({
        cliente:col[0].trim(),
        nombre:col[2].trim(),
        precio:col[3].trim(),
        oferta:col[4].trim(),
        descripcion:col[5].trim(),
        imagen:col[6].trim(),
        obsequio:col[7].trim()
      });
    });

    iniciar();
    cargando = false;
  });
}

function actualizarPagina(){
  cargarDatos();
}

function num(v){
  let n = Number(v);
  return isNaN(n)?0:n;
}

function iniciar(){
  const cliente = getCliente();

  const lista = productos.filter(p =>
    p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  render(lista);
  renderTotal(lista);
}

/* RENDER */
function render(lista){
  let html = "";

  lista.forEach(p=>{
    let img = p.imagen.split("|")[0].trim();
    let precioFinal = num(p.oferta || p.precio);

    html += `
    <div class="card">

      ${p.oferta && p.oferta !== p.precio ? `<div class="badge">OFERTA</div>` : ''}

      <div class="card-img">
        <img src="${img}" onclick="verImagenes('${p.imagen}')">
      </div>

      <div class="card-body">
        <div class="nombre">${p.nombre}</div>
        <div class="precio">S/ ${precioFinal.toFixed(2)}</div>

        <div class="actions">
          <button class="btn info" onclick="verDesc('${p.descripcion}')">ℹ Detalle</button>
          ${p.obsequio ? `<button class="btn gift">🎁 Obsequio</button>` : ''}
          <a class="btn wsp" href="https://wa.me/${numero}" target="_blank">🟢 WhatsApp</a>
        </div>

      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML = html;
}

/* TOTAL */
function renderTotal(lista){
  let total = lista.reduce((a,p)=>a+num(p.oferta||p.precio),0);
  document.getElementById("total").innerHTML = `Total: S/ ${total.toFixed(2)}`;
}

/* GALERÍA */
function verImagenes(imgs){
  galeriaImgs = imgs.split("|").map(i=>i.trim());
  indexActual = 0;
  mostrarImagen();
}

function mostrarImagen(){
  let html = `
    <img src="${galeriaImgs[indexActual]}">

    <div style="display:flex; justify-content:center; gap:10px; margin-top:10px;">
      <button onclick="anterior()">⬅</button>
      <button onclick="siguiente()">➡</button>
    </div>
  `;

  document.getElementById("contenidoModal").innerHTML = html;
  document.getElementById("modal").style.display = "flex";
}

function siguiente(){
  indexActual = (indexActual + 1) % galeriaImgs.length;
  mostrarImagen();
}

function anterior(){
  indexActual = (indexActual - 1 + galeriaImgs.length) % galeriaImgs.length;
  mostrarImagen();
}

/* DESCRIPCIÓN */
function verDesc(texto){
  let lista = texto.split("|")
    .map(t=>`<div>✔ ${t.trim()}</div>`).join("");

  document.getElementById("contenidoModal").innerHTML = lista;
  document.getElementById("modal").style.display="flex";
}

function cerrarModal(){
  document.getElementById("modal").style.display="none";
}

function enviarCotizacion(){
  alert("Cotización lista");
}

cargarDatos();
