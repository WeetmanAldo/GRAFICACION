
export class CanvasLocal {
  //atributos
  protected graphics: CanvasRenderingContext2D;
  protected rWidth:number;
  protected rHeight:number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;
  
      
  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.graphics = g;
    this.rWidth = 6;
    this.rHeight= 4;
    this.maxX = canvas.width - 1
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX/2;
    this.centerY = this.maxY/2;
  }

  drawLine(x1: number, y1: number, x2: number, y2:number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.closePath();
    this.graphics.stroke();
  }

  paint() {
    let side = Math.min(this.maxX, this.maxY) * 0.9;
    let halfSide = side / 2;
    
    let xA = this.centerX - halfSide;
    let yA = this.centerY - halfSide;
    let xB = this.centerX + halfSide;
    let yB = this.centerY - halfSide;
    let xC = this.centerX + halfSide;
    let yC = this.centerY + halfSide;
    let xD = this.centerX - halfSide;
    let yD = this.centerY + halfSide;

    for (let i = 0; i < 7; i++) {
      if (i < 2) {
        this.graphics.strokeStyle = 'red';
      } else {
        this.graphics.strokeStyle = 'black';
      }
      
      this.drawLine(xA, yA, xB, yB);
      this.drawLine(xB, yB, xC, yC);
      this.drawLine(xC, yC, xD, yD);
      this.drawLine(xD, yD, xA, yA);

      let xA1 = (xA + xB) / 2;
      let yA1 = (yA + yB) / 2;
      let xB1 = (xB + xC) / 2;
      let yB1 = (yB + yC) / 2;
      let xC1 = (xC + xD) / 2;
      let yC1 = (yC + yD) / 2;
      let xD1 = (xD + xA) / 2;
      let yD1 = (yD + yA) / 2;

      xA = xA1; yA = yA1;
      xB = xB1; yB = yB1;
      xC = xC1; yC = yC1;
      xD = xD1; yD = yD1;
    }
  }

}