![Plugin Logo](https://github.com/nmichkarev/flowing-orbs-animation/blob/readme-files/images/title.png?raw=true)
# flowing-orbs-animation plugin
Canvas animation representing movement of colliding orbs. 
## Installation
```
npm run build
```
Copy /dist/plugin.js to js-directory on your site, insert
```
<script src="plugin.js"></script>
```
in your html. It will add a new option FloatingOrbsPlugin to your window object.

## Usage
Create a div element in your markup. Define an id attribure for it. Then create a bubbles field using constructor.
```
const orbsField = new FloatingOrbsPlugin('div-id', options);
orbsField.init();
```
![Example of run](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/initial.gif?raw=true)
### Options
As second argument should be passed an object consisting of next properties. Every field is optional.
Name | Value | Default
-----|-------|--------
width | **number** | 400
height | **number** | 1000
className | **string** | 'bubbles-field-plugin'
mode | 'gas'\|'slowing'\|'default' | 'default'
particles | \*{ radius: **number**, color: **string**\|\[**number**, **number**, **number**\], count: **number** }\|Array[\*] | 20 particles with radius 10px and random color
particleStyle | 'default'\|'filled'\|'stroked'\|'vibrating'\|'satellite' | 'default'
drawSparkles | **true**\|**false** | **false**
overlay | **true**\|**false** | **false**
drawBorder | **true**\|**false** | **false**

### Options described
1. width - sets the width of canvas. Should be a number.
2. height - height of canvas. Should be a number.
3. className - class name that will be assigned to container, specified in first parameter of connstructor. If you want to add own class to predefined, push string concatenated of your class name and 'bubbles-field-plugin'
4. mode - movement mode of particles. 
- 'default': velocities of particles are constant.
![Default movement mode](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/mode-default.gif?raw=true)
- 'gas': velocities change after collisions due to physical rules of ellastic collision.
![Gas movement mode](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/mode-gas.gif?raw=true)
- 'slowing': velocities constantly slow down until collision, after that velocities of collided particles return back to normal. If everyone stops, particles get small impulse.
![Slowing movement mode](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/mode-slowing.gif?raw=true)
5. particles - defines parameters of particles. One or more sets can be pulled. If here's only one set, object can be passed. Every set consists of
- count: number of particles
- radius: radius of particles
- color: optional. Can be a string of 'red', 'blue', 'green' or array of 3 numbers, representing color in rgb notation [255, 255, 255] for white, for example. Makes sense for 'filled' and 'stroked' particleStyle options.
6. particleStyle
- 'default': draws simple line as in examples above.
- 'filled': particles are filled. If color is not passed in parameters, the random color gets created for each particle.
![Filled style](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/style-filled.gif?raw=true)
- 'stroked': outer part filled more opaque than inner.
![Stroked style](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/style-stroked.gif?raw=true)
- 'vibrating': distortions appear after collisions and fall off
![Vibration style](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/style-vibro.gif?raw=true)
- 'satellite':     
![Satellite style](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/style-satellite.gif?raw=true)
7. drawSparkles - true/false. If true, sparkles will be created after collisions
![Sparkles](https://github.com/nmichkarev/flowing-particless-animation/blob/readme-files/images/sparkles.gif?raw=true)
8. overlay - true/false. If true, will be added translucent white canvas above to make it milder. So you can place it under some content(additional css styles can be required).
9. drawBorder - true/false. If true, draws ordinary black border around canvas. 



