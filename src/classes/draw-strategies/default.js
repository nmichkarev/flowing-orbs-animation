import AbstractDrawStrategy from './abstract';
import Bubble from '../bubble';
import { PI2 } from '../../constants';

class DefaultDrawStrategy extends AbstractDrawStrategy {

    draw() {
        const { ctx, bubble } = this;

        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, PI2);
        ctx.stroke();
    }
}

export default DefaultDrawStrategy;
