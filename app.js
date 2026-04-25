const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

let productos=[];

fetch(url)
.then(r=>r.text())
.then(data=>{
  const filas=data.split("\n").slice(1);

  filas.forEach(f=>{
    let c=f.split(",");
    if(c.length<8) return;

    productos.push({
      cliente:c[0],
      nombre:c[2],
      precio:c[3],
      oferta:c[4],
      descripcion:c[5],
      imagen:c[6],
      obsequio:c[7]||""
    });
  });

  iniciar();
});

/* CLIENTE */
function getCliente(){
  let params = new URLSearchParams(window.location.search);
  return params.get("cliente");
}

/* INICIO */
function iniciar(){
  let cliente = getCliente();

  if(!cliente){
    document.getElementById("mensaje").innerHTML =
      "⚠️ Esta página es una cotización personalizada.<br>Solicita tu link al asesor.";
    return;
  }

  let lista = productos.filter(p =>
    p.cliente.toLowerCase() === cliente.toLowerCase()
  );

  document.getElementById("tituloCliente").innerHTML =
    "🧾 Cotización para <b>"+cliente+"</b>";

  render(lista);
  total(lista);
}

/* RENDER */
function render(lista){
  let html="";

  lista.forEach(p=>{
    html += `
    <div class="card">
      <img src="${p.imagen}">

      <div class="nombre">${p.nombre}</div>

      <div class="precio">S/ ${p.oferta || p.precio}</div>

      <button class="btn" onclick="verDesc('${p.descripcion}')">Detalle</button>

      ${p.obsequio ? `
        <div class="nombre">🎁 ${p.obsequio}</div>
        <div class="precio">S/ 0</div>
      ` : ""}
    </div>`;
  });

  document.getElementById("productos").innerHTML=html;
}

/* TOTAL */
function total(lista){
  let suma = lista.reduce((acc,p)=>{
    return acc + Number(p.oferta || p.precio);
  },0);

  document.getElementById("total").innerHTML =
    "💰 Total: S/ " + suma;
}

/* MODAL */
function verDesc(texto){
  document.getElementById("contenidoModal").innerHTML = texto;
  document.getElementById("modal").style.display="flex";
}

function cerrarModal(){
  document.getElementById("modal").style.display="none";
}
