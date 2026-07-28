
// ==========================================================
// CONFIRMACION DE ORDEN - Servicios Roma
// Genera el número de pedido, muestra el resumen y limpia
// el carrito para que no quede pegado en la próxima visita.
// ==========================================================

const CLAVE_CARRITO = "carritoServiciosRoma";
const CLAVE_PEDIDO = "pedidoServiciosRoma";

// Genera un número de orden simple: fecha compacta + número aleatorio.
// No hay base de datos que lleve un consecutivo real, así que esto
// alcanza para que se vea único en cada compra durante la demo.
function generarNumeroOrden() {
  const ahora = new Date();
  const fechaCompacta =
    ahora.getFullYear().toString() +
    String(ahora.getMonth() + 1).padStart(2, "0") +
    String(ahora.getDate()).padStart(2, "0");
  const aleatorio = Math.floor(1000 + Math.random() * 9000);
  return `SR-${fechaCompacta}-${aleatorio}`;
}

function mostrarConfirmacion() {
  const datos = localStorage.getItem(CLAVE_PEDIDO);

  if (!datos) {
    // Si alguien entra directo a esta página sin haber hecho checkout
    document.querySelector("main").innerHTML =
      "<h1>No encontramos ningún pedido reciente.</h1><p><a href='catalogo.html'>Ver catálogo</a></p>";
    return;
  }

  const pedido = JSON.parse(datos);

  document.getElementById("numero-orden").textContent = "#" + generarNumeroOrden();

  const lista = document.getElementById("lista-confirmacion");
  lista.innerHTML = "";
  pedido.productos.forEach((producto) => {
    const item = document.createElement("li");
    item.textContent = `${producto.nombre} x${producto.cantidad} - L ${(producto.precio * producto.cantidad).toFixed(2)}`;
    lista.appendChild(item);
  });

  document.getElementById("total-confirmacion").textContent = "L " + pedido.total.toFixed(2);

  document.getElementById("nombre-cliente").textContent = "Nombre: " + pedido.cliente.nombre;
  document.getElementById("telefono-cliente").textContent = "Teléfono: " + pedido.cliente.telefono;
  document.getElementById("direccion-cliente").textContent = "Dirección: " + pedido.cliente.direccion;

  // Ya se mostró el resumen: vaciamos el carrito y el pedido temporal
  // para que la próxima compra empiece de cero.
  localStorage.removeItem(CLAVE_CARRITO);
  localStorage.removeItem(CLAVE_PEDIDO);
}

document.addEventListener("DOMContentLoaded", mostrarConfirmacion);