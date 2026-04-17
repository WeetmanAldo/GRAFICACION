
export class CanvasLocal {
  //atributos
  protected graphics: CanvasRenderingContext2D;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;


  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.graphics = g;
    this.rWidth = 6;
    this.rHeight = 4;
    this.maxX = canvas.width - 1
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX / 2;
    this.centerY = this.maxY / 2;
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.closePath();
    this.graphics.stroke();
  }

  // Dibuja un polígono general a partir de un arreglo de puntos
  drawPolygon(points: { x: number, y: number }[]) {
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
    let points: { x: number, y: number }[] = [];
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
      } else {
        this.graphics.strokeStyle = 'black';
      }

      // Dibujar el polígono actual
      this.drawPolygon(points);

      // Calcular los nuevos vértices (puntos medios del polígono actual)
      let nextPoints: { x: number, y: number }[] = [];
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
   */
  clear() {
    this.graphics.clearRect(0, 0, this.maxX + 1, this.maxY + 1);
  }

  /**
   * Dibuja prismas o barras tridimensionales interpolando caras.
   * Modificado para recibir un color CSS arbitrario y agregar luces/sombras 
   * independientemente del espacio de color.
   */
  draw3DBar(x: number, y: number, w: number, h: number, color: string) {
    const depthX = w * 0.4;
    const depthY = w * 0.4;

    this.graphics.strokeStyle = '#222';
    this.graphics.lineWidth = 1;

    // Cara superior (Techo) - Luz (Blanco transparente sobre color base)
    this.graphics.beginPath();
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x + depthX, y - depthY);
    this.graphics.lineTo(x + w + depthX, y - depthY);
    this.graphics.lineTo(x + w, y);
    this.graphics.closePath();
    this.graphics.fillStyle = color;
    this.graphics.fill();
    this.graphics.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Filtro de luz
    this.graphics.fill();
    this.graphics.stroke();

    // Cara lateral derecha - Sombra (Negro transparente sobre color base)
    this.graphics.beginPath();
    this.graphics.moveTo(x + w, y);
    this.graphics.lineTo(x + w + depthX, y - depthY);
    this.graphics.lineTo(x + w + depthX, y + h - depthY);
    this.graphics.lineTo(x + w, y + h);
    this.graphics.closePath();
    this.graphics.fillStyle = color;
    this.graphics.fill();
    this.graphics.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Filtro de sombra
    this.graphics.fill();
    this.graphics.stroke();

    // Cara frontal - Base
    this.graphics.beginPath();
    this.graphics.rect(x, y, w, h);
    this.graphics.fillStyle = color;
    this.graphics.fill();
    this.graphics.stroke();
  }

  /**
   * Dibuja una gráfica de barras en 3D dinámica aceptando objetos.
   */
  drawBarChart(bars: { name: string, value: number, color: string }[]) {
    if (bars.length === 0) return;

    // Espaciado ajustado para no cortar el 3D de las barras extremas
    const padding = 50;
    const drawWidth = this.maxX - padding * 2.5;
    const drawHeight = this.maxY - padding * 2.8; // Más espacio inferior para el texto

    const maxVal = Math.max(...bars.map(b => b.value), 1);
    const barWidth = drawWidth / bars.length;

    // Ejes de fondo para la perspectiva del piso
    this.graphics.strokeStyle = '#333';
    this.graphics.lineWidth = 2;
    this.graphics.beginPath();
    this.graphics.moveTo(padding, padding);
    this.graphics.lineTo(padding, padding + drawHeight);
    this.graphics.lineTo(padding + drawWidth + barWidth * 0.4, padding + drawHeight);
    this.graphics.stroke();

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const barHeight = (bar.value / maxVal) * drawHeight;

      // Un pequeño margen extra para que las barras no se peguen tanto
      const x = padding + i * barWidth;
      const y = padding + drawHeight - barHeight;
      const actualBarWidth = barWidth * 0.7;

      // Dibujar la propia barra 3D (pasando el color literal del input)
      this.draw3DBar(x + 5, y, actualBarWidth, barHeight, bar.color);

      // Texto representativo encima de cada barra
      this.graphics.fillStyle = 'black';
      this.graphics.font = 'bold 13px sans-serif';
      this.graphics.textAlign = 'center';

      // Dibujamos el Valor Numérico arriba
      this.graphics.fillText(bar.value.toString(), x + 5 + actualBarWidth / 2, y - barWidth * 0.4 - 5);

      // Dibujamos el Nombre (Etiqueta) debajo de la barra
      this.graphics.fillStyle = '#444';
      this.graphics.fillText(bar.name, x + 5 + actualBarWidth / 2, padding + drawHeight + 20);
    }
  }
}