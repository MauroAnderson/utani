const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

const url = "TU_LINK_CSV_AQUI";
const numero = "51921891070";

let productos = [];
let cargando = false;

/* CARGA SEGURA */
function cargarDatos(){
  if(cargando) return;
  cargando = true;

  productos = []; // 🔥 limpia SIEMPRE

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

/* ACTUALIZAR */
function actualizarPagina(){
  cargarDatos();
}

function getCliente(){
  return new URLSearchParams(window.location.search).get("cliente");
}

function num(v){
  let n=Number(v);
  return isNaN(n)?0:n;
}

function iniciar(){
  const cliente = getCliente();

  if(!cliente){
    document.getElementById("mensaje").innerHTML="Sin cliente";
    return;
  }

  const lista = productos.filter(p =>
    p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  render(lista);
}

/* RENDER */
function render(lista){
  let html="";

  lista.forEach(p=>{
    let img=p.imagen.split("|")[0];
    let precio=num(p.oferta||p.precio);

    html+=`
    <div class="card">
      <div class="card-img">
        <img src="${img}">
      </div>

      <div class="card-body">
        <div class="nombre">${p.nombre}</div>
        <div class="precio">S/ ${precio.toFixed(2)}</div>

        <div class="actions">
          <button class="btn secondary" onclick="verDesc('${p.descripcion}')">ℹ</button>
          ${p.obsequio?`<button class="btn gift">🎁</button>`:''}
          <a class="btn wsp" href="https://wa.me/${numero}" target="_blank">🟢</a>
        </div>
      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML = html;
}

/* MODAL */
function verDesc(texto){
  let lista = texto.split("|")
    .map(t => `<div>✔ ${t}</div>`).join("");

  document.getElementById("contenidoModal").innerHTML = lista;
  document.getElementById("modal").style.display="flex";
}

function cerrarModal(){
  document.getElementById("modal").style.display="none";
}

/* INICIO */
cargarDatos();
