import AbstractDrawStrategy from './abstract';
import DefaultDrawStrategy from './default';
import { PI2 } from '../../constants';
import { getRandomArbitrary } from '../../utils';

const DA = 0.1;

class SatelliteDrawStrategy extends AbstractDrawStrategy {
    constructor(...args) {
        super(...args);
        const bubbleRadius = this.bubble.radius;
        this.radius = Math.floor(bubbleRadius / 10);
        if (this.radius < 1) this.radius = 1;
        this.angle = getRandomArbitrary(0, PI2);
        this.direction = Math.round(Math.random()) === 0 ? -1 : 1;
    }

    draw() {
        const { bubble, angle, radius, ctx } = this;
        const x = bubble.x + bubble.radius * Math.cos(angle);
        const y = bubble.y + bubble.radius * Math.sin(angle);

        DefaultDrawStrategy.prototype.draw.call(this);
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, PI2);
        ctx.fill();

        this.incrementAngle();
    }

    incrementAngle() {
        this.angle = (this.angle + DA * this.direction * this.bubble.velocity) % PI2;
    }
}

export default SatelliteDrawStrategy;
