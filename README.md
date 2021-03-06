[![Build Status](https://travis-ci.org/rharel/js-bezier.svg)](https://travis-ci.org/rharel/js-bezier)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com)

## What is this?

Yet another bezier-curve library! Please view the demo [here](http://rharel.github.io/js-bezier/).

## Installation

Install via bower: `bower install rharel/js-bezier`

The `dist/` directory contains both a normal (`bezier.js`) as well as a minified version of the library (`bezier.min.js`).
Include in the browser using `<script src="bezier.min.js"></script>`

## Usage

### Create
```javascript
var controlPoints = [{x: 0, y: 0}, {x: 1, y: 1}];
var c = new Bezier.Curve(controlPoints);
c.complexity;  // 2
```
### Evaluate
```javascript
var controlPoints = [{x: 0, y: 0}, {x: 1, y: 1}];
var c = new Bezier.Curve(controlPoints);
c.at(0);  // {x: 0, y: 0, t: 0}
c.at(1);  // {x: 1, y: 1, t: 1}
c.at(0.5);  // {x: 0.5, y: 0.5, t: 0.5}
```

### Draw
```javascript
var controlPoints = [{x: 0, y: 0}, {x: 1, y: 1}];
var c = new Bezier.Curve(controlPoints);
var s = c.outline(t0 = 0, t1 = 1, precision = 0.5);
/**
 * s === [
 * 	{x: 0, y: 0, t: 0},
 * 	{x: 0.5, y: 0.5, t: 0.5},
 * 	{x: 1, y: 1, t: 1}
 * ]
 */
```

## License

This software is licensed under the **MIT License**. See the [LICENSE](LICENSE.txt) file for more information.
