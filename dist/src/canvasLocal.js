export class CanvasLocal {
    constructor(g, canvas) {
        this.graphics = g;
        this.rWidth = 6;
        this.rHeight = 4;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = this.maxX / 2;
        this.centerY = this.maxY / 2;
    }
    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
    }
    // Dibuja un polígono general a partir de un arreglo de puntos
    drawPolygon(points) {
        for (let i = 0; i < points.length; i++) {
            let p1 = points[i];
            let p2 = points[(i + 1) % points.length]; // Conecta el último con el primero
            this.drawLine(p1.x, p1.y, p2.x, p2.y);
        }
    }
    paint() {
        let side = Math.min(this.maxX, this.maxY) * 0.9;
        let radius = side / 2; // Radio de la circunferencia que circunscribe al hexágono
        let sides = 6; // Número de lados (Hexágono)
        // Generar los vértices iniciales del hexágono regular
        let points = [];
        for (let i = 0; i < sides; i++) {
            // Angulo en radianes (Math.PI / 2 permite que un vértice apunte hacia arriba o rote)
            let angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
            points.push({
                x: this.centerX + radius * Math.cos(angle),
                y: this.centerY + radius * Math.sin(angle)
            });
        }
        // Dibujar 10 figuras anidadas
        for (let i = 0; i < 15; i++) {
            // Alternar colores
            if (i % 2 === 0) {
                this.graphics.strokeStyle = 'red';
            }
            else {
                this.graphics.strokeStyle = 'black';
            }
            // Dibujar el polígono actual
            this.drawPolygon(points);
            // Calcular los nuevos vértices (puntos medios del polígono actual)
            let nextPoints = [];
            for (let j = 0; j < sides; j++) {
                let p1 = points[j];
                let p2 = points[(j + 1) % sides];
                // Punto medio (puede cambiarse el divisor para crear efectos de rotación asimétricos)
                nextPoints.push({
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2
                });
            }
            points = nextPoints; // Actualizar los vértices para la siguiente iteración
        }
    }
    /**
     * Limpia el lienzo por completo para dibujar gráficos nuevos sin sobreponerlos.
     * Utiliza el máximo de píxeles disponibles.
     */
    clear() {
        this.graphics.clearRect(0, 0, this.maxX + 1, this.maxY + 1);
    }
    /**
     * Dibuja una gráfica de barras en 2D dinámica, que se escala automáticamente
     * en función de los valores en tiempo real dados en el arreglo.
     * Asigna un color tipo HSL a cada barra.
     * @param values Arreglo de números extraidos del input para formar cada barra
     */
    drawBarChart(values) {
        if (values.length === 0)
            return;
        const padding = 40; // Espaciado en los bordes del canvas
        const drawWidth = this.maxX - padding * 2;
        const drawHeight = this.maxY - padding * 2;
        const maxVal = Math.max(...values, 1); // Evitar división por 0
        // Ancho de cada barra basado en el espacio disponible y la cantidad de barras
        const barWidth = drawWidth / values.length;
        // Dibujar el marco contenedor
        this.graphics.strokeStyle = '#333';
        this.graphics.lineWidth = 2;
        this.graphics.strokeRect(padding, padding, drawWidth, drawHeight);
        // Iterar en cada valor y dibujar la barra representativa
        for (let i = 0; i < values.length; i++) {
            const val = values[i];
            // Calcular la altura proporcional de acuerdo con el valor máximo
            const barHeight = (val / maxVal) * drawHeight;
            // Calcular posiciones de dibujado invertidas (Y empieza arriba pero se dibuja de abajo hacia arriba)
            const x = padding + i * barWidth;
            const y = padding + drawHeight - barHeight;
            // Dinamizar colores (Tonalidad HSL espaciada a lo largo del espectro cromático)
            this.graphics.fillStyle = `hsl(${(i * 360) / values.length}, 70%, 50%)`;
            this.graphics.fillRect(x + 5, y, barWidth - 10, barHeight); // Agregar pequeño margen lateral a cada barra
            // Escribir el texto con el valor exacto encima de cada barra
            this.graphics.fillStyle = 'black';
            this.graphics.font = 'bold 14px sans-serif';
            this.graphics.textAlign = 'center';
            this.graphics.fillText(val.toString(), x + barWidth / 2, y - 5);
        }
    }
}
