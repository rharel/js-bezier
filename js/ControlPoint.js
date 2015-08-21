/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function ControlPoint(_2d, model, w, h) {

  this._model = model;

  this._radius = 15;

  this._2d = _2d;

  this._graphic = _2d.makeCircle(model.x, model.y, this._radius);
  this._graphic.linewidth = 0;
  this._graphic.fill = 'dodgerblue';

  this._relativePosition = {
    x: this.x / w,
    y: this.y / h
  };
}

ControlPoint.prototype = {

  constructor: ControlPoint,

  update: function(w, h) {

    this.x = this._relativePosition.x * w;
    this.y = this._relativePosition.y * h;
  },

  contains: function(x, y) {
    return (
      Math.sqrt(
        Math.pow(x - this.x, 2) +
        Math.pow(y - this.y, 2)) < this._radius
    );
  },

  get graphic() { return this._graphic; },

  get x() { return this._model.x; },
  set x(value) {

    this._model.x = value;
    this._graphic.translation.x = value;
  },

  get y() { return this._model.y; },
  set y(value) {

    this._model.y = value;
    this._graphic.translation.y = value;
  },

  get color() { return this.graphic.fill; },
  set color(value) {

    this.graphic.fill = value;
    this._2d.update();
  }
};
