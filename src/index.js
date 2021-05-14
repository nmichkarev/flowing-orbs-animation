import './scss/index.scss';
import Field from './classes/field';

const ballsopts = [{ radius: 20, color: 'red', count: 10 }, { radius: 20, color: 'blue', count: 5 }, , { radius: 20, color: [0, 128, 0], count: 5 }];
const bubblesField = new Field('bubbles', { mode: 'gas', particles: ballsopts, overlay: false, drawSparkles: false, bubbleStyle: 'default' });

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
    - bubbleStyle: ('filled'|'vibrating'|'stroked'|'gradient'|'satellite')
*/