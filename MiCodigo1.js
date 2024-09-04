<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Efecto de Escritura</title>
    <style>
        .efecto-escritura {
            font-family: monospace;
            font-size: 1.5rem;
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
            width: 100%;
            animation: escribir 5s steps(50, end) forwards;
        }

        @keyframes escribir {
            from { width: 0; }
            to { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="efecto-escritura">
        ¡Bienvenido a este curso! En los próximos meses, aprenderemos sobre tecnología y su impacto en nuestras vidas. Exploraremos programación, robótica, impresión 3D y mucho más.
    </div>
</body>
</html>
