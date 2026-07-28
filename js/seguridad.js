// ==========================================================
// SEGURIDAD HTTPS - SERVICIOS ROMA
// Responsable: Ana Díaz
//
// Verifica que el sitio publicado utilice HTTPS.
// En localhost no realiza redirección para permitir
// las pruebas durante el desarrollo.
// ==========================================================

(function verificarHTTPS() {

    const esLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    // Durante el desarrollo local no forzamos HTTPS.
    if (esLocal) {
        console.log(
            "Modo local: la verificación HTTPS se realizará al publicar el sitio."
        );
        return;
    }

    // Si el sitio publicado entra mediante HTTP,
    // redirige automáticamente a HTTPS.
    if (window.location.protocol !== "https:") {

        const urlSegura =
            "https://" +
            window.location.host +
            window.location.pathname +
            window.location.search +
            window.location.hash;

        window.location.replace(urlSegura);
        return;
    }

    console.log(
        "Conexión segura HTTPS verificada correctamente."
    );

})();