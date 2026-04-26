const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";
const numero = "51921891070";

let productos=[];
let galeriaImgs=[];
let indexActual=0;
let cargando=false;

/* CLIENTE */
function getCliente(){
  return new URLSearchParams(window.location.search).get("cliente");
}

/* CARGA */
function cargarDatos(){
  if(cargando) return;
  cargando=true;

  productos=[];

  fetch(url + "&t=" + Date.now(), { cache: "no-store" })
  .then(r=>r.text())
  .then(data=>{
    const filas=data.split("\n").slice(1);

    filas.forEach(c=>{
      let col = parseCSVLine(c);
      if(col.length<8)return;

      productos.push({
        cliente:col[0].trim(),
        nombre:col[2].trim(),
        precio:col[3].trim(),
        oferta:col[4].trim(),
        descripcion:col[5].trim(),
        imagen:(col[6] || "").replace(/"/g,"").trim(), // 🔥 FIX IMÁGENES
        obsequio:col[7].trim()
      });
    });

    iniciar();
    cargando=false;
  });
}

function actualizarPagina(){ 
  const base = window.location.href.split("?")[0];
  window.location.href = base + "?t=" + Date.now();
}

function num(v){
  let n=Number(v);
  return isNaN(n)?0:n;
}

/* INICIO */
function iniciar(){
  const cliente=getCliente();

  const lista=productos.filter(p =>
    p.cliente.toLowerCase()===cliente.toLowerCase()
  );

  render(lista);
  renderTotal(lista);
}

/* RENDER */
function render(lista){
  let html="";

  lista.forEach(p=>{
    let img=p.imagen.split("|")[0];

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

        ${tieneOferta
        ? `<div class="precio-row">
              <span class="precio-old">S/ ${precioNormal.toFixed(2)}</span>
              <span class="precio-new">S/ ${precioOferta.toFixed(2)}</span>
           </div>`
        : `<div class="precio-row">
              <span class="precio-new">S/ ${precioNormal.toFixed(2)}</span>
           </div>`
      }

        <div class="actions">
          <button class="btn info" onclick="verDesc('${p.descripcion}')">ℹ Detalle</button>

          ${p.obsequio?
            `<button class="btn gift" onclick="verGift('${p.obsequio}')">🎁 Obsequio</button>`
          :''}

          <a class="btn wsp" href="https://wa.me/${numero}?text=${generarMensajeProducto(p)}" target="_blank"> 🟢 WhatsApp </a>
        </div>

      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML=html;
}

/* TOTAL */
function renderTotal(lista){
  let total=lista.reduce((a,p)=>a+num(p.oferta||p.precio),0);
  document.getElementById("total").innerHTML=`Total: S/ ${total.toFixed(2)}`;
}

/* GALERÍA (FIX REAL) */
function verImagenes(imgs){
  galeriaImgs = imgs.split("|").map(i=>i.trim()).filter(i=>i);
  indexActual = 0;

  document.getElementById("contenidoModal").innerHTML=`
    <div class="galeria-container">

      <button class="nav prev" onclick="anterior()">❮</button>

      <img id="imgGaleria">

      <button class="nav next" onclick="siguiente()">❯</button>

    </div>

    <div id="dots" class="galeria-dots"></div>
  `;

  document.getElementById("modal").style.display="flex";

  actualizarGaleria();
  activarSwipe();
}

function actualizarGaleria(){
  document.getElementById("imgGaleria").src = galeriaImgs[indexActual];

  let dots = galeriaImgs.map((_,i)=>
    `<div class="dot ${i===indexActual?'active':''}" onclick="irA(${i})"></div>`
  ).join("");

  document.getElementById("dots").innerHTML = dots;
}

function siguiente(){
  indexActual = (indexActual + 1) % galeriaImgs.length;
  actualizarGaleria();
}

function anterior(){
  indexActual = (indexActual - 1 + galeriaImgs.length) % galeriaImgs.length;
  actualizarGaleria();
}

function irA(i){
  indexActual=i;
  actualizarGaleria();
}

/* SWIPE */
function activarSwipe(){
  const img = document.getElementById("imgGaleria");

  let startX = 0;

  img.addEventListener("touchstart", e=>{
    startX = e.touches[0].clientX;
  });

  img.addEventListener("touchend", e=>{
    let endX = e.changedTouches[0].clientX;

    if(endX < startX - 50) siguiente();
    else if(endX > startX + 50) anterior();
  });
}

/* DETALLE */
function verDesc(texto){
  let lista = texto.split("|")
    .map(t => `<div style="margin-bottom:6px;">✔ ${t.trim()}</div>`)
    .join("");

  document.getElementById("contenidoModal").innerHTML=`
    <div class="modal-detalle">
      <h3>ℹ Detalle</h3>
      ${lista}
    </div>
  `;

  document.getElementById("modal").style.display="flex";
}

/* OBSEQUIO */
function verGift(texto){
  document.getElementById("contenidoModal").innerHTML=`
    <h3>🎁 Obsequio</h3>
    <p>${texto}</p>
  `;
  document.getElementById("modal").style.display="flex";
}

function cerrarModal(){
  document.getElementById("modal").style.display="none";
}

/* CSV */
function parseCSVLine(line){
  const result = [];
  let current = "";
  let insideQuotes = false;

  for(let i=0;i<line.length;i++){
    const char = line[i];

    if(char === '"'){
      insideQuotes = !insideQuotes;
    }
    else if(char === "," && !insideQuotes){
      result.push(current);
      current = "";
    }
    else{
      current += char;
    }
  }

  result.push(current);
  return result;
}

function enviarCotizacion(){
  const cliente = getCliente();

  const lista = productos.filter(p =>
    p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  let mensaje = `Hola, deseo confirmar la cotización:\n\n`;

  let total = 0;

  lista.forEach((p,i)=>{
    let precio = p.oferta && Number(p.oferta) < Number(p.precio)
      ? Number(p.oferta)
      : Number(p.precio);

    total += precio;

    mensaje += `${i+1}. ${p.nombre}\n`;
    mensaje += `   S/ ${precio.toFixed(2)}\n\n`;
  });

  mensaje += `Total: S/ ${total.toFixed(2)}`;

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);
}

function generarMensajeProducto(p){
  let precio = p.oferta && Number(p.oferta) < Number(p.precio)
    ? p.oferta
    : p.precio;

  let mensaje = `Hola, estoy interesado en:\n\n` +
                `${p.nombre}\n` +
                `Precio: S/ ${precio}`;

  return encodeURIComponent(mensaje);
}


cargarDatos();
