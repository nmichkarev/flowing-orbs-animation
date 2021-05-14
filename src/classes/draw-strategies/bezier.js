import AbstractDrawStrategy from './abstract';
import DefaultDrawStrategy from './default';
import { PI2 } from '../../constants';
import { getRandomInt } from '../../utils';

class BezierDrawStrategy extends AbstractDrawStrategy {

/*     draw() {
        const { bubble } = this;

        if (bubble.cooldown <= 0) {
            DefaultDrawStrategy.prototype.draw.call(this);
            return;
        }
        const { ctx, radius, cooldown } = bubble;

        let rest = PI2;
        const points = [];
        const ranges = [];
        
        while(rest > 0) {
            let i = Math.random();
            if (i > rest) i = rest;
            points.push(i);
            rest -= i;
            ranges.push([Math.random(), Math.random()]);
        }

        //console.log(ranges);
        ctx.beginPath();
        ctx.moveTo(this.x + radius, this.y);
        for(let i = 0; i < points.length; i++) {
            const pointupx = (radius + ranges[i][0]) * Math.cos(points[i]);
            const pointupy = (radius + ranges[i][0]) * Math.sin(points[i]);

            const pointdwx = (radius - ranges[i][1]) * Math.cos(points[i]);
            const pointdwy = (radius - ranges[i][1]) * Math.sin(points[i]);

            ctx.lineTo(pointupx, pointupy);
        }
    } */
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

        //const ranges = points.map((point, i) => getRandomInt(5, 9) * ((i % 2) ? 1 : -1));

        //console.log(ranges);

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

/*             if (i === points.length - 3) {
                tox = x + radius;
                toy = y;
            } else { */
                tox      = x + (radius) * points[i + 2].cosangle;
                toy      = y + (radius) * points[i + 2].sinangle;
            /* } */

            i += 3;

            ctx.bezierCurveTo(cpoint1x, cpoint1y, cpoint2x, cpoint2y, tox, toy);

/*             ctx.fillStyle = 'red';
            ctx.fillRect(cpoint1x, cpoint1y, 5, 5);
            ctx.fillStyle = 'blue';
            ctx.fillRect(cpoint2x, cpoint2y, 5, 5);
            ctx.fillStyle = 'green';
            ctx.fillRect(tox, toy, 5, 5);
 */
        }

        const middle = (PI2 - points[points.length-1].angle) / 2;
        const defl   = getRandomInt(10, 15);
        const cpx    = x + (radius + defl) * Math.cos(middle);
        const cpy    = y + (radius + defl) * Math.sin(middle);
        ctx.quadraticCurveTo(cpx, cpy, x + radius, y);
        //ctx.closePath();
        ctx.stroke();

/*         points.forEach((point, i) => {
            const pointupx = (radius + ranges[i][0]) * Math.cos(point);
            const pointupy = (radius + ranges[i][0]) * Math.sin(point);

            const pointdwx = (radius - ranges[i][1]) * Math.cos(point);
            const pointdwy = (radius - ranges[i][1]) * Math.sin(point);

            const endpoindx = this.x + radius * Math.cos(point)

            ctx.bezierCurveTo(pointupx, pointupy, pointdwx, pointdwy, );
        });

        for(let i = 0; i < points.length; i++) {
            const pointupx = (radius + ranges[i][0]) * Math.cos(points[i]);
            const pointupy = (radius + ranges[i][0]) * Math.sin(points[i]);

            const pointdwx = (radius - ranges[i][1]) * Math.cos(points[i]);
            const pointdwy = (radius - ranges[i][1]) * Math.sin(points[i]);

            ctx.lineTo(pointupx, pointupy);
        } */
    }
}

export default BezierDrawStrategy;
