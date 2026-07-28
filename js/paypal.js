// ==========================================================
// PAYPAL SANDBOX - SERVICIOS ROMA
// Integración: Ana Díaz
//
// Esta integración utiliza PayPal Sandbox para simular
// una transacción sin utilizar dinero real.
// ==========================================================


// ==========================================================
// CONFIGURACIÓN DE LA SIMULACIÓN
// ==========================================================

/*
  El catálogo de Servicios Roma utiliza precios en lempiras.

  PayPal Sandbox realizará la transacción de prueba en USD.

  Esta tasa se utiliza ÚNICAMENTE para la simulación
  académica del proyecto.

  No debe presentarse como tasa de cambio oficial.
*/

const TASA_CAMBIO_PRUEBA = 25;


// ==========================================================
// OBTENER TOTAL DEL CARRITO
// ==========================================================

function obtenerTotalPaypal() {

    /*
      Reutilizamos la función obtenerCarrito()
      creada originalmente en checkout.js.
    */

    const carrito =
        obtenerCarrito();


    const total =
        carrito.reduce(
            (suma, producto) =>
                suma +
                producto.precio *
                producto.cantidad,
            0
        );


    return total;
}


// ==========================================================
// MOSTRAR MENSAJES DE PAYPAL
// ==========================================================

function mostrarMensajePaypal(mensaje) {

    const contenedor =
        document.getElementById(
            "mensaje-paypal"
        );


    if (contenedor) {
        contenedor.textContent =
            mensaje;
    }
}


// ==========================================================
// COMPROBAR QUE EL SDK DE PAYPAL CARGÓ
// ==========================================================

if (typeof paypal === "undefined") {

    console.error(
        "No fue posible cargar el SDK de PayPal."
    );


    mostrarMensajePaypal(
        "No fue posible cargar PayPal. Verifica el Client ID o tu conexión a Internet."
    );

}


// ==========================================================
// CREAR BOTONES DE PAYPAL
// ==========================================================

else {

    paypal.Buttons({


        // ======================================================
        // AL HACER CLIC EN PAYPAL
        // ======================================================

        onClick: function(data, actions) {

            /*
              Antes de permitir que el cliente abra PayPal,
              verificamos los campos que Brian ya programó.
            */

            if (!validarFormulario()) {

                mostrarMensajePaypal(
                    "Completa correctamente tus datos antes de pagar."
                );


                return actions.reject();
            }


            const carrito =
                obtenerCarrito();


            if (carrito.length === 0) {

                mostrarMensajePaypal(
                    "No hay productos en el carrito."
                );


                return actions.reject();
            }


            mostrarMensajePaypal(
                "Datos verificados. Puedes continuar con PayPal."
            );


            return actions.resolve();
        },


        // ======================================================
        // CREAR LA ORDEN DE PAYPAL
        // ======================================================

        createOrder: function(data, actions) {

            const totalLempiras =
                obtenerTotalPaypal();


            if (totalLempiras <= 0) {

                mostrarMensajePaypal(
                    "El total del pedido no es válido."
                );


                return Promise.reject(
                    new Error(
                        "Total del carrito inválido."
                    )
                );
            }


            // Conversión solamente para PayPal Sandbox.
            const totalUSD =
                (
                    totalLempiras /
                    TASA_CAMBIO_PRUEBA
                ).toFixed(2);


            console.log(
                "Total del pedido:",
                totalLempiras,
                "L"
            );


            console.log(
                "Total enviado a PayPal Sandbox:",
                totalUSD,
                "USD"
            );


            /*
              createOrder prepara la transacción
              que verá el comprador en PayPal.
            */

            return actions.order.create({

                purchase_units: [
                    {
                        description:
                            "Compra en Servicios Roma",

                        amount: {
                            currency_code:
                                "USD",

                            value:
                            totalUSD
                        }
                    }
                ]

            });
        },


        // ======================================================
        // PAGO APROBADO
        // ======================================================

        onApprove: function(data, actions) {

            mostrarMensajePaypal(
                "Pago aprobado. Confirmando transacción..."
            );


            /*
              capture() confirma la transacción
              después de que el comprador la aprueba.
            */

            return actions.order
                .capture()
                .then(function(detalles) {


                    console.log(
                        "Pago aprobado:",
                        detalles
                    );


                    /*
                      Guardamos el pedido utilizando la función
                      que Brian ya tenía programada.
                    */

                    guardarPedido();


                    // Guardar información básica de PayPal.
                    const transaccion = {

                        orderID:
                        data.orderID,

                        payerID:
                            data.payerID || "",

                        estado:
                        detalles.status,

                        fecha:
                            new Date()
                                .toISOString()

                    };


                    localStorage.setItem(
                        "paypalTransaccionServiciosRoma",
                        JSON.stringify(transaccion)
                    );


                    mostrarMensajePaypal(
                        "Pago realizado correctamente. Redirigiendo a la confirmación..."
                    );


                    /*
                      IMPORTANTE:

                      No eliminamos todavía el carrito.

                      Esto evita afectar a confirmacion.html
                      en caso de que esa página todavía utilice
                      la información del carrito.

                      Después podemos revisar confirmacion.js
                      y decidir cuándo vaciarlo.
                    */


                    setTimeout(
                        function() {

                            window.location.href =
                                "confirmacion.html";

                        },
                        800
                    );

                });
        },


        // ======================================================
        // CLIENTE CANCELA EL PAGO
        // ======================================================

        onCancel: function(data) {

            console.log(
                "Pago cancelado:",
                data
            );


            mostrarMensajePaypal(
                "El pago fue cancelado. Puedes intentarlo nuevamente."
            );

        },


        // ======================================================
        // ERROR DE PAYPAL
        // ======================================================

        onError: function(error) {

            console.error(
                "Error de PayPal:",
                error
            );


            mostrarMensajePaypal(
                "Ocurrió un error al procesar el pago con PayPal Sandbox."
            );

        }


    }).render(
        "#paypal-button-container"
    );

}