/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function ControlPointsView(curve, $domElement, _2d) {
  this._curve = curve;

  this._$domElement = $domElement;

  this._2d = _2d;
  this._layer = new Layer(_2d);

  this._pointLimit = 10;
  this._points = [];
  this._selected = null;

  this._additionCallbacks = [];
  this._dragStartCallbacks = [];
  this._dragCallbacks = [];
  this._dragStopCallbacks = [];
}

ControlPointsView.prototype = {
  constructor: ControlPointsView,

  onAddition: function(callback) {
    this._additionCallbacks.push(callback);
  },

  onDragStart: function(callback) {
    this._dragStartCallbacks.push(callback);
  },

  onDragStop: function(callback) {
    this._dragStopCallbacks.push(callback);
  },

  onDrag: function(callback) {
    this._dragCallbacks.push(callback);
  },

  _invoke: function(callbacks) {
    callbacks.forEach(function(f) { f(); });
  },

  onResize: function(w, h) {
    this._points.forEach(function(p) {
      p.onParentResize(w, h);
    });
  },

  add: function(x, y) {
    var model = this._curve.add(x, y);
    var p = new ControlPoint(model, this._2d, {
      width: this._$domElement.width(),
      height: this._$domElement.height()
    });
    this._layer.add(p.graphic);
    this._points.push(p);
    this._invoke(this._additionCallbacks);
  },

  clear: function() {
    this._layer.clear();
    this._points = [];
  },

  onMouseMove: function(mouse) {
    if (!this._layer.visible) { return; }
    if (mouse.dragging) {
      this._handleDrag(mouse.dx, mouse.dy);
    }
    else {
      this._handleHover(mouse.x, mouse.y);
    }
  },

  _handleHover: function(x, y) {
    if (this._selected !== null && !this._selected.contains(x, y)) {
      this._selected.onMouseExit();
      this._selected = null;
    }
    var i = 0;
    while (i < this._points.length && this._selected === null) {
      var p = this._points[i];
      if (p.contains(x, y)) {
        p.onMouseEnter();
        this._selected = p;
      }
      ++i;
    }
  },

  _handleDrag: function(dx, dy) {
    if (this._selected !== null) {
      this._selected.moveBy(dx, dy);
      this._invoke(this._dragCallbacks);
    }
  },

  onMouseDown: function() {
    if (!this._layer.visible) { return; }

    if (this._selected !== null) {
      this._selected.onDragStart();
      this._invoke(this._dragStartCallbacks);
    }
  },

  onClick: function(mouse) {
    if (!this._layer.visible) { return; }

    if (this._selected === null && this.size < this._pointLimit) {
      this.add(mouse.x, mouse.y);
    }
    else if (this._selected !== null) {
      this._selected.onDragStop();
      this._invoke(this._dragStopCallbacks)
    }
  },

  get size() { return this._points.length; },
  get layer() { return this._layer; }
};