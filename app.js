const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";


let productos = [];
let visibles = 12;

fetch(url)
.then(res=>res.text())
.then(data=>{
  const filas = data.split("\n").slice(1);

  filas.forEach(fila=>{
    const col = fila.split(",");
    if(col.length < 8) return;

    productos.push({
      nombre: col[2],
      promocion: col[3],
      precio: col[4],
      oferta: col[5],
      descripcion: col[6],
      imagen: col[7],
      obsequio: col[8] || ""
    });
  });

  render();
});

function render(){
  let lista = productos.slice(0, visibles);

  let html="";
  lista.forEach(p=>{
    let imgs = p.imagen.split("|").map(x=>x.trim());

    html+=`
    <div class="card">
      <img src="${imgs[0]}" onclick="verImagenes('${p.imagen}')">

      <div class="card-body">
        <div class="nombre">${p.nombre}</div>

        ${
          p.promocion.toLowerCase()==="no"
          ? `<div><span class="precio">S/ ${p.precio}</span> <span class="oferta">S/ ${p.oferta}</span></div>`
          : `<div class="oferta">S/ ${p.precio}</div>`
        }

        <div class="btn-group">
          <button class="btn-mini" onclick="verDesc('${p.descripcion}')">Info</button>
          ${p.obsequio ? `<button class="btn-gift" onclick="verGift('${p.obsequio}')">🎁</button>`:""}
          <a class="btn-wsp" target="_blank"
          href="https://wa.me/51921891070?text=Hola, quiero cotizar ${p.nombre}">
          💬
          </a>
        </div>
      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML = html;

  renderLoadMore();
}

function renderLoadMore(){
  if(visibles >= productos.length){
    document.getElementById("loadMore").innerHTML = "";
    return;
  }

  document.getElementById("loadMore").innerHTML =
    `<button onclick="cargarMas()">Ver más productos</button>`;
}

function cargarMas(){
  visibles += 12;
  render();
}

/* BUSCADOR */
document.getElementById("buscador").addEventListener("input", e=>{
  let t = e.target.value.toLowerCase();
  let filtrados = productos.filter(p=>p.nombre.toLowerCase().includes(t));
  renderLista(filtrados);
});

/* MODALES */
function verImagenes(imgs){
  let lista = imgs.split("|").map(x=>x.trim());
  let html="";
  lista.forEach(i=> html+=`<img src="${i}" style="width:100%">`);
  document.getElementById("galeria").innerHTML=html;
  abrirModal("modalImg");
}

function verDesc(txt){
  document.getElementById("contenidoDesc").innerText=txt;
  abrirModal("modalDesc");
}

function verGift(txt){
  document.getElementById("contenidoGift").innerText="🎁 "+txt;
  abrirModal("modalGift");
}

function abrirModal(id){
  document.getElementById(id).style.display="flex";
}

function cerrarModal(id){
  document.getElementById(id).style.display="none";
}
