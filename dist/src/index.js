import { CanvasLocal } from './canvasLocal.js';
let canvas;
let graphics;
window.onload = () => {
    canvas = document.getElementById('circlechart');
    graphics = canvas.getContext('2d');
    const miCanvas = new CanvasLocal(graphics, canvas);
    const barValuesInput = document.getElementById('barValues');
    /**
     * Función principal que lee el contenido del input de texto como una lista separada
     * por comas, y la transforma a un conjunto numérico para mandar a dibujar.
     */
    const updateChart = () => {
        // Separa el texto basado en el caracter coma ','
        const rawValues = barValuesInput.value.split(',');
        const values = [];
        // Convierte cada fragmento a número usando parseFloat, y omite valores no numéricos
        for (const val of rawValues) {
            const num = parseFloat(val.trim());
            if (!isNaN(num)) {
                values.push(num);
            }
        }
        // Antes de todo dibujado, previene graficar sobre gráficos anteriores
        miCanvas.clear();
        // Finalmente, llama al método implementado de la clase CanvasLocal para dibujar gráfico 2D interactivo
        miCanvas.drawBarChart(values);
    };
    // Añade un Event Listener 'input', para que cada vez que el usuario teclee algo, 
    // la gráfica se reconstruya (esto propicia el cambio en tiempo real pedido).
    barValuesInput.addEventListener('input', updateChart);
    // Dispara el primer dibujado usando los valores que están en la etiqueta HTML por defecto
    updateChart();
};
