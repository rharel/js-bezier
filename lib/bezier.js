/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

(function() {
  function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Vector2.fromObject = function(p) { return new Vector2(p.x, p.y); };

  Vector2.prototype = {
    constructor: Vector2,

    min: function() { return new Vector2(-this.x, -this.y); },

    add: function(other) {
      return new Vector2(this.x + other.x, this.y + other.y);
    },
    addS: function(scalar) {
      return new Vector2(this.x + scalar, this.y + scalar);
    },

    sub: function(other) { return this.add(other.min()); },
    subS: function(scalar) { return this.addS(-scalar); },

    mul: function(other) {
      return new Vector2(this.x * other.x, this.y * other.y);
    },
    mulS: function(scalar) {
      return new Vector2(this.x * scalar, this.y * scalar);
    },

    dot: function(other) {
      return this.x * other.x + this.y * other.y;
    },

    angle: function(other) {
      return Math.acos(this.dot(other) / (this.length * other.length));
    },

    get length2() { return this.dot(this); },
    get length() { return Math.sqrt(this.length2); }
  };


  function Curve(points) {
    points = points || [];

    var self = this;
    self._controlPoints = [];
    points.forEach(function(p) {
      self.add(p.x, p.y);
    });
  }

  Curve.prototype = {
    constructor: Curve,

    add: function(x, y) {
      var p = new Vector2(x, y);
      this._controlPoints.push(p);
      return p;
    },

    clear: function() { this._controlPoints = []; },

    at: function(t) {
      if (this.complexity === 0) { return null; }
      else if (this.complexity === 1) { return this._controlPoints[0]; }
      else {
        var shell = this.getShellAt(t);
        return shell[shell.length - 1][0];
      }
    },

    getSkeleton: function(t0, t1, precision) {
      if (isNaN(+t0)) { t0 = 0; }
      else { t0 = Math.min(Math.max(+t0, 0), 1); }
      if (isNaN(+t1)) { t1 = 1; }
      else { t1 = Math.min(Math.max(+t1, 0), 1); }
      precision = precision || 0.01;

      var self = this;
      var pack = function(t) {
        var p = self.at(t);
        return {x: p.x, y: p.y, t: t};
      };

      if (this.complexity === 0 || t1 < t0 || t1 === 0) { return []; }
      else if (this.complexity === 1) { return [pack(0)]; }
      else {
        var skeleton = [];
        for (var t = t0; t < t1; t += precision) { skeleton.push(pack(t)); }
        skeleton.push(pack(t1));
        return skeleton;
      }
    },

    getShellAt: function(t) {
      if (this.complexity === 0) { return []; }

      t = Math.min(Math.max(t, 0), 1);
      var shell = [this._controlPoints];
      var topLayer = shell[0];
      while (topLayer.length > 1) {
        var newLayer = [];
        for (var i = 1; i < topLayer.length; ++i) {
          newLayer[i - 1] =
            topLayer[i].mulS(t).add(
              topLayer[i - 1].mulS(1 - t));
        }
        shell.push(newLayer);
        topLayer = newLayer;
      }
      return shell;
    },

    getControlPoint: function(i) {
      return this._controlPoints[i];
    },

    get complexity() { return this._controlPoints.length; }
  };


  if (typeof module !== 'undefined' && module.exports) {
    module.exports.Curve = Curve;
  }
  else {
    window.Bezier = {
      Curve: Curve,
      Vector2: Vector2
    };
  }
})();
