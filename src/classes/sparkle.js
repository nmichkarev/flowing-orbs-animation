import { PI2 } from '../constants';
const DR = 3;
const POWER_STEP = 0.05;

class Sparkle {
    /**
     * 
     * @param {number} direction 
     * @param {number} x 
     * @param {number} y 
     * @param {number} length 
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(direction, x, y, length, ctx) {
        this.ctx = ctx;
        this.direction = direction % PI2;
        this.x = x;
        this.y = y;
        this.length = length;
        this.sindir = Math.sin(direction);
        this.cosdir = Math.cos(direction);
        this.power = 1;
    }

    move() {
        const { sindir, cosdir } = this;
        this.x += cosdir * DR;
        this.y += sindir * DR;
        this.power -= POWER_STEP;
    }

    draw() {
        const { ctx, x, y, length, sindir, cosdir, power } = this;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length * cosdir, y + length * sindir);
        ctx.strokeStyle = `rgba(255, ${Math.floor(255 - power * 255)}, 0, ${power})`;
        ctx.stroke();
        this.move();
    }
}

export default Sparkle;