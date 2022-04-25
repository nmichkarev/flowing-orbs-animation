import './scss/index.scss';
import Field from './classes/field';

const ballsopts = [{ radius: 5, color: 'red', count: 100 }, { radius: 5, color: 'blue', count: 100 }, , { radius: 5, count: 200 }];

/* different examples
//const bubblesField = new Field('bubbles', { mode: 'gas', particles: ballsopts, overlay: false, drawSparkles: false, particleStyle: 'vibrating' });
//const bubblesField = new Field('bubbles', {overlay: true, drawBorder: false});
*/

const bubblesField = new Field('bubbles', { 
    height: 510,
    width: 1300,
    mode: 'gas', 
    particles: ballsopts, 
    overlay: false,
    drawBorder: false,
    drawSparkles: false,
    particleStyle: 'filled'
}); 


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