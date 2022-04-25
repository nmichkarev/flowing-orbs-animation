import AbstractDrawStrategy from './abstract';
import DefaultDrawStrategy from './default';
import FilledDrawStrategy from './filled';

class RadialGradientDrawStrategy extends AbstractDrawStrategy {

    draw() {
        const { ctx, bubble } = this;
        const { radius, cooldown,touchAngle } = bubble;

        FilledDrawStrategy.prototype.draw.call(this);
        if (cooldown <= 0) return;

        const cosTouch = Math.cos(touchAngle);
        const sinTouch = Math.sin(touchAngle);
        const radTouchx = bubble.x + radius * cosTouch;
        const radTouchy = bubble.y + radius * sinTouch;
        const radTouchxsec = bubble.x + (radius - Math.abs(radius / 5)) * cosTouch; // + (1 - this.cooldown)*55
        const radTouchysec = bubble.y + (radius - Math.abs(radius / 5)) * sinTouch;
        const radPlus10Percent = radius + Math.abs(radius / 10); 
        const gradient1 = ctx.createRadialGradient(radTouchxsec, radTouchysec, radius/2, radTouchx, radTouchy, radius+radPlus10Percent);

        gradient1.addColorStop(0, `rgba(195, 0, 0, ${cooldown})`);
        gradient1.addColorStop(1, 'white');
        const gradient2 = ctx.createRadialGradient(radTouchxsec, radTouchysec, radius/2, radTouchx, radTouchy, radius+radPlus10Percent);

        gradient2.addColorStop(0, `rgba(195, 0, 0, ${cooldown})`);
        gradient2.addColorStop(1, 'white');

        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.moveTo(bubble.x, bubble.y);
        ctx.arc(bubble.x, bubble.y, radius, touchAngle, touchAngle + Math.PI);
        ctx.moveTo(bubble.x, bubble.y);
        ctx.fill();

        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.moveTo(bubble.x, bubble.y);
        ctx.arc(bubble.x, bubble.y, radius, touchAngle - Math.PI, touchAngle);
        ctx.moveTo(bubble.x, bubble.y);
        ctx.fill();

        ctx.fillStyle = 'black';
    }
}

export default RadialGradientDrawStrategy;
