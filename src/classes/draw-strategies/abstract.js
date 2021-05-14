class AbstractDrawStrategy {
    /**
     * 
     * @param {CanvasRenderingContext2D} canvasCtx 
     * @param {Bubble} bubble 
     */
    constructor(canvasCtx, bubble) {
        if (this.constructor === AbstractDrawStrategy) {
            throw new TypeError('Can not create object of abstract class');
        }

        if (this.draw === AbstractDrawStrategy.prototype.draw) {
            throw new TypeError('Implement draw method');
        }
        
        this.ctx = canvasCtx;
        this.bubble = bubble;
    }

    draw() {
        throw new TypeError('Don\'t call abstract draw method');
    }
}

export default AbstractDrawStrategy;
