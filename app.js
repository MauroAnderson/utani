const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

fetch(url)
  .then(res => res.text())
  .then(data => {
    const filas = data.split("\n").slice(1);

    filas.forEach((fila, index) => {
      const col = fila.split(",");

      const nombre = col[1];
      const promocion = col[2];
      const precio = col[3];
      const precioOferta = col[4];
      const descripcion = col[5];
      const imagen = col[6];

      document.getElementById("productos").innerHTML += `
        <div class="card">
          <img src="${imagen}" onclick="abrirModal('${imagen}')">

          <div class="card-body">
            <h3>${nombre}</h3>
            <p>${descripcion}</p>

            <p class="precio">S/ ${precio}</p>

            ${
              promocion === "si"
              ? `<button class="btn btn-oferta" onclick="mostrarOferta(${index})">Ver oferta</button>
                 <p id="oferta-${index}" class="oferta" style="display:none;">S/ ${precioOferta}</p>`
              : ""
            }

            <a class="btn" target="_blank"
              href="https://wa.me/51999999999?text=Quiero cotizar ${nombre}">
              Cotizar
            </a>
          </div>
        </div>
      `;
    });
  });

function mostrarOferta(i) {
  document.getElementById("oferta-" + i).style.display = "block";
}

function abrirModal(img) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-img").src = img;
}

document.getElementById("modal").onclick = function() {
  this.style.display = "none";
};
