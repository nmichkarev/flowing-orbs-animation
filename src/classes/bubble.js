import { PI2, PRESET_COLORS, MOVE_MODES } from '../constants';
import RGB from './RGB';
import { getRandomInt, getRandomArbitrary } from '../utils';
import Sparkle from './sparkle';
import DefaultDrawStrategy from './draw-strategies/default';
import VibrationsDrawStrategy from './draw-strategies/vibrations';
import CircledDrawStrategy from './draw-strategies/circled';
import FilledDrawStrategy from './draw-strategies/filled';
import RadialGradientDrawStrategy from './draw-strategies/radial';
import BezierDrawStrategy from './draw-strategies/bezier';
import SatelliteDrawStrategy from './draw-strategies/satellite';

const strategies = {
    'default': DefaultDrawStrategy,
    'vibrating': VibrationsDrawStrategy,
    'stroked': CircledDrawStrategy,
    'gradient': RadialGradientDrawStrategy,
    'filled': FilledDrawStrategy,
    'satellite': SatelliteDrawStrategy
}

const DEFAULT_OPACITY = 0.25;

class Bubble {
    
    /**
     * 
     * @param {CanvasRenderingContext2D} canvasContext 
     * @param {number} radius
     * @param {number} position 
     * @param {number} direction 
     * @param {RGB} color 
     * @param {string} label 
     */
    constructor(canvasContext, style, radius, position, direction, color, mode, label, drawSparkles) {
        const Strategy = style in strategies ? strategies[style] : strategies.default;
        /** @type{CanvasRenderingContext2D} */
        this.ctx    = canvasContext;
        this.radius = Number.isInteger(radius) ? Math.abs(radius) : 20;
        this.position  = position;
        this.mode = mode;
        this.direction = isNaN(direction) ? (Math.random() * (2 * Math.PI)) : direction;
        this.prevDirection = null; // for debug
        this.touchAngle    = null;
        this.cooldown = 0;
        this.velocity = 1;
        this.label = String(label);
        //this.color = color || PRESET_COLORS.DEFAULT;
        this.color = color || new RGB(getRandomInt(0, 266), getRandomInt(0, 266), getRandomInt(0, 266));
        this.drawSparkles = drawSparkles || false;
        /** @type{Sparkle[]} */
        this.sparkles = [];
        this.drawStrategy = new Strategy(this.ctx, this);
    }

    set direction(ang) {
        const { sin, cos } = Math;
        let angle = ang;
        
        if (ang < 0) {
            angle = PI2 + ang;
        } else if (ang >= PI2) {
            angle = ang % PI2;
        }

        this.angle = angle;

        this.sinAngle = sin(angle);
        this.cosAngle = cos(angle);
        
    }

    get direction() {
        return this.angle;
    }

    get directionGrad() {
        return Math.round(this.angle * 180 / Math.PI);
    }

    set position(pos) {
        this.pos = pos;
    }

    get position() {
        return this.pos;
    }

    get x() {
        return this.pos[0];
    }

    get y() {
        return this.pos[1];
    }

    /**
     * 
     * @param {number} touchAngle 
     * @returns undefined
     */
    touch(touchAngle) {
        this.prevDirection = this.direction;
        this.touchAngle = touchAngle;
        this.cooldown = 0.5;

        //this.points = this.getRandomCirclePoints();
        if (!this.drawSparkles) return;
        this.pushSparkles(touchAngle);
    }

    pushSparkles(touchAngle) {
        const x = this.x + this.radius * Math.cos(touchAngle);
        const y = this.y + this.radius * Math.sin(touchAngle);

        let i = 0, length, shift, spx, spy;
        do {
            i += getRandomArbitrary(0.5, 1.2);
            length = getRandomInt(4, 12);
            shift = getRandomInt(2, 6);
            spx = x + shift * Math.cos(touchAngle);
            spy = y + shift * Math.sin(touchAngle);
            //this.sparkles.add(new Sparkle(i, spx, spy, length, this.ctx));
            this.sparkles.push(new Sparkle(i, spx, spy, length, this.ctx));

        } while(i < PI2);
    }

    /**
     * Moves bubble on distance in current direction
     * @param {number} distance 
     */
    move(distance) {
        this.position = this.newposition(distance * this.velocity);
    }

    /**
     * Returns new position
     * @param {number} distance 
     * @returns {Array}
     */
    newposition(distance) {
        const dx = distance * this.cosAngle;
        const dy = distance * this.sinAngle;
        return [this.x + dx, this.y + dy];
    }

    /**
     * Draws bubble
     */
    draw() {
        this.changeCooldown();

        if (this.drawSparkles)
            this.processSparkles();

        this.drawStrategy.draw();

    }

    processSparkles() {
        const strStyle = this.ctx.strokeStyle;
        const lineWidth = this.ctx.lineWidth;

        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';

        this.sparkles.forEach(sparkle => {
            if (sparkle && sparkle.power <= 0){
                //this.sparkles.delete(sparkle);
            } else {
                sparkle.draw();
            }
        });

        this.ctx.strokeStyle = strStyle;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'butt';
    }

    _drawFilled() {}
    _drawFilledWithBorder() {}
    _drawRattling() {}
    _drawRattlingFilled() {}
    _drawTouchGradient() {}

    changeCooldown() {
        if (this.cooldown <= 0) return;
        this.cooldown -= 0.01;
    }

    getRandomCirclePoints() {
        const { radius } = this;
        const points = [];
        let point = 0;
        let direction = 1;

        do {
            const sn = Math.sin(point);
            const cs = Math.cos(point);
            direction *= -1;
            points.push({ 
                sinangle: sn,
                cosangle: cs,
                topx: cs * (radius + 5),
                topy: sn * (radius + 5),
                bottomx: cs * (radius - 5),
                bottomy: sn * (radius - 5),
                delta: direction, 
                dr: getRandomInt(1, 5),
                angle: point
            });
            point += getRandomArbitrary(0.1, 0.6);
        } while (point < PI2);

        return points;
    }

    drawRattlingCircle() {
        const { ctx, radius, cooldown, color } = this;
        //const { points } = this;
        const points = this.getRandomCirclePoints();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        
        //ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${borderOpacity})`;

        ctx.moveTo(this.x + (radius + points[0].delta * 5 * cooldown) * points[0].cosangle, this.y + (radius + points[0].delta * 5 * cooldown) * points[0].sinangle);
    
        for (let i = 1; i < points.length; i++) {
            const next = i < points.length ? points[i + 1] : points[0];
            const point = points[i];
            const delta = radius + point.delta * 5 * cooldown;
            const tox = this.x + delta * point.cosangle;
            const toy = this.y + delta * point.sinangle;
            const cpx1 = this.x + (point.delta < 0 ? point.topx - 5 : point.bottomx);
            const cpy1 = this.y + (point.delta < 0 ? point.topy : point.bottomy);
            const cpx2 = this.x + (point.delta < 0 ? points[i-1].bottomx : points[i-1].topx);
            const cpy2 = this.y + (point.delta < 0 ? points[i-1].bottomy : points[i-1].topy);
            ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, tox, toy);
            ctx.fillStyle = 'red';
            ctx.fillRect(cpx1, cpy1, 1, 1);
            ctx.fillRect(cpx2, cpy2, 1, 1);
            ctx.fillStyle = 'blue';
            ctx.fillRect(tox, toy, 2, 2);
        }

        ctx.closePath();
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
        
        ctx.stroke();
    }

    drawRattlingCircleZigzag() {
        const { ctx, fillRadius, strokeRadius, cooldown, color } = this;
        const points = this.getRandomCirclePoints();

        ctx.beginPath();
        
        let startx = this.x + (fillRadius + points[0].delta * 5 * cooldown) * points[0].cosangle;
        let starty = this.y + (fillRadius + points[0].delta * 5 * cooldown) * points[0].sinangle;
        
        ctx.moveTo(startx, starty);
    
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const delta = fillRadius + point.delta * 5 * cooldown;
            const tox = this.x + delta * point.cosangle;
            const toy = this.y + delta * point.sinangle;

            ctx.lineTo(tox, toy);
        }

        ctx.closePath();
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${DEFAULT_OPACITY})`;
        ctx.fill();
        

        startx = this.x + (strokeRadius + points[0].delta * 5 * cooldown) * points[0].cosangle;
        starty = this.y + (strokeRadius + points[0].delta * 5 * cooldown) * points[0].sinangle;
        
        ctx.beginPath();
        ctx.lineWidth = this.drawLineWidth
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;

        ctx.moveTo(startx, starty);
    
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const delta = strokeRadius + point.delta * 5 * cooldown;
            const tox = this.x + delta * point.cosangle;
            const toy = this.y + delta * point.sinangle;

            ctx.lineTo(tox, toy);
        }

        ctx.closePath();
        ctx.stroke();
    }

    drawRattlingCircleZigzagCountour() {
        const { ctx, radius, cooldown } = this;
        const points = this.getRandomCirclePoints();
        const rattle = 3;

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        
        let startx = this.x + (radius + points[0].delta * rattle * cooldown) * points[0].cosangle;
        let starty = this.y + (radius + points[0].delta * rattle * cooldown) * points[0].sinangle;
        
        ctx.moveTo(startx, starty);
    
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            const delta = radius + point.delta * rattle * cooldown;
            const tox = this.x + delta * point.cosangle;
            const toy = this.y + delta * point.sinangle;

            ctx.lineTo(tox, toy);
        }

        ctx.closePath();
        ctx.stroke();
    }

    drawInfo() {
        const c = this.ctx;

        c.strokeStyle = "#f10606";
        c.beginPath();
        c.moveTo(this.position[0], this.position[1]);
        c.lineTo(this.position[0] + 40 * Math.cos(this.direction),
            this.position[1] + 40 * Math.sin(this.direction));
        c.stroke();
        c.fillText(`${this.label}: ${this.directionGrad}`, this.position[0], this.position[1]);
        c.strokeStyle = "#000";
    }

    drawVelocity() {
        const c = this.ctx;
        c.fillText(`Sp:${this.velocity.toFixed(2)}`, this.position[0], this.position[1]);
    }

    drawGradient() {
        const { ctx } = this;
        const grad = ctx.createRadialGradient(this.x, this.y, 30, this.x+20, this.y+20, this.radius+30);

        grad.addColorStop(0.2, 'white');
        grad.addColorStop(1, 'red');
        
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, PI2);
        ctx.fill()
    }

    drawPostTouch2() {
        if (this.cooldown <= 0) return;
        const { ctx, radius, touchAngle } = this;

        this.cooldown -= 0.01;


        for (let i =-1; i < 1; i += 0.02) {
            const cosTouch = Math.cos(touchAngle + i);
            const sinTouch = Math.sin(touchAngle + i);
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + radius * cosTouch, this.y + radius * sinTouch);
            ctx.strokeStyle = `rgba(195, 0, 0, ${(1-Math.abs(i))*this.cooldown})`;

            ctx.stroke();
        }
        ctx.strokeStyle = 'black';
    }

}

export default Bubble;
