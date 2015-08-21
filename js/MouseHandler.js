/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function MouseHandler($dom) {

  this._$dom = $dom;

  this._position = {x: 0, y: 0};
  this._movement = {x: 0, y: 0};
  this._dragging = false;

  this._onMouseMoveCallback = this._onMouseMove.bind(this);
  this._onMouseDownCallback = this._onMouseDown.bind(this);
  this._onMouseUpCallback = this._onMouseUp.bind(this);

  this.attach();
}

MouseHandler.prototype = {

  constructor: MouseHandler,

  attach: function() {

    this._$dom.mousemove(this._onMouseMoveCallback);
    this._$dom.mousedown(this._onMouseDownCallback);
    this._$dom.mouseup(this._onMouseUpCallback);
  },

  detach: function() {

    this._$dom.off('mousemove', this._onMouseMoveCallback);
    this._$dom.off('mousedown', this._onMouseDownCallback);
    this._$dom.off('mouseup', this._onMouseUpCallback);
  },

  _onMouseMove: function(e) {

    var x = e.pageX - this._$dom.offset().left;
    var y = e.pageY - this._$dom.offset().top;

    this._movement.x = x - this._position.x;
    this._movement.y = y - this._position.y;

    this._position.x = x;
    this._position.y = y;
  },

  _onMouseDown: function() { this._dragging = true; },
  _onMouseUp: function() { this._dragging = false; },

  get x() { return this._position.x; },
  get y() { return this._position.y; },

  get dx() { return this._movement.x; },
  get dy() { return this._movement.y; },

  get dragging() { return this._dragging; }
};