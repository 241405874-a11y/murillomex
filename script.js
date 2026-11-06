let solicitudActual = "";

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const edad = document.getElementById("edad").value;
    const telefono = document.getElementById("telefono").value.trim();
    const domicilio = document.getElementById("domicilio").value.trim();
    const area = document.getElementById("area").value;
    const experiencia = document.getElementById("experiencia").value;
    const horario = document.getElementById("horario").value;
    const comentarios = document.getElementById("comentarios").value.trim();

    if (!nombre || !edad || !telefono || !domicilio ||
        !area || !experiencia || !horario) {

        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    if (Number(edad) < 18 || Number(edad) > 100) {
        alert("La solicitud es para personas mayores de 18 años.");
        return;
    }

    if (!/^[0-9+\s()-]{10,20}$/.test(telefono)) {
        alert("Escribe un número de teléfono válido.");
        return;
    }

    solicitudActual = `
====================================
       MURILLO MÉX
    INVERNADERO DE FRAMBUESA
       SOLICITUD DE EMPLEO
====================================

Nombre completo: ${nombre}

Edad: ${edad}

Teléfono: ${telefono}

Domicilio: ${domicilio}

Área solicitada: ${area}

Experiencia laboral: ${experiencia}

Disponibilidad: ${horario}

Información adicional:
${comentarios}

====================================
       FIN DE LA SOLICITUD
====================================
`;

    const resultado = document.getElementById("resultado");

    resultado.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = "¡Solicitud preparada correctamente!";

    const mensaje = document.createElement("p");
    mensaje.textContent =
        "Gracias, " + nombre +
        ". Puedes descargar tu solicitud para entregarla al encargado.";

    const boton = document.createElement("button");
    boton.textContent = "Descargar solicitud";
    boton.type = "button";
    boton.addEventListener("click", descargarSolicitud);

    resultado.append(titulo, mensaje, boton);

    formulario.reset();

});


// DESCARGAR SOLICITUD

function descargarSolicitud() {

    if (!solicitudActual) {
        alert("Primero debes llenar el formulario.");
        return;
    }

    const archivo = new Blob(
        [solicitudActual],
        { type: "text/plain;charset=utf-8" }
    );

    const enlace = document.createElement("a");

    const url = URL.createObjectURL(archivo);

    enlace.href = url;
    enlace.download = "Solicitud_Murillo_Mex.txt";

    document.body.appendChild(enlace);

    enlace.click();

    enlace.remove();

    URL.revokeObjectURL(url);
}


// GENERAR CODIGO QR

let imagenQR = "";

function generarQR() {

    const url = document.getElementById("urlPagina").value.trim();

    const contenedor = document.getElementById("contenedorQR");

    const botonDescarga = document.getElementById("descargarQR");

    try {

        const direccion = new URL(url);

        if (direccion.protocol !== "https:" &&
            direccion.protocol !== "http:") {

            throw new Error("Dirección incorrecta");
        }

        if (direccion.hostname === "localhost" ||
            direccion.hostname === "127.0.0.1") {

            alert("Primero debes publicar tu página en internet.");
            return;
        }

        const codigo = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="
            + encodeURIComponent(direccion.href);

        const imagen = document.createElement("img");

        imagen.src = codigo;
        imagen.alt = "Código QR de Murillo Méx";

        imagen.onload = function() {

            contenedor.replaceChildren();

            const mensaje = document.createElement("p");

            mensaje.textContent =
                "Escanea este código para ingresar a Murillo Méx.";

            contenedor.append(imagen, mensaje);

            imagenQR = codigo;

            botonDescarga.style.display = "inline-block";
        };

        imagen.onerror = function() {

            alert("No se pudo generar el QR. Intenta nuevamente.");

        };

    } catch (error) {

        alert("Escribe un enlace válido de tu página web.");

    }

}


// DESCARGAR CODIGO QR

async function descargarQR() {

    if (!imagenQR) {
        alert("Primero genera el código QR.");
        return;
    }

    try {

        const respuesta = await fetch(imagenQR);

        if (!respuesta.ok) {
            throw new Error("No se pudo descargar");
        }

        const archivo = await respuesta.blob();

        const url = URL.createObjectURL(archivo);

        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = "QR_Murillo_Mex.png";

        document.body.appendChild(enlace);

        enlace.click();

        enlace.remove();

        URL.revokeObjectURL(url);

    } catch (error) {

        alert("No fue posible descargar el QR. Intenta nuevamente.");

    }

}