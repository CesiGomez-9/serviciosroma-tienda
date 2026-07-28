// ==========================================================
// CHECKOUT - Servicios Roma
// Muestra el resumen del carrito, valida el formulario y
// guarda el pedido para que confirmacion.html lo muestre.
// ==========================================================

const CLAVE_CARRITO = "carritoServiciosRoma";
const CLAVE_PEDIDO = "pedidoServiciosRoma";


// Lee el carrito guardado (mismo formato que usa carrito.js)
function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE_CARRITO);

  return datos ? JSON.parse(datos) : [];
}


// Muestra el resumen del pedido arriba del formulario
function mostrarResumen() {
  const carrito = obtenerCarrito();

  const lista =
      document.getElementById("lista-resumen");

  const totalSpan =
      document.getElementById("total-resumen");

  lista.innerHTML = "";

  let total = 0;


  carrito.forEach((producto) => {
    const subtotal =
        producto.precio * producto.cantidad;

    total += subtotal;

    const item =
        document.createElement("li");

    item.textContent =
        `${producto.nombre} x${producto.cantidad} - L ${subtotal.toFixed(2)}`;

    lista.appendChild(item);
  });


  totalSpan.textContent =
      "L " + total.toFixed(2);


  // Si el carrito está vacío, no tiene sentido dejar hacer checkout
  if (carrito.length === 0) {
    lista.innerHTML =
        "<li>No hay productos en tu carrito.</li>";

    document.getElementById(
        "btn-confirmar-pedido"
    ).disabled = true;
  }
}


// Valida que los campos obligatorios no estén vacíos
function validarFormulario() {
  let esValido = true;

  const campos = [
    "nombre",
    "telefono",
    "direccion"
  ];


  campos.forEach((idCampo) => {
    const campo =
        document.getElementById(idCampo);

    const errorSpan =
        document.getElementById(
            "error-" + idCampo
        );

    errorSpan.textContent = "";


    if (campo.value.trim() === "") {
      errorSpan.textContent =
          "Este campo es obligatorio.";

      esValido = false;
    }
  });


  // Validación simple de teléfono
  // Solo números, espacios y guiones.
  // Mínimo 8 dígitos.
  const telefono =
      document
          .getElementById("telefono")
          .value
          .trim();

  const soloNumeros =
      telefono.replace(/[^0-9]/g, "");


  if (
      telefono !== "" &&
      soloNumeros.length < 8
  ) {
    document
        .getElementById("error-telefono")
        .textContent =
        "Ingresa un teléfono válido (mínimo 8 dígitos).";

    esValido = false;
  }


  return esValido;
}


// Guarda los datos del pedido completo
// cliente + productos + total
// para que confirmacion.html los pueda leer y mostrar.
function guardarPedido() {
  const carrito =
      obtenerCarrito();

  const total =
      carrito.reduce(
          (suma, p) =>
              suma + p.precio * p.cantidad,
          0
      );


  const pedido = {
    cliente: {
      nombre:
          document
              .getElementById("nombre")
              .value
              .trim(),

      telefono:
          document
              .getElementById("telefono")
              .value
              .trim(),

      direccion:
          document
              .getElementById("direccion")
              .value
              .trim(),
    },

    productos: carrito,

    total: total,

    fecha:
        new Date().toISOString(),
  };


  localStorage.setItem(
      CLAVE_PEDIDO,
      JSON.stringify(pedido)
  );
}


// ==========================================================
// SE EJECUTA AL ENVIAR EL FORMULARIO
// ==========================================================

function manejarEnvio(evento) {
  evento.preventDefault();


  if (!validarFormulario()) {
    return;
  }


  /*
    Antes Brian guardaba el pedido y enviaba directamente
    a confirmacion.html.

    Ahora se evita esa redirección porque primero debe
    completarse el pago mediante PayPal Sandbox.
  */

  const mensajePayPal =
      document.getElementById(
          "mensaje-paypal"
      );


  if (mensajePayPal) {
    mensajePayPal.textContent =
        "Datos correctos. Ahora completa el pago mediante PayPal.";
  }


  alert(
      "Tus datos son correctos. Ahora realiza el pago con PayPal Sandbox."
  );
}


// ==========================================================
// CARGA INICIAL
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

      mostrarResumen();

      document
          .getElementById(
              "form-checkout"
          )
          .addEventListener(
              "submit",
              manejarEnvio
          );
    }
);