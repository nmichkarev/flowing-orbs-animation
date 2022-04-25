import Bubble from './bubble';
import RGB from './RGB';
import { radToDeg, getAngleQuarter, getRandomInt } from '../utils';
import { PI2, PId2, PI3d2} from '../constants';
import { TBIT, LBIT, RBIT, BBIT, PRESET_COLORS, MOVE_MODES, USER_INPUT_MODE } from '../constants';

const { DEFAULT_MODE, SLOWING_MODE, GAS_MODE } = MOVE_MODES;

const REND_INTERVAL = 20;
const DMOVEMENT = 2;

class Field {
    
    /**
     * Creates field object for canvas. It's a context for all manipulations.
     * Options to send:
     * - width: number
     * - height: number
     * - mode: ('slowing'|'gas'|'default')
     * - overlay: (true|false)
     * - particles: (Object|Array)
     * @param {string} selector 
     * @param {Object} options 
     */
    constructor(selector, options) {
        if (!selector) throw new Error('Selector should be specified');
        options = options || {};
        this.width  = options && Number(options.width) || 1000;
        this.height = options && Number(options.height) || 400;
        
        this.selector = selector;
        /** @type{Bubble[]} */
        this.bubbles = [];
        this.counter = 0;
        this.tick    = ::this.tick;
        this.pause   = ::this.pause;
        this.checkFieldForSleep = ::this.checkFieldForSleep;
        //this.detectedCollisions = {};
        this.paused = false;
        this.mode = options ? (options.mode && USER_INPUT_MODE[options.mode] || DEFAULT_MODE) : DEFAULT_MODE;
        this.setOverlay = options ? !!options.overlay : false;
        this.pauseOnTouch = 0; // 1 for debug
        this.startSet = options.particles;
        this.containerClassName = typeof options.className === 'string' ? options.className : 'bubbles-field-plugin';
        this.drawSparkles = options.drawSparkles;
        this.bubbleStyle = typeof options.particleStyle === 'string' ? options.particleStyle : 'default';
        this.containerClassName += options.drawBorder ? ' with-border' : '';
    }

    /**
     * Creates canvas object, places bubbles, attaches testing key bindings, sets bubbles move mode. Starts animataion.
     */
    init() {
        const { startSet } = this;
        const setPull = set => { if (set.radius && set.count) {this.placeBubbles(set.count, set.radius, set.color)} };

        this.createCanvas();

        if (this.setOverlay) {
            this.createOverlayCanvas();
        }

        if (!startSet || (typeof startSet !== 'object')) {
            this.placeBubbles(20, 10);
        } else {
            if (startSet.length) { startSet.forEach(setPull) } else { this.placeBubbles(startSet.count, startSet.radius, startSet.color) } 
        }

        if (this.mode === SLOWING_MODE) {
            this._checkFieldTimer = setInterval(this.checkFieldForSleep, 5000);
        }

        if (process.env.NODE_ENV === 'development') {
            this.attachKeysBindings();
        }
        //this.addResizeListener();

        // Runs loop
        this.tick();
    }

    destroy() {
        this.pause();
        if (process.env.NODE_ENV === 'development') {
            this.removeKeysBindings();
        }
        this.deleteCanvas();
    }

    addResizeListener() {
        window.addEventListener("resize", resizeThrottler, false);

        let resizeTimeout, actualResizeHandler;
        const timeoutCallback = () => {
            resizeTimeout = null;
            actualResizeHandler();
         // The actualResizeHandler will execute at a rate of 15fps
        }
        function resizeThrottler() {
            if ( !resizeTimeout ) {
                resizeTimeout = setTimeout(timeoutCallback.bind({ resizeTimeout }),
                66); 
            }
        }
      
        actualResizeHandler = function () {
            this.setCanvasDocumentWidth();
        }

        actualResizeHandler = actualResizeHandler.bind(this);
    }

    setCanvasDocumentWidth() {
        const width = document.documentElement.clientWidth;
        this.canvas.width = width - 5;
        this.width = width - 5;
    }

    createCanvas() {
        const container = document.getElementById(this.selector);
        const canv = document.createElement('canvas');

        container.setAttribute('class', this.containerClassName);
        canv.setAttribute('width', String(this.width));
        canv.setAttribute('height', String(this.height));
        canv.setAttribute('class', 'bubbles-canvas');

        this.container = container;
        this.canvas = canv;
        this.canvasContext = canv.getContext('2d');

        container.insertAdjacentElement('afterbegin', canv);
    }

    deleteCanvas() {
        this.container.removeChild(this.canvas);
        if (this.overlayCanvas) {
            this.container.removeChild(this.overlayCanvas);
        }
    }

    createOverlayCanvas() {
        const container = document.getElementById(this.selector);
        const canv = document.createElement('canvas');

        canv.setAttribute('width', String(this.width));
        canv.setAttribute('height', String(this.height));
        canv.setAttribute('class', 'bubbles-field-plugin-overlay-canvas');

        const context = canv.getContext('2d');

        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.fillRect(0, 0, this.width, this.height);
        container.insertAdjacentElement('beforeend', canv);
        this.overlayCanvas = canv;
    }

    _keydownHandler = event => {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }

    _keyupHandler = event => {
        if (event.code === 'Space') {
            event.preventDefault();
            if (this.paused) { this.play() } else { this.pause() }
        }
    }

    attachKeysBindings() {
        document.addEventListener('keydown', this._keydownHandler);
        document.addEventListener('keyup', this._keyupHandler);
    }

    removeKeysBindings() {
        document.removeEventListener('keydown', this._keydownHandler);
        document.removeEventListener('keyup', this._keyupHandler);

    }

    pause() {
        clearTimeout(this.clockId);
        clearInterval(this._checkFieldTimer);
        this.paused = true;
    }

    play() {
        this.paused = false;
        this.tick();
    }

    tick() {
        const ctx = this.canvasContext;
        const foundCollisions = {};
        let collisionFound = false;

        this.clockId = setTimeout(this.tick, REND_INTERVAL);
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        this.bubbles.forEach((bubble, i) => {

            if (this.mode === SLOWING_MODE)
                bubble.velocity *= 0.995;

            if (i in foundCollisions) {
                bubble.draw();
                bubble.move(DMOVEMENT);
                return;
            }

            const newposition = bubble.newposition(DMOVEMENT);

            const willCollideTo = this.bubbles.findIndex(ex => {
                if (ex === bubble) return false;
                try{
                    return this.checkTwoCollision(bubble, ex, newposition);
                } catch(e) {
                    console.error(e);
                    return false;
                }
                
            });

            if (willCollideTo > -1) {
                foundCollisions[willCollideTo] = 1;
                collisionFound = true;
                this.handleBubblesCollision(i, willCollideTo);
                if (this.mode === SLOWING_MODE){
                    bubble.velocity = 1;
                    this.bubbles[willCollideTo].velocity = 1;
                }
                bubble.draw();
            } else {
                bubble.draw();
                bubble.move(DMOVEMENT);
            }  

        });

        this.checkWallCollisions();
        if (process.env.NODE_ENV === 'development') {
            if (this.pauseOnTouch && collisionFound) this.pause();
        }
        
    }

    checkFieldForSleep() {
        if (this.paused) return;
        const sum = this.bubbles.reduce((s, bubble) => s + bubble.velocity, 0);

        if (sum < this.bubbles.length * 0.1) {
            const half = Math.floor((this.bubbles.length / 2)) || 1;

            for (let i = 0; i < half; i++) {
                this.bubbles[i].velocity = 1;
            }
        }
    }

    checkWallCollisions() {
        const { height, width } = this;


        this.bubbles.forEach(bubble => {
            if (bubble.velocity === 0) return;
            const { position, radius, direction } = bubble;
            const { PI } = Math;
            let newDirection = undefined;

            const leftTouched   = position[0] - radius <= 0      ? LBIT : 0;
            const topTouched    = position[1] - radius <= 0      ? TBIT : 0;
            const rightTouched  = position[0] + radius >= width  ? RBIT : 0;
            const bottomTouched = position[1] + radius >= height ? BBIT : 0;

            const touchformula = topTouched | bottomTouched | leftTouched | rightTouched;
            
            switch (touchformula) {
                case 0b1010:        //
                case 0b1001:        // if touches 
                case 0b0110:        // angles
                case 0b0101:        //
                    newDirection = direction - PI;
                    break;
                case TBIT:
                case BBIT:
                    newDirection = PI2 - direction;
                    break;
                case LBIT:
                case RBIT:
                    newDirection = PI - direction;
                    break;
                default:
                    break;
            }

            if (touchformula === TBIT && (direction < PI || direction > PI2 )) {
                return;
            }

            if (touchformula === LBIT && (direction < PId2 || direction > PI3d2)) {
                return;
            }

            if (touchformula === BBIT && direction > PI) {
                return;
            }

            if (touchformula === RBIT && direction > PId2 && direction < PI3d2) {
                return;
            }

            if (!isNaN(newDirection)) {
                //console.log(`Wall touch, from: ${direction} to: ${newDirection}, position: [${bubble.x}, ${bubble.y}]`)
                bubble.touch(direction);
                bubble.direction = newDirection;
            } 
        });
    }

    /**
     * Checks if the first parameter with new position will collide to second  
     * @param {Bubble} b1
     * @param {Bubble} b2 
     * @return {boolean|number} value if two collide
     */
    checkTwoCollision(b1, b2, newposition) {
        const radsum = b1.radius + b2.radius;
        const dx = b2.x - newposition[0];
        const dy = b2.y - newposition[1];

        if (Math.abs(dx) > radsum || Math.abs(dy) > radsum) return false;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radsum) return dist;
    }

    /**
     * 
     * @param {number} i 
     * @param {number} j 
     * @returns {boolean}
     */
    handleBubblesCollision(i, j) {
        const { bubbles, mode } = this;
        const { cos, sin, atan2 } = Math;
        const fbubble = bubbles[i]; /**  @type{Bubble} */
        const sbubble = bubbles[j]; /**  @type{Bubble} */
        
        if (fbubble === undefined || sbubble === undefined) throw new Error('Incorrect bubbles indexes');

        let deflection = atan2(sbubble.position[1] - fbubble.position[1],
            sbubble.position[0] - fbubble.position[0]);
        

        /** dd is a Y scale in a corrected system */
        let dd = deflection < 0 ? (PI2 + deflection) : deflection;

        dd = (PId2 - dd);
    
        const fdircorrected = (fbubble.direction + dd) % PI2;
        const sdircorrected = (sbubble.direction + dd) % PI2;

//        console.log(`Corrected: ${radToDeg(fdircorrected)}, ${radToDeg(sdircorrected)}`)

        const fxdef = cos(fdircorrected), fydef = sin(fdircorrected); // deflections of bubbles directions
        const sxdef = cos(sdircorrected), sydef = sin(sdircorrected); // relatively to new basis

        // Projections on new basis
        // 
        const fdx = fbubble.velocity * fxdef; // dx = |U| * sin(first bubble deflection) 
        const fdy = fbubble.velocity * fydef; // dy = |U| * cos(first bubble deflection)
        const sdx = sbubble.velocity * sxdef; // The same 
        const sdy = sbubble.velocity * sydef; // for second bubble

        // New movement vectors are calculated of two dimensions - X and Y
        // Bubbles exchange Y components, X components still the same for both bubbles

        let newdeflectionf = atan2(sdy, fdx);
        let newdeflections = atan2(fdy, sdx);

        newdeflectionf -= dd;
        newdeflections -= dd;

        if (mode === GAS_MODE) {
            // Here we calculate new velocities
            const { u1, u2 } = this.getPostCollisionVelocities(fbubble, sbubble, fbubble.directionGrad, sbubble.direction, dd);
            //console.log(`New velocities: ${u1}, ${u2}, energy sum: ${(u1 * u1 / 2 + u2 * u2 / 2)}`);
            fbubble.velocity = u1;
            sbubble.velocity = u2;    
        } else if (mode === SLOWING_MODE) {
            fbubble.velocity = 1;
            sbubble.velocity = 1;
        }

        fbubble.touch(deflection);
        sbubble.touch(deflection + Math.PI);

        //this._drawDeflectionAngle(fbubble, sbubble, deflection);

        fbubble.direction = newdeflectionf;
        sbubble.direction = newdeflections;

        //console.log(`Collision handling: [${i}(${fbubble.x}:${fbubble.y}, ${round(radToDeg(fdirection))}) - ${j}(${sbubble.x}:${sbubble.y}, ${round(radToDeg(sdirection))})]. New directions: [${round(fbubble.directionGrad)}, ${round(sbubble.directionGrad)}]`);
        return true;
    }

    /**
     * 
     * @param {Bubble} b1 
     * @param {Bubble} b2 
     * @param {number} theta1 deflection angle of the first ball' move
     * @param {number} theta2 deflection angle of the second ball' move
     * @param {number} phi deflection angle of the line connecting centers of both bubbles
     * @returns {Object}
     */
    getPostCollisionVelocities(b1, b2, theta1, theta2, phi) {
        // Took formulas from https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional
        const { sin, cos, sqrt } = Math;

        const ux1 = b2.velocity * cos(theta2 - phi) * cos(phi) + b1.velocity *
            sin(theta1 - phi) * cos(phi + PId2);
        
        const uy1 = b2.velocity * cos(theta2 - phi) * sin(phi) + b1.velocity *
            sin(theta1 - phi) * sin(phi + PId2);

        const ux2 = b1.velocity * cos(theta1 - phi) * cos(phi) + b2.velocity *
            sin(theta2 - phi) * cos(phi + PId2);
        
        const uy2 = b1.velocity * cos(theta1 - phi) * sin(phi) + b2.velocity *
            sin(theta2 - phi) * sin(phi + PId2);

        const u1 = sqrt(ux1 * ux1 + uy1 * uy1);
        const u2 = sqrt(ux2 * ux2 + uy2 * uy2);

        return { u1, u2 };
    }

    /**
     * 
     * @param {Bubble} fbubble 
     * @param {Bubble} sbubble 
     * @param {number} deflection
     */
    _drawDeflectionAngle(fbubble, sbubble, deflection) {
        const ctx = this.canvasContext;
        const radsum = fbubble.radius + sbubble.radius;
        const x = fbubble.x + radsum * Math.cos(deflection);
        const y = fbubble.y + radsum * Math.sin(deflection);
        
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(fbubble.x, fbubble.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillText('1', fbubble.x, fbubble.y);
        ctx.fillText('2', x, y);
        console.log(getAngleQuarter(deflection), radToDeg(deflection))
    }

    /**
     * 
     * @param {number|string} count 
     * @param {number|string} radius
     * @param {string|Array} color
     */
    placeBubbles(count, radius, color) {
        let i = 0, RGBcolor = null;

        count = Number(count);
        if (isNaN(count)) throw new TypeError("Invalid value passed to the count parameter");
        
        radius = Number(radius);
        if (isNaN(radius)) throw new TypeError("Invalid value passed to the radius parameter");
        

        if (typeof color === 'string') {
            RGBcolor = PRESET_COLORS[color.toUpperCase()];
        } else if (Array.isArray(color)) {
            RGBcolor = new RGB(color[0] || 0, color[1] || 0, color[2] || 0);
        }

        while (i < count) {            
            const position = findEmptyPosition(radius, this);
            if (position === undefined) break;
            this.bubbles.push(new Bubble(this.canvasContext, this.bubbleStyle, radius, position, getRandomInt(0, 2 * Math.PI), RGBcolor, this.mode, '', this.drawSparkles));     
            i++;
        }
    }

    /** Calculates energies for bubbles with everyone has mass equal 1 and starting velocity equal 1 */
    __showEnergySum() {
        const startSum = this.bubbles.length;
        const currentSum = this.bubbles.reduce((sum, bubble) => sum + bubble.velocity * bubble.velocity, 0);

        console.log(`Kinetic energy before start: ${startSum}. Now: ${currentSum}`);
    }
}

const findEmptyPosition = (radius, field)  => {
    const { height, width, bubbles } = field;

    const left = radius;
    const right = width - radius;
    const top = radius;
    const bottom = height - radius;
    let result = undefined;

    for (let i = 10; i--; i > 0) {
        const nx = getRandomInt(left, right);
        const ny = getRandomInt(top, bottom);

        const intersecting = bubbles.findIndex(bubble => {
            return Math.sqrt(Math.pow(bubble.x - nx, 2) + Math.pow(bubble.y - ny, 2)) <= (radius + bubble.radius);
        });
        if (intersecting === -1) {
            result = [nx, ny];
            break;
        }
    }

    return result;
}

if (process.env.NODE_ENV === 'production') {
    window.FloatingOrbsPlugin = Field;
}

export default Field;
