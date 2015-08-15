/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function SkeletonView(curve, precision, _2d) {
  this._curve = curve;
  this.precision = precision || 0.01;

  this._2d = _2d;
  this._layer = new Layer(_2d);
  this._partialSegment = null;

  this._vertices = [];
  this._prevTime = 0;
}

SkeletonView.prototype = {
  constructor: SkeletonView,

  _newSegment: function(a, b) {
    var segment = this._2d.makeLine(a.x, a.y, b.x, b.y);
    segment.stroke = 'black';
    segment.linewidth = 5;
    segment.opacity = 0;
    return segment;
  },

  recompute: function() {
    this._layer.clear();
    this._vertices = this._curve.getSkeleton(0, 1, this.precision);
    for (var i = 1; i < this._vertices.length; ++i) {
      this._layer.add(
        this._newSegment(this._vertices[i - 1], this._vertices[i])
      );
    }
    this._prevTime = 0;
  },

  setTime: function(t) {
    if (this._partialSegment !== null) {
      this._partialSegment.remove();
      this._partialSegment = null;
    }
    if (this._vertices.length < 2) { return; }

    var dt = t - this._prevTime;
    if (dt === 0) { return; }

    var n = this._vertices.length - 1;
    var i = Math.floor(n * this._prevTime);
    var j = Math.floor(n * t);
    if (dt > 0) {
      this._layer.setRange(i, j, 'opacity', 1);
    }
    else {
      this._layer.setRange(j, i, 'opacity', 0);
    }

    var d = (t - this._vertices[j].t) / this.precision;
    if (d > 0) {
      var a = Bezier.Vector2.fromObject(this._vertices[j]);
      var b = Bezier.Vector2.fromObject(this._vertices[j + 1]);
      this._partialSegment = this._newSegment(
        a, a.add(b.sub(a).mulS(d))
      );
      this._partialSegment.opacity = 1;
      this._layer.add(this._partialSegment);
    }

    this._prevTime = t;
  }
};