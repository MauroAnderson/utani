const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";


let productos = [];
let categorias = new Set();
let visibles = 12;

fetch(url)
.then(r=>r.text())
.then(data=>{
  const filas = data.split("\n").slice(1);

  filas.forEach(f=>{
    const c = f.split(",");
    if(c.length<8) return;

    let p = {
      categoria:c[1],
      nombre:c[2],
      promocion:c[3],
      precio:c[4],
      oferta:c[5],
      descripcion:c[6],
      imagen:c[7],
      obsequio:c[8]||""
    };

    productos.push(p);
    categorias.add(p.categoria);
  });

  renderMenu();
  render();
  renderOfertas();
});

/* MENU */
function renderMenu(){
  let html = `<button onclick="filtrar('all')">Todos</button>`;
  categorias.forEach(c=>{
    html+=`<button onclick="filtrar('${c}')">${c}</button>`;
  });
  document.getElementById("menu").innerHTML=html;
}

function toggleMenu(){
  document.getElementById("menu").classList.toggle("active");
}

/* OFERTAS */
function renderOfertas(){
  let html="";
  productos.filter(p=>p.promocion==="no").slice(0,5).forEach(p=>{
    let img=p.imagen.split("|")[0];
    html+=`<div class="oferta-card"><img src="${img}"></div>`;
  });
  document.getElementById("ofertas").innerHTML=html;
}

/* PRODUCTOS */
function render(){
  let html="";
  productos.slice(0,visibles).forEach(p=>{
    let img=p.imagen.split("|")[0];

    html+=`
    <div class="card">
      <img src="${img}" onclick="verImagenes('${p.imagen}')">

      <div class="card-body">
        <b>${p.nombre}</b>

        ${
          p.promocion==="no"
          ? `<div><span class="precio">S/ ${p.precio}</span> <span class="oferta">S/ ${p.oferta}</span></div>`
          : `<div class="oferta">S/ ${p.precio}</div>`
        }

        <div class="btn-group">
          <button class="btn-mini" onclick="verDesc('${p.descripcion}')">Info</button>
          ${p.obsequio?`<button class="btn-gift" onclick="verGift('${p.obsequio}')">🎁</button>`:""}
          <a class="btn-wsp" href="https://wa.me/51921891070?text=${p.nombre}">💬</a>
        </div>
      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML=html;
}

/* BUSCAR */
document.getElementById("buscador").addEventListener("input",e=>{
  let t=e.target.value.toLowerCase();
  renderLista(productos.filter(p=>p.nombre.toLowerCase().includes(t)));
});

function renderLista(lista){
  let html="";
  lista.forEach(p=>{
    let img=p.imagen.split("|")[0];
    html+=`<div class="card"><img src="${img}"><b>${p.nombre}</b></div>`;
  });
  document.getElementById("productos").innerHTML=html;
}

/* MODALES */
function verImagenes(imgs){
  let html="";
  imgs.split("|").forEach(i=>html+=`<img src="${i}" style="width:100%">`);
  document.getElementById("galeria").innerHTML=html;
  abrirModal("modalImg");
}

function verDesc(t){
  document.getElementById("contenidoDesc").innerText=t;
  abrirModal("modalDesc");
}

function verGift(t){
  document.getElementById("contenidoGift").innerText="🎁 "+t;
  abrirModal("modalGift");
}

function abrirModal(id){
  document.getElementById(id).style.display="flex";
}

function cerrarModal(id){
  document.getElementById(id).style.display="none";
}
