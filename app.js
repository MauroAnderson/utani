const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

fetch(url)
  .then(res => res.text())
  .then(data => {
    const filas = data.split("\n").slice(1);

    filas.forEach(fila => {
      const col = fila.split(",");

      const nombre = col[1];
      const precio = col[3];
      const precioOferta = col[4];
      const descripcion = col[5];
      const imagen = col[6];

      document.getElementById("productos").innerHTML += `
        <div class="card">
          <img src="${imagen}" width="200">
          <h3>${nombre}</h3>
          <p>${descripcion}</p>
          <p><del>S/ ${precio}</del> <b>S/ ${precioOferta}</b></p>
          <a target="_blank" href="https://wa.me/51999999999?text=Quiero cotizar ${nombre}">
            Cotizar
          </a>
        </div>
      `;
    });
  });
