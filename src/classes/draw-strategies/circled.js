import AbstractDrawStrategy from './abstract';
import { PI2 } from '../../constants';

const DEFAULT_OPACITY = 0.25;
const DEFAULT_BORDER_OPACITY = 0.5;
const DRAW_LINE_WIDTH_BIG = 12;
const DRAW_LINE_WIDTH = 8;

class CircledDrawStrategy extends AbstractDrawStrategy {

    constructor(...properties) {
        super(...properties);
        this.drawLineWidth = this.bubble.radius < 30 ? DRAW_LINE_WIDTH : DRAW_LINE_WIDTH_BIG;
        this.fillRadius    = this.bubble.radius - this.drawLineWidth;
        this.strokeRadius  = this.bubble.radius - this.drawLineWidth / 2;
    }

    draw() {
        const { ctx, bubble } = this;
        const { color, cooldown } = bubble;

        const opacity = DEFAULT_OPACITY + cooldown;
        const borderOpacity = DEFAULT_BORDER_OPACITY + cooldown;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        ctx.arc(bubble.x, bubble.y, this.fillRadius, 0, PI2);
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = this.drawLineWidth;
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${borderOpacity})`;
        ctx.arc(bubble.x, bubble.y, this.strokeRadius, 0, PI2);
        ctx.stroke();
    }
}

export default CircledDrawStrategy;
