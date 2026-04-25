const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

const numero = "51921891070";

let productos=[];

/* OBTENER CLIENTE UNA SOLA VEZ */
function getCliente(){
  return new URLSearchParams(window.location.search).get("cliente");
}

/* CARGAR DATOS */
function cargarDatos(callback){
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

    callback(); // 🔥 importante
  });
}

/* ACTUALIZAR (SIN PERDER CLIENTE) */
function actualizarPagina(){
  const cliente = getCliente();

  cargarDatos(()=>{
    iniciar(cliente);
  });
}

/* INICIAR */
function iniciar(clienteParam){
  const cliente = clienteParam || getCliente();

  if(!cliente){
    document.getElementById("mensaje").innerHTML="Cotización personalizada";
    return;
  }

  const lista = productos.filter(
    p => p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  document.getElementById("tituloCliente").innerHTML =
    `Cotización para ${cliente}`;

  render(lista);
  renderTotal(lista);
}

/* UTIL */
function num(v){
  let n=Number(v);
  return isNaN(n)?0:n;
}

/* RENDER */
function render(lista){
  let html="";

  lista.forEach(p=>{
    let img=p.imagen.split("|")[0];
    let tieneOferta=p.oferta && p.oferta!=="0" && p.oferta!==p.precio;
    let precioFinal=num(p.oferta||p.precio);

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
          ? `<div class="precio-old">S/ ${p.precio}</div>
             <div class="precio">S/ ${precioFinal.toFixed(2)}</div>`
          : `<div class="precio">S/ ${precioFinal.toFixed(2)}</div>`
        }

        <div class="actions">

          <button class="btn secondary"
            onclick="verDesc('${p.descripcion}')">
            ℹ Detalle
          </button>

          ${p.obsequio?`
            <button class="btn gift"
              onclick="verGift('${p.obsequio}')">
              🎁 Obsequio
            </button>
          `:''}

          <a class="btn wsp"
             href="https://wa.me/${numero}?text=${encodeURIComponent(
               `Hola, me interesa ${p.nombre} - S/ ${precioFinal.toFixed(2)}`
             )}"
             target="_blank">
             🟢 WhatsApp
          </a>

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

/* MODAL */
function abrirModal(html){
  document.getElementById("contenidoModal").innerHTML=html;
  document.getElementById("modal").style.display="flex";
}

function cerrarModal(){
  document.getElementById("modal").style.display="none";
}

function verImagenes(imgs){
  let html=imgs.split("|").map(i=>`<img src="${i.trim()}">`).join("");
  abrirModal(html);
}

function verDesc(texto){
  let lista = texto.split("|")
    .map(t => `<div>✔ ${t.trim()}</div>`)
    .join("");

  abrirModal(`<div style="font-size:13px;line-height:1.6">${lista}</div>`);
}

function verGift(t){
  abrirModal(`<p>🎁 ${t}</p>`);
}

/* WHATSAPP FINAL */
function enviarCotizacion(){
  const cliente=getCliente();
  const lista=productos.filter(
    p => p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  let mensaje=`COTIZACIÓN - ${cliente}\n\n`;
  let total=0;

  lista.forEach((p,i)=>{
    let precio=num(p.oferta||p.precio);
    total+=precio;
    mensaje+=`${i+1}. ${p.nombre} - S/ ${precio.toFixed(2)}\n`;
  });

  mensaje+=`\nTOTAL: S/ ${total.toFixed(2)}\nConfirmo compra`;

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,"_blank");
}

/* INICIO */
cargarDatos(()=>{
  iniciar();
});
