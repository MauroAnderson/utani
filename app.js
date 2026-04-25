const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

const numero = "51921891070";

let productos = [];

fetch(url)
  .then(r => r.text())
  .then(data => {
    const filas = parseCSV(data).slice(1);

    filas.forEach(c => {
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

/* CSV robusto */
function parseCSV(text){
  const rows=[]; let current=''; let inside=false; let row=[];
  for(let i=0;i<text.length;i++){
    let c=text[i];
    if(c=='"') inside=!inside;
    else if(c==',' && !inside){ row.push(current); current=''; }
    else if(c=='\n' && !inside){ row.push(current); rows.push(row); row=[]; current=''; }
    else current+=c;
  }
  row.push(current); rows.push(row);
  return rows;
}

/* helpers */
function getCliente(){
  return new URLSearchParams(window.location.search).get("cliente");
}
function num(v){
  let n = Number(v);
  return isNaN(n)?0:n;
}

/* init */
function iniciar(){
  const cliente = getCliente();

  if(!cliente){
    document.getElementById("mensaje").innerHTML =
      "⚠️ Cotización personalizada";
    return;
  }

  const lista = productos.filter(p =>
    p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  document.getElementById("tituloCliente").innerHTML =
    `📄 Cotización para ${cliente}`;

  render(lista);
  renderTotal(lista);
}

/* render */
function render(lista){
  let html="";

  lista.forEach(p=>{
    let imgs = p.imagen.split("|").map(i=>i.trim());
    let img = imgs[0];

    let tieneOferta =
      p.oferta && p.oferta !== "0" && p.oferta !== "" && p.oferta !== p.precio;

    let precioFinal = num(p.oferta || p.precio);

    let mensaje = encodeURIComponent(
      `Hola, me interesa:\n${p.nombre}\nPrecio: S/ ${precioFinal.toFixed(2)}`
    );

    html += `
    <div class="card">
      ${tieneOferta ? `<div class="badge">OFERTA</div>` : ``}

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
            onclick="verDesc('${escapeHtml(p.descripcion)}')">
            ℹ Detalle
          </button>

          ${
            p.obsequio
            ? `<button class="btn gift"
                onclick="verGift('${escapeHtml(p.obsequio)}')">
                🎁 Obsequio
              </button>`
            : ``
          }

          <a class="btn wsp"
             href="https://wa.me/${numero}?text=${mensaje}"
             target="_blank">
             🟢 WhatsApp
          </a>
        </div>
      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML = html;
}

/* total */
function renderTotal(lista){
  let total = lista.reduce((acc,p)=> acc + num(p.oferta || p.precio),0);
  document.getElementById("total").innerHTML =
    `💰 Total: S/ ${total.toFixed(2)}`;
}

/* modal */
function abrirModal(html){
  document.getElementById("contenidoModal").innerHTML = html;
  document.getElementById("modal").style.display="flex";
}
function cerrarModal(){
  document.getElementById("modal").style.display="none";
}

/* multi imagen */
function verImagenes(imgs){
  let lista = imgs.split("|");
  let html = lista.map(i =>
    `<img src="${i.trim()}">`
  ).join("");
  abrirModal(html);
}

/* descripción */
function verDesc(texto){
  let lista = texto.split("|")
    .map(t=>`<li>${t.trim()}</li>`).join("");
  abrirModal(`<ul>${lista}</ul>`);
}

/* obsequio */
function verGift(texto){
  abrirModal(`<p>🎁 ${texto}</p>`);
}

/* seguridad */
function escapeHtml(str){
  return (str||"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}
