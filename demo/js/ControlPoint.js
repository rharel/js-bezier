/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function ControlPoint(model, _2d, parentSize) {
  this.model = model;

  this.defaultColor = 'dodgerblue';
  this.dragColor = 'lightblue';

  this.graphic = _2d.makeCircle(model.x, model.y, 15);
  this.graphic.fill = 'black';
  this.graphic.linewidth = 0;
  this.graphic.fill = this.defaultColor;

  this._relativePosition = {
    x: this.getX() / parentSize.width,
    y: this.getY() / parentSize.height
  };

  this.hoverScale = 2;
  this.hoverAnimationSpeed = 100;
  this.haloRadius =
    this.graphic.getBoundingClientRect().width / 2 * this.hoverScale;

  this._mouseEnterAnimation =
    new TWEEN.Tween(this.graphic)
      .to({scale: this.hoverScale}, this.hoverAnimationSpeed)
      .easing(TWEEN.Easing.Cubic.In);
  this._mouseExitAnimation =
    new TWEEN.Tween(this.graphic)
      .to({scale: 1}, this.hoverAnimationSpeed)
      .easing(TWEEN.Easing.Cubic.In);
}

ControlPoint.prototype = {
  constructor: ControlPoint,

  onParentResize: function(w, h) {
    this.setX(w * this._relativePosition.x);
    this.setY(h * this._relativePosition.y);
  },

  moveBy: function(dx, dy) {
    this.setX(this.getX() + dx);
    this.setY(this.getY() + dy);
  },

  contains: function(x, y) {
    return (
      Math.sqrt(
        Math.pow(x - this.getX(), 2) +
        Math.pow(y - this.getY(), 2)) < this.haloRadius
    );
  },

  onMouseEnter: function() {
    this._mouseExitAnimation.stop();
    this._mouseEnterAnimation.start();
  },
  onMouseExit: function () {
    this._mouseEnterAnimation.stop();
    this._mouseExitAnimation.start();
  },

  onDragStart: function() {
    this.setColor(this.dragColor);
  },
  onDragStop: function() {
    this.setColor(this.defaultColor);
  },

  getX: function() { return this.graphic.translation.x; },
  setX: function(value) {
    this.graphic.translation.x = value;
    this.model.x = value;
  },

  getY: function() { return this.graphic.translation.y; },
  setY: function(value) {
    this.graphic.translation.y = value;
    this.model.y = value;
  },

  getColor: function() { return this.graphic.fill; },
  setColor: function(value) { this.graphic.fill = value; }
};
