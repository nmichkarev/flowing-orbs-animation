import AbstractDrawStrategy from './abstract';
import DefaultDrawStrategy from './default';
import { PI2 } from '../../constants';
import { getRandomInt } from '../../utils';

class BezierDrawStrategy extends AbstractDrawStrategy {

    draw() {
        const { bubble } = this;

        if (bubble.cooldown <= 0) {
            DefaultDrawStrategy.prototype.draw.call(this);
            return;
        }
        /** @type{CanvasRenderingContext2D} */
        const ctx = bubble.ctx;
        const { radius, x, y } = bubble;

        const points = bubble.getRandomCirclePoints();

        points.length = points.length - points.length % 3;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        let i = 0;
        while(i < points.length) {
            const randDisp = getRandomInt(15, 20);
        
            const cpoint1x = x + (radius + randDisp) * points[i].cosangle;
            const cpoint1y = y + (radius + randDisp) * points[i].sinangle;

            const cpoint2x = x + (radius - randDisp) * points[i + 1].cosangle;
            const cpoint2y = y + (radius - randDisp) * points[i + 1].sinangle;

            let tox, toy;

            tox = x + (radius) * points[i + 2].cosangle;
            toy = y + (radius) * points[i + 2].sinangle;

            i += 3;

            ctx.bezierCurveTo(cpoint1x, cpoint1y, cpoint2x, cpoint2y, tox, toy);

        }

        const middle = (PI2 - points[points.length-1].angle) / 2;
        const defl   = getRandomInt(10, 15);
        const cpx    = x + (radius + defl) * Math.cos(middle);
        const cpy    = y + (radius + defl) * Math.sin(middle);
        ctx.quadraticCurveTo(cpx, cpy, x + radius, y);
        ctx.stroke();
    }
}

export default BezierDrawStrategy;
