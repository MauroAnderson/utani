const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

const numero = "51921891070";

let productos=[];
let galeriaImgs=[];
let indexActual=0;

function getCliente(){
  return new URLSearchParams(window.location.search).get("cliente");
}

function cargarDatos(){
  productos=[];

  fetch(url)
  .then(r=>r.text())
  .then(data=>{
    const filas=data.split("\n").slice(1);

    filas.forEach(c=>{
      let col=c.split(",");
      if(col.length<8)return;

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
  });
}

function actualizarPagina(){ cargarDatos(); }

function num(v){
  let n=Number(v);
  return isNaN(n)?0:n;
}

function iniciar(){
  const cliente=getCliente();

  const lista=productos.filter(p =>
    p.cliente.toLowerCase()===cliente.toLowerCase()
  );

  render(lista);
  renderTotal(lista);
}

function render(lista){
  let html="";

  lista.forEach(p=>{
    let img=p.imagen.split("|")[0].trim();
    let precioNormal=num(p.precio);
    let precioOferta=num(p.oferta || p.precio);
    let tieneOferta = precioOferta < precioNormal;

    html+=`
    <div class="card">

      ${tieneOferta?`<div class="badge">OFERTA</div>`:''}

      <div class="card-img">
        <img src="${img}" onclick="verImagenes('${p.imagen}')">
      </div>

      <div class="card-body">
        <div class="nombre">${p.nombre}</div>

        ${
          tieneOferta
          ? `<div style="text-decoration:line-through; font-size:12px; color:#aaa;">
               S/ ${precioNormal.toFixed(2)}
             </div>
             <div class="precio">S/ ${precioOferta.toFixed(2)}</div>`
          : `<div class="precio">S/ ${precioNormal.toFixed(2)}</div>`
        }

        <div class="actions">

          <button class="btn info"
            onclick="verDesc('${p.descripcion}')">
            ℹ Detalle
          </button>

          ${p.obsequio?
            `<button class="btn gift"
              onclick="verGift('${p.obsequio}')">
              🎁 Obsequio
            </button>`
          :''}

          <a class="btn wsp"
             href="https://wa.me/${numero}"
             target="_blank">
             🟢 WhatsApp
          </a>

        </div>

      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML=html;
}

function renderTotal(lista){
  let total=lista.reduce((a,p)=>a+num(p.oferta||p.precio),0);
  document.getElementById("total").innerHTML=`Total: S/ ${total.toFixed(2)}`;
}

/* GALERÍA */
function verImagenes(imgs){
  galeriaImgs=imgs.split("|").map(i=>i.trim());
  indexActual=0;
  mostrarImagen();
}

function mostrarImagen(){
  let dots=galeriaImgs.map((_,i)=>
    `<div class="dot ${i===indexActual?'active':''}" onclick="irA(${i})"></div>`
  ).join("");

  document.getElementById("contenidoModal").innerHTML=`
    <img src="${galeriaImgs[indexActual]}">
    <div class="galeria-dots">${dots}</div>
  `;

  document.getElementById("modal").style.display="flex";
}

function irA(i){
  indexActual=i;
  mostrarImagen();
}

/* 🔥 DETALLE (CORREGIDO) */
function verDesc(texto){
  let lista=texto.split("|")
    .map(t=>`<div style="margin-bottom:6px;">✔ ${t.trim()}</div>`)
    .join("");

  document.getElementById("contenidoModal").innerHTML=`
    <h3 style="margin-bottom:10px;">ℹ Detalle</h3>
    ${lista}
  `;

  document.getElementById("modal").style.display="flex";
}

/* 🔥 OBSEQUIO (YA CORRECTO) */
function verGift(texto){
  document.getElementById("contenidoModal").innerHTML=`
    <h3 style="margin-bottom:10px;">🎁 Obsequio</h3>
    <p>${texto}</p>
  `;
  document.getElementById("modal").style.display="flex";
}

function cerrarModal(){
  document.getElementById("modal").style.display="none";
}

function enviarCotizacion(){
  alert("Cotización lista");
}

cargarDatos();
