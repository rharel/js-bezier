/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function Plot($dom) {

  this._$dom = $dom;

  this._2d = new Two({

    type: Two.Types.svg,
    domElement: $dom[0]
  });

  this._curve = new Bezier.Curve();
  this._precision = 0.01;
  this._t = 0;

  this._controlPoints = [];

  this._outlineLayer = new OutlineLayer(this._2d);
  this._shellLayer = new ShellLayer(this._2d, this._curve);
  this._controlLayer = new Layer(this._2d);
}

Plot.prototype = {

  constructor: Plot,

  refresh: function() {

    this._outlineLayer.update(this._curve.outline(0, 1, this._precision));
    this._shellLayer.update();
    this._2d.update();
  },

  render: function() {
    this._2d.update();
  },

  resize: function(w, h) {

    this._controlPoints.forEach(function(p) {
      p.update(w, h);
    });
  },

  clear: function() {

    this._curve.clear();

    this._controlPoints = [];

    this._controlLayer.clear();
    this._outlineLayer.clear();
    this._shellLayer.clear();

    this.refresh();
  },

  add: function(x, y) {

    var p = this._curve.add(x, y);
    var cp = new ControlPoint(
      this._2d, p,
      this._$dom.width(), this._$dom.height()
    );

    this._controlPoints.push(cp);
    this._controlLayer.add(cp.graphic);

    this.refresh();
  },

  pointCast: function(x, y) {

    for (var i = 0; i < this._controlPoints.length; ++i) {

      var cp = this._controlPoints[i];

      if (cp.contains(x, y)) { return cp; }
    }

    return null;
  },

  get precision() { return this._precision; },
  set precision(value) {

    this._precision = +value;
    this.refresh();
  },

  get t() { return this._t; },
  set t(value) {

    value = Math.max(Math.min(+value, 1), 0);

    this._t = value;
    this._outlineLayer.t = value;
    this._shellLayer.t = value;
    this._2d.update();
  },

  get control() { return this._controlLayer; },
  get outline() { return this._outlineLayer; },
  get shell() { return this._shellLayer; }
};