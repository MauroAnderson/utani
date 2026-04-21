const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

let productos = [];
let pagina = 1;
const porPagina = 6;

fetch(url)
.then(res=>res.text())
.then(data=>{
  const filas = data.split("\n").slice(1);

  filas.forEach(fila=>{
    const col = fila.split(",");
    if(col.length<9) return;

    productos.push({
      categoria: col[1],
      nombre: col[2],
      promocion: col[3],
      precio: col[4],
      oferta: col[5],
      descripcion: col[6],
      imagen: col[7],
      obsequio: col[8]
    });
  });

  render();
});

function render(){
  let inicio = (pagina-1)*porPagina;
  let fin = inicio + porPagina;
  let lista = productos.slice(inicio,fin);

  let html="";
  lista.forEach((p,i)=>{
    let imgs = p.imagen.split("|").map(x=>x.trim());

    html+=`
    <div class="card">
      ${p.promocion.trim().toLowerCase()==="no" ? `<div class="badge">OFERTA</div>`:""}
      <img src="${imgs[0]}" onclick="verImagenes('${p.imagen}')">

      <div class="card-body">
        <b>${p.nombre}</b>
        <p class="precio">S/ ${p.precio}</p>

        ${p.promocion.trim().toLowerCase()==="no"
          ? `<button class="btn btn-oferta" onclick="mostrarOferta(${i})">Ver oferta</button>
             <p id="oferta-${i}" class="oferta" style="display:none;">S/ ${p.oferta}</p>`
          : ""}

        <button class="btn btn-info" onclick="verDesc('${p.descripcion}')">Ver detalle</button>

        ${p.obsequio ? `<button class="btn btn-gift" onclick="verGift('${p.obsequio}')">🎁 Obsequio</button>`:""}

        <a class="btn btn-wsp" target="_blank"
        href="https://wa.me/51921891070?text=Hola, quiero cotizar ${p.nombre}">
        Cotizar
        </a>
      </div>
    </div>`;
  });

  document.getElementById("productos").innerHTML=html;
  renderPaginacion();
}

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

function verGift(txt){
  document.getElementById("contenidoGift").innerText=txt;
  abrirModal("modalGift");
}

function abrirModal(id){
  document.getElementById(id).style.display="flex";
}

function cerrarModal(id){
  document.getElementById(id).style.display="none";
}

function mostrarOferta(i){
  document.getElementById("oferta-"+i).style.display="block";
}
