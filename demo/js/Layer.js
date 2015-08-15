/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function Layer(_2d) {
  this._group = _2d.makeGroup();
  this._children = [];
  this._visible = true;
}

Layer.prototype = {
  constructor: Layer,

  add: function(graphic) {
    this._children.push(graphic);
    this._group.add(graphic);
  },

  clear: function() {
    var self = this;
    self._children.forEach(function(c) {
      self._group.remove(c);
    });
    self._children = [];
    self.visible = true;
  },

  setRange: function(start, end, prop, value) {
    for (var i = start; i < end; ++i) {
      this._children[i][prop] = value;
    }
  },

  get visible() { return this._visible; },
  set visible(value) {
    this._visible = value;
    this._group.opacity = +value;
  }
};