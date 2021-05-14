import AbstractDrawStrategy from './abstract';
import Bubble from '../bubble';
import { MOVE_MODES, PI2 } from '../../constants';

const DEFAULT_OPACITY = 0.25;
const DEFAULT_BORDER_OPACITY = 0.5;

class FilledDrawStrategy extends AbstractDrawStrategy {

    draw() {
        const { ctx, bubble } = this;
        const { color, cooldown, mode } = bubble;

        const opacity = mode === MOVE_MODES.SLOWING_MODE 
            ? (bubble.velocity)
            : (DEFAULT_OPACITY + cooldown);

        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, PI2);
        ctx.fill();
    }
}

export default FilledDrawStrategy;