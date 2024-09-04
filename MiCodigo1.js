// Función para escribir texto con efecto de máquina de escribir
function escribirTexto(elemento, texto, velocidad) {
    let index = 0;
    function agregarLetra() {
        if (index < texto.length) {
            elemento.innerHTML += texto.charAt(index);
            index++;
            setTimeout(agregarLetra, velocidad);
        }
    }
    agregarLetra();
}

// Cuando la página cargue, ejecuta el efecto en el elemento con id 'textoMaquina'
document.addEventListener('DOMContentLoaded', function () {
    const texto = "¡Bienvenido a este curso! \n\nEn los próximos meses, aprenderemos sobre tecnología y su impacto en nuestras vidas. Exploraremos programación, robótica, impresión 3D y más.";
    const elemento = document.getElementById('textoMaquina');
    if (elemento) {
        escribirTexto(elemento, texto, 100);  // Velocidad de escritura: 100 ms
    }
});
