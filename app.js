const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";


let productos = [];
let categorias = new Set();
let pagina = 1;
const porPagina = 6;

fetch(url)
.then(res=>res.text())
.then(data=>{
  const filas = data.split("\n").slice(1);

  filas.forEach(fila=>{
    const col = fila.split(",");
    if(col.length < 8) return;

    let prod = {
      categoria: col[1],
      nombre: col[2],
      promocion: col[3],
      precio: col[4],
      oferta: col[5],
      descripcion: col[6],
      imagen: col[7]
    };

    productos.push(prod);
    categorias.add(prod.categoria);
  });

  renderCategorias();
  render();
});

/* CATEGORÍAS */
function renderCategorias(){
  let html = `<button class="filtro-btn" onclick="filtrar('all')">Todos</button>`;
  categorias.forEach(c=>{
    html += `<button class="filtro-btn" onclick="filtrar('${c}')">${c}</button>`;
  });
  document.getElementById("filtros").innerHTML = html;
}

function filtrar(cat){
  if(cat==="all") render();
  else renderLista(productos.filter(p=>p.categoria===cat));
}

/* BUSCADOR */
document.getElementById("buscador").addEventListener("input", e=>{
  let t = e.target.value.toLowerCase();
  renderLista(productos.filter(p=>p.nombre.toLowerCase().includes(t)));
});

/* RENDER */
function render(){
  let inicio = (pagina-1)*porPagina;
  renderLista(productos.slice(inicio,inicio+porPagina));
  renderPaginacion();
}

function renderLista(lista){
  let html="";
  lista.forEach((p,i)=>{
    let imgs = p.imagen.split("|").map(x=>x.trim());

    html+=`
    <div class="card">
      ${p.promocion.toLowerCase()==="no" ? `<div class="badge">OFERTA</div>`:""}

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

          <a class="btn-wsp" target="_blank"
          href="https://wa.me/51921891070?text=Hola, quiero cotizar ${p.nombre}">
          💬
          </a>
        </div>
      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML=html;
}

/* PAGINACIÓN */
function renderPaginacion(){
  let total = Math.ceil(productos.length/porPagina);
  let html="";
  for(let i=1;i<=total;i++){
    html+=`<button onclick="cambiarPagina(${i})">${i}</button>`;
  }
  document.getElementById("paginacion").innerHTML=html;
}

function cambiarPagina(p){
  pagina=p;
  render();
}

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

function abrirModal(id){
  document.getElementById(id).style.display="flex";
}

function cerrarModal(id){
  document.getElementById(id).style.display="none";
}
