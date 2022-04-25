import AbstractDrawStrategy from './abstract';
import DefaultDrawStrategy from './default';

const RATTLE = 3;

class VibrationsDrawStrategy extends AbstractDrawStrategy {

    draw() {
        const { ctx, bubble } = this;
        const { radius, cooldown } = bubble;

        if (cooldown <= 0) { 
            DefaultDrawStrategy.prototype.draw.call(this);
            return;
        
        }
        const points = bubble.getRandomCirclePoints();

        ctx.beginPath();
        ctx.strokeStyle = `rgb(${bubble.color.r}, ${bubble.color.g}, ${bubble.color.b})`;

        ctx.lineWidth = 1;
        
        let startx = bubble.x + (radius + points[0].delta * RATTLE * cooldown) * points[0].cosangle;
        let starty = bubble.y + (radius + points[0].delta * RATTLE * cooldown) * points[0].sinangle;
        
        ctx.moveTo(startx, starty);
    
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const delta = radius + point.delta * RATTLE * cooldown;
            const tox = bubble.x + delta * point.cosangle;
            const toy = bubble.y + delta * point.sinangle;

            ctx.lineTo(tox, toy);
        }

        ctx.closePath();
        ctx.stroke();
    }
}

export default VibrationsDrawStrategy;
