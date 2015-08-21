/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function ShellLayer(_2d, curve) {

  this._curve = curve;

  this._2d = _2d;
  this._layer = new Layer(_2d);

  this._palette = [];
  this._opacity = 0.5;

  this._lineWidth = 5;

  this._t = 0;
}

ShellLayer.prototype = {

  constructor: ShellLayer,

  _newSegment: function(a, b, color) {

    var segment = this._2d.makeLine(a.x, a.y, b.x, b.y);

    segment.stroke = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
    segment.opacity = this._opacity;
    segment.linewidth = this._lineWidth;

    return segment;
  },

  clear: function() {
    this._layer.clear();
  },

  generatePalette: (function() {

    function randomChannelMix(base) {
      return Math.floor((Math.random() * 256 + base) / 2);
    }

    function randomColor() {

      return {
        r: randomChannelMix(100),
        g: randomChannelMix(100),
        b: randomChannelMix(255)
      };
    }

    return function() {

      if (this._curve.complexity <= 2) { return; }

      this._palette = [];
      for (var i = 0; i < this._curve.complexity; ++i) {
        this._palette.push(randomColor());
      }
    };

  })(),

  update: function() {

    if (this._curve.complexity !== this._palette.length) {
      this.generatePalette();
    }

    this.t = this.t;
  },

  get t() { return this._t; },
  set t(t) {

    this._layer.clear();

    if (this._curve.complexity <= 2) { return; }

    var colorIndex = 0;
    var layers = this._curve.shell(t);
    var self = this;

    layers.forEach(function(vertices) {

      var layerColor = self._palette[colorIndex++];

      for (var i = 1; i < vertices.length; ++i) {

        self._layer.add(
          self._newSegment(vertices[i - 1], vertices[i], layerColor));
      }
    });
  },

  get visible() { return this._layer.visible; },
  set visible(value) { this._layer.visible = value; }
};