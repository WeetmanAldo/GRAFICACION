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
}
