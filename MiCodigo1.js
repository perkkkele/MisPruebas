const imagenReferenciaXXXXX = document.getElementById("imagenReferenciaXXXXX");
const fraseXXXXX = "¡Bienvenido a este curso! \n\nEn los próximos meses descubriremos algunos secretos del fascinante mundo de la tecnología y cómo influye en nuestras vidas diarias. Exploraremos desde la programación y el diseño de algoritmos hasta la robótica, la impresión 3D y más. Estudiaremos diferentes herramientas, potenciaremos nuestra capacidad de pensar de forma estructurada y lógica, fomentando el pensamiento crítico y la resolución de problemas.\n\nPrepárate para los desafíos, la innovación y la posibilidad de crear soluciones que impacten en nuestro entorno. ¡El futuro está en tus manos!";

function escribirXXXXX(frase, fraseElemento) {
    let iXXXXX = 0;
    fraseElemento.innerHTML = "";

    function agregarCaracterXXXXX() {
        if (iXXXXX < frase.length) {
            fraseElemento.innerHTML += frase.charAt(iXXXXX);
            iXXXXX++;
            setTimeout(agregarCaracterXXXXX, 50);
        }
    }

    agregarCaracterXXXXX();
}

const opcionesObservadorXXXXX = {
    rootMargin: "0px",
    threshold: 0.5
};

const observerXXXXX = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            escribirXXXXX(fraseXXXXX, document.getElementById("fraseXXXXX"));
            observerXXXXX.unobserve(imagenReferenciaXXXXX);
        } else {
            document.getElementById("fraseXXXXX").innerHTML = "";
        }
    });
}, opcionesObservadorXXXXX);

observerXXXXX.observe(imagenReferenciaXXXXX);
