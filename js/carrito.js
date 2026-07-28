
// ==========================================================
// CARRITO DE COMPRAS - Servicios Roma
// Guarda el carrito en localStorage del navegador (no hay
// base de datos porque el sitio es estático en GitHub Pages)
// ==========================================================

const CLAVE_CARRITO = "carritoServiciosRoma";

// Lee el carrito guardado en localStorage. Si no hay nada, devuelve un arreglo vacío.
function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE_CARRITO);
  return datos ? JSON.parse(datos) : [];
}

// Guarda el carrito actualizado en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Dibuja el carrito completo en la tabla del HTML
function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const cuerpoTabla = document.getElementById("cuerpo-carrito");
  const mensajeVacio = document.getElementById("mensaje-vacio");
  const tabla = document.getElementById("tabla-carrito");

  cuerpoTabla.innerHTML = "";

  if (carrito.length === 0) {
    tabla.style.display = "none";
    mensajeVacio.style.display = "block";
    document.getElementById("total-carrito").textContent = "L 0.00";
    return;
  }

  tabla.style.display = "table";
  mensajeVacio.style.display = "none";

  carrito.forEach((producto) => {
    const subtotal = producto.precio * producto.cantidad;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>L ${producto.precio.toFixed(2)}</td>
      <td>
        <button onclick="cambiarCantidad('${producto.id}', -1)">−</button>
        <span>${producto.cantidad}</span>
        <button onclick="cambiarCantidad('${producto.id}', 1)">+</button>
      </td>
      <td>L ${subtotal.toFixed(2)}</td>
      <td><button onclick="eliminarProducto('${producto.id}')">Eliminar</button></td>
    `;
    cuerpoTabla.appendChild(fila);
  });

  calcularTotal();
}

// Aumenta o disminuye la cantidad de un producto (cambio = 1 o -1)
function cambiarCantidad(idProducto, cambio) {
  const carrito = obtenerCarrito();
  const producto = carrito.find((p) => p.id === idProducto);

  if (!producto) return;

  producto.cantidad += cambio;

  // Si la cantidad llega a 0, se elimina el producto del carrito
  if (producto.cantidad <= 0) {
    eliminarProducto(idProducto);
    return;
  }

  guardarCarrito(carrito);
  renderizarCarrito();
}

// Quita un producto por completo del carrito
function eliminarProducto(idProducto) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((p) => p.id !== idProducto);
  guardarCarrito(carrito);
  renderizarCarrito();
}

// Suma todos los subtotales y actualiza el total en pantalla
function calcularTotal() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((suma, p) => suma + p.precio * p.cantidad, 0);
  document.getElementById("total-carrito").textContent = "L " + total.toFixed(2);
}

// Al cargar la página, dibuja el carrito con lo que ya esté guardado
document.addEventListener("DOMContentLoaded", renderizarCarrito);