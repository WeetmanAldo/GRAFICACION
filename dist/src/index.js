import { CanvasLocal } from './canvasLocal.js';
let canvas;
let graphics;
let miCanvas;
/**
 * Evento principal que se dispara cuando la ventana del navegador ha terminado de cargar.
 * Se encarga de inicializar el canvas, instanciar nuestra clase CanvasLocal,
 * buscar los elementos HTML y agregar los eventos de interacción.
 */
window.onload = () => {
    canvas = document.getElementById('circlechart');
    graphics = canvas.getContext('2d');
    miCanvas = new CanvasLocal(graphics, canvas);
    // Elements
    const btnGraph = document.getElementById('btnGraph');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const functionInput = document.getElementById('functionInput');
    /**
     * Función delegada responsable de ordenar limpiar el canvas,
     * dibujar la cuadrícula, los ejes, y finalmente leer y evaluar la función ingresada.
     */
    const drawCurrentFunction = () => {
        miCanvas.clear();
        miCanvas.drawGrid();
        miCanvas.drawAxes();
        try {
            // Construct a function evaluator using javascript's Math properties 
            const expression = functionInput.value;
            // Use 'with(Math)' to allow user to write 'sin(x)' or 'Math.sin(x)' freely.
            const func = new Function("x", `with(Math){ return ${expression}; }`);
            miCanvas.drawFunction(func, 'red');
        }
        catch (e) {
            console.error("Expresión matemática inválida.", e);
        }
    };
    // Evento al dar clic en el botón "Graficar"
    btnGraph.addEventListener('click', drawCurrentFunction);
    // Evento al dar clic en el botón "Acercar (+)"
    btnZoomIn.addEventListener('click', () => {
        miCanvas.zoomIn();
        drawCurrentFunction();
    });
    // Evento al dar clic en el botón "Alejar (-)"
    btnZoomOut.addEventListener('click', () => {
        miCanvas.zoomOut();
        drawCurrentFunction();
    });
    // Evento de la rueda del ratón (Scroll) sobre el canvas para hacer zoom interactivo
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault(); // Evita que la página baje al hacer scroll sobre el canvas
        // Obtener factor (acerca si la rueda va arriba, aleja si va abajo)
        const zoomFactor = e.deltaY > 0 ? 1.25 : 0.8;
        // Calcular posición del ratón respecto al canvas
        const rect = canvas.getBoundingClientRect();
        const ix = e.clientX - rect.left;
        const iy = e.clientY - rect.top;
        // Ejecutar zoom con el "ancla" en la posición del ratón
        miCanvas.zoomAt(ix, iy, zoomFactor);
        drawCurrentFunction();
    });
    // Initial draw using the default function in the input
    drawCurrentFunction();
};
