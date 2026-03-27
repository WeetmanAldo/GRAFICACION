export class CanvasLocal {
    /**
     * Inicializa el canvas y define el área lógica visible por defecto (ej. de -10 a 10).
     * @param g El contexto de renderizado 2D del canvas.
     * @param canvas El elemento canvas del DOM.
     */
    constructor(g, canvas) {
        this.graphics = g;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        // Default logical bounds (e.g. -10 to 10 on X, Y scaled appropriately)
        this.minX = -10;
        this.maxX = 10;
        const ratio = this.canvasHeight / this.canvasWidth;
        this.minY = -10 * ratio;
        this.maxY = 10 * ratio;
    }
    /**
     * Convierte una coordenada X lógica (del plano cartesiano) a una coordenada X en píxeles del canvas.
     */
    iX(x) {
        return Math.round(((x - this.minX) / (this.maxX - this.minX)) * this.canvasWidth);
    }
    /**
     * Convierte una coordenada Y lógica a una coordenada Y en píxeles.
     * Se invierte la escala porque en el canvas el eje Y crece hacia abajo.
     */
    iY(y) {
        return Math.round(((this.maxY - y) / (this.maxY - this.minY)) * this.canvasHeight);
    }
    /**
     * Convierte una coordenada X en píxeles a su valor lógico correspondiente en el plano cartesiano.
     */
    lX(ix) {
        return this.minX + (ix / this.canvasWidth) * (this.maxX - this.minX);
    }
    /**
     * Convierte una coordenada Y en píxeles a su valor lógico correspondiente en el plano cartesiano.
     */
    lY(iy) {
        return this.maxY - (iy / this.canvasHeight) * (this.maxY - this.minY);
    }
    /**
     * Limpia todo el contenido actual del canvas.
     */
    clear() {
        this.graphics.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    /**
     * Dibuja una cuadrícula de fondo simulando el papel milimetrado.
     * Traza líneas grises tenues dividiendo el área visible en 10 secciones por eje.
     */
    drawGrid() {
        this.graphics.beginPath();
        this.graphics.strokeStyle = '#d3d3d3'; // Gris claro
        this.graphics.lineWidth = 1;
        // Dibujar cuadriculas cada 1 unidad matemática
        let stepX = 1;
        let stepY = 1;
        for (let x = Math.ceil(this.minX / stepX) * stepX; x <= this.maxX; x += stepX) {
            const px = this.iX(x);
            this.graphics.moveTo(px, 0);
            this.graphics.lineTo(px, this.canvasHeight);
        }
        for (let y = Math.ceil(this.minY / stepY) * stepY; y <= this.maxY; y += stepY) {
            const py = this.iY(y);
            this.graphics.moveTo(0, py);
            this.graphics.lineTo(this.canvasWidth, py);
        }
        this.graphics.stroke();
    }
    /**
     * Dibuja los ejes coordenados principales (Eje X y Eje Y) en color gris oscuro.
     */
    drawAxes() {
        this.graphics.beginPath();
        this.graphics.strokeStyle = '#000000'; // Negro fuerte para la cruz
        this.graphics.lineWidth = 2; // Más gruesa
        // X Axis
        const y0 = this.iY(0);
        this.graphics.moveTo(0, y0);
        this.graphics.lineTo(this.canvasWidth, y0);
        // Y Axis
        const x0 = this.iX(0);
        this.graphics.moveTo(x0, 0);
        this.graphics.lineTo(x0, this.canvasHeight);
        this.graphics.stroke();
    }
    /**
     * Evalúa y dibuja una función matemática iterando sobre cada píxel del ancho del canvas.
     * @param f La función matemática a evaluar, ej: (x) => Math.sin(x)
     * @param color El color con el que se trazará la línea de la función.
     */
    drawFunction(f, color = 'blue') {
        this.graphics.beginPath();
        this.graphics.strokeStyle = color;
        this.graphics.lineWidth = 2;
        let firstPoint = true;
        for (let ix = 0; ix <= this.canvasWidth; ix++) {
            let x = this.lX(ix);
            let y = f(x);
            // Check for discontinuities or out of bounds (NaN, Infinite)
            if (isNaN(y) || !isFinite(y)) {
                firstPoint = true;
                continue;
            }
            let iy = this.iY(y);
            if (firstPoint) {
                this.graphics.moveTo(ix, iy);
                firstPoint = false;
            }
            else {
                this.graphics.lineTo(ix, iy);
            }
        }
        this.graphics.stroke();
    }
    /**
     * Acerca la vista de la gráfica (Zoom In), reduciendo el rango del área lógica visible.
     */
    zoomIn() {
        this.zoom(0.8);
    }
    /**
     * Aleja la vista de la gráfica (Zoom Out), ampliando el rango del área lógica visible.
     */
    zoomOut() {
        this.zoom(1.25);
    }
    /**
     * Acerca o aleja la vista teniendo como "ancla" matemática el punto del cursor del mouse.
     * @param ix La posición X del ratón en píxeles de pantalla.
     * @param iy La posición Y del ratón en píxeles de pantalla.
     * @param factor El grado de ampliación o reducción.
     */
    zoomAt(ix, iy, factor) {
        const lx = this.lX(ix);
        const ly = this.lY(iy);
        const currentW = this.maxX - this.minX;
        const currentH = this.maxY - this.minY;
        const newW = currentW * factor;
        const newH = currentH * factor;
        const fracX = ix / this.canvasWidth;
        const fracY = iy / this.canvasHeight;
        this.minX = lx - fracX * newW;
        this.maxX = this.minX + newW;
        this.maxY = ly + fracY * newH;
        this.minY = this.maxY - newH;
    }
    /**
     * Función auxiliar interna que aplica un factor de escala a los límites visuales actuales
     * manteniendo el mismo centro. Un factor < 1 es acercar, un factor > 1 es alejar.
     * @param factor El multiplicador de escala.
     */
    zoom(factor) {
        let centerX = (this.minX + this.maxX) / 2;
        let centerY = (this.minY + this.maxY) / 2;
        let width = (this.maxX - this.minX) * factor;
        let height = (this.maxY - this.minY) * factor;
        this.minX = centerX - width / 2;
        this.maxX = centerX + width / 2;
        this.minY = centerY - height / 2;
        this.maxY = centerY + height / 2;
    }
}
