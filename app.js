const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxV_Ae4z_UyHXA5cXtTi9Ap5ZNdHJrpEn7p2Dx07iAJBQH814jw4p6tBslh3fsCZhnTTExdVLPLPLK/pub?output=csv";

fetch(url)
  .then(res => res.text())
  .then(data => {
    const filas = data.split("\n").slice(1);

    filas.forEach(fila => {
      const col = fila.split(",");

      const nombre = col[1];
      const precio = col[2];
      const imagen = col[3];

      document.getElementById("productos").innerHTML += `
        <div class="card">
          <img src="${imagen}">
          <h3>${nombre}</h3>
          <p>S/ ${precio}</p>
          <a target="_blank" href="https://wa.me/51999999999?text=Quiero cotizar ${nombre}">
            Cotizar
          </a>
        </div>
      `;
    });
  });