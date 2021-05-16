import './scss/index.scss';
import Field from './classes/field';

const ballsopts = [{ radius: 20, color: 'red', count: 10 }, { radius: 20, color: 'blue', count: 5 }, , { radius: 40, color: [0, 128, 0], count: 3 }];
//const bubblesField = new Field('bubbles', { mode: 'gas', particles: ballsopts, overlay: false, drawSparkles: false, particleStyle: 'vibrating' });
//const bubblesField = new Field('bubbles', {overlay: true, drawBorder: false});
 const bubblesField = new Field('bubbles', { 
    height: 400,
    width: 1000,
    mode: 'gas', 
    particles: ballsopts, 
    overlay: true, 
    drawSparkles: false,
    particleStyle: 'filled',
bubbleStyle: 'filled' }); 


window.bubblesField = bubblesField;
window.bubbles = bubblesField.bubbles;
bubblesField.init();

/*
    Bubbles field options:
    - mode: ('gas'|'slowing'|'default')
    - particles: (Object{radius: number, color: string|Array(3), count: number}
        |Array)
    - overlay: (true|false)
    - className: string
    - width: number (default: 1000)
    - height: number (default: 400)
    - drawSparkles: (true|false)
    - particleStyle: ('filled'|'vibrating'|'stroked'|'gradient'|'satellite')
*/