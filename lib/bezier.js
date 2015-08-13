/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/node-mutable-bezier
 */


function Vector2(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

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

  get length2() { return this.dot(this) },
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

  at: function(t) {
    if (this.degree === 0) { return null; }
    else if (this.degree === 1) { return this._controlPoints[0]; }
    else {
      var shell = this.getShellAt(t);
      return shell[shell.length - 1][0];
    }
  },

  getSkeleton: function(t0, t1, resolution, adaptive, adaptiveThreshold) {
    if (this.degree === 0) { return []; }
    else if (this.degree <= 2 || resolution > (t1 - t0)) {
      return this._controlPoints.slice();
    }
    t0 = Math.min(Math.max(t0, 0), 1);
    t1 = Math.min(Math.max(t1, 0), 1);
    resolution = resolution || 0.01;
    adaptive = adaptive || false;
    adaptiveThreshold = adaptiveThreshold || Math.PI / 20;

    var skeleton = [this.at(t0), this.at(t0 + resolution)];
    var adaptiveSkeleton = [skeleton[0]];
    var i = 0;
    for (var t = t0 + 2 * resolution; t < t1; t += resolution) {
      var c = this.at(t);
      skeleton.push(c);
      if (adaptive) {
        var a = skeleton[i];  // Lastly added
        var b = skeleton[i + 1];  // Ideal follow-up
        var ab = b.sub(a);
        var bc = c.sub(b);
        if (ab.angle(bc) >= adaptiveThreshold) {
          i = skeleton.length - 2;
          adaptiveSkeleton.push(skeleton[i]);
        }
      }
    }
    if (adaptive) {
      adaptiveSkeleton.push(this.at(t1));
      return adaptiveSkeleton;
    }
    else {
      skeleton.push(this.at(t1));
      return skeleton;
    }
  },

  getShellAt: function(t) {
    if (this.degree === 0) { return []; }

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

  get degree() { return this._controlPoints.length; },
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports.Curve = Curve;
}
else {
  window.Bezier = {
    Curve: Curve
  };
}
