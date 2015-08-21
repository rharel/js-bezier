/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function OutlineLayer(_2d) {

  this._2d = _2d;

  this._layer = new Layer(_2d);
  this._layer.style.stroke = 'black';

  this._partialSegment = null;

  this._outline = [];
  this._precision = 0;
  this._t = 0;
}

OutlineLayer.prototype = {

  constructor: OutlineLayer,

  _newSegment: function(a, b) {

    var segment = this._2d.makeLine(a.x, a.y, b.x, b.y);
    segment.linewidth = 5;
    segment.opacity = 0;

    return segment;
  },

  clear: function() {

    this._layer.clear();
    this._t = 0;
  },

  update: function(outline) {

    this._layer.clear();

    this._outline = outline;

    if (outline.length > 1) {
      this._precision = outline[1].t - outline[0].t;
    }

    for (var i = 1; i < this._outline.length; ++i) {

      this._layer.add(
        this._newSegment(this._outline[i - 1], this._outline[i])
      );
    }

    var saved = this.t;
    this.t = 0;
    this.t = saved;
  },

  get t() { return this._t; },
  set t(t) {

    if (this._partialSegment !== null) {

      this._partialSegment.remove();
      this._partialSegment = null;
    }

    if (this._outline.length < 2) { return; }

    var dt = t - this._t;
    if (dt === 0) { return; }

    var n = this._outline.length - 1;
    var i = Math.floor(n * this._t);
    var j = Math.floor(n * t);

    if (dt > 0) {
      this._layer.setRange(i, j, 'opacity', 1);
    }
    else {
      this._layer.setRange(j, i, 'opacity', 0);
    }

    var d = (t - this._outline[j].t) / this._precision;

    if (d > 0) {

      var a = Bezier.Vector2.fromObject(this._outline[j]);
      var b = Bezier.Vector2.fromObject(this._outline[j + 1]);

      this._partialSegment = this._newSegment(
        a, a.add(b.sub(a).mulS(d))
      );
      this._partialSegment.opacity = 1;

      this._layer.add(this._partialSegment);
    }

    this._t = t;
  }
};