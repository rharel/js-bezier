/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

var expect = require('chai').expect;

var Curve = require('../src/bezier').Curve;

describe('curve', function() {
  describe('default constructor', function() {
    var c;
    beforeEach('create a new curve', function() {
      c = new Curve();
    });

    it('should create an empty curve by default', function () {
      expect(c.complexity).to.be.equal(0);
    });
  });

  describe('array constructor', function() {
    var p, c;
    beforeEach('create curve from array', function() {
      p = [
        {x: 0, y: 1},
        {x: 2, y: 3},
        {x: 4, y: 5}
      ];
      c = new Curve(p);
    });

    it('should have the same complexity as the array\'s length', function() {
      expect(c.complexity).to.be.equal(p.length);
    });
    it('should populate control points from the array', function() {
      for (var i = 0; i < p.length; ++i) {
        var a = p[i];
        var b = c.controlPoint(i);
        expect(b.x).to.be.equal(a.x);
        expect(b.y).to.be.equal(a.y);
      }
    });
  });

  describe('control point addition', function() {
    var c, a, b, p, q;
    beforeEach('create curve and add points', function() {
      c = new Curve();
      a = {x: 0, y: 1};
      b = {x: 2, y: 3};

      p = c.add(a.x, a.y);
      q = c.add(b.x, b.y);
    });

    it('should return the new control point', function() {
      expect(p.x).to.be.equal(a.x);
      expect(p.y).to.be.equal(a.y);
      expect(q.x).to.be.equal(b.x);
      expect(q.y).to.be.equal(b.y);
    });
    it('should increment curve complexity', function() {
      expect(c.complexity).to.be.equal(2);
    });
    it('should add new control points in order', function() {
      var p = c.controlPoint(0);
      var q = c.controlPoint(1);

      expect(p.x).to.be.equal(a.x);
      expect(p.y).to.be.equal(a.y);
      expect(q.x).to.be.equal(b.x);
      expect(q.y).to.be.equal(b.y);
    });
  });

  describe('computing the shell', function() {
    describe('for empty curve', function() {
      it('should be empty', function() {
        var c = new Curve();

        expect(c.shell(0).length).to.be.equal(0);
      });
    });

    describe('for single point curve', function() {
      var p, c, s_tMin, s_tMax, s_t0, s_t1, s_t05, all_shells;
      beforeEach('create curve and extract shell', function() {
        p = {x: 0, y: 1};
        c = new Curve([p]);

        s_tMin = c.shell(-1);
        s_tMax = c.shell(2);
        s_t0 = c.shell(0);
        s_t1 = c.shell(1);
        s_t05 = c.shell(0.5);
        all_shells = [s_tMin, s_tMax, s_t0, s_t1, s_t05];
      });

      it('should have only one layer', function() {
        all_shells.forEach(function(shell) {
          expect(shell.length).to.be.equal(1);
        });
      });
      it('should have a single control point at layer 0', function() {
        all_shells.forEach(function(shell) {
          expect(shell[0].length).to.be.equal(1);
        });
      });
      it('should have one point matching the curve', function() {
        all_shells.forEach(function(shell) {
          expect(shell[0][0].x).to.be.equal(p.x);
          expect(shell[0][0].y).to.be.equal(p.y);
        });
      });
    });

    describe('for linear curve', function() {
      var p, c, s_tMin, s_tMax, s_t0, s_t1, s_t05, all_shells;
      beforeEach('create curve and extract shell', function() {
        p = [
          {x: 0, y: 0},
          {x: 1, y: 1}
        ];
        c = new Curve(p);

        s_tMin = c.shell(-1);
        s_tMax = c.shell(2);
        s_t0 = c.shell(0);
        s_t1 = c.shell(1);
        s_t05 = c.shell(0.5);
        all_shells = [s_tMin, s_tMax, s_t0, s_t1, s_t05];
      });

      it('should have two layers', function() {
        all_shells.forEach(function(shell) {
          expect(shell.length).to.be.equal(2);
        });
      });
      it('should have two control points at layer 0', function() {
        all_shells.forEach(function(shell) {
          expect(shell[0].length).to.be.equal(2);
        });
      });
      it('should have one control point at layer 1', function() {
        all_shells.forEach(function(shell) {
          expect(shell[1].length).to.be.equal(1);
        });
      });
      it('should have correct interpolation for t <= 0', function() {
        [s_tMin, s_t0].forEach(function (shell) {
          expect(shell[0][0].x).to.be.equal(p[0].x);
          expect(shell[0][0].y).to.be.equal(p[0].y);
          expect(shell[0][1].x).to.be.equal(p[1].x);
          expect(shell[0][1].y).to.be.equal(p[1].y);
          expect(shell[1][0].x).to.be.equal(p[0].x);
          expect(shell[1][0].y).to.be.equal(p[0].x);
        });
      });
      it('should have correct interpolation for t >= 1', function() {
        [s_tMax, s_t1].forEach(function (shell) {
          expect(shell[0][0].x).to.be.equal(p[0].x);
          expect(shell[0][0].y).to.be.equal(p[0].y);
          expect(shell[0][1].x).to.be.equal(p[1].x);
          expect(shell[0][1].y).to.be.equal(p[1].y);
          expect(shell[1][0].x).to.be.equal(p[1].x);
          expect(shell[1][0].y).to.be.equal(p[1].x);
        });
      });
      it('should have correct interpolation for t = 0.5', function() {
        var shell = s_t05;
        expect(shell[0][0].x).to.be.equal(p[0].x);
        expect(shell[0][0].y).to.be.equal(p[0].y);
        expect(shell[0][1].x).to.be.equal(p[1].x);
        expect(shell[0][1].y).to.be.equal(p[1].y);
        expect(shell[1][0].x).to.be.equal(0.5);
        expect(shell[1][0].y).to.be.equal(0.5);
      });
    });
  });

  describe('evaluation', function() {
    describe('for empty curve', function() {
      var c;
      beforeEach('create curve', function() {
        c = new Curve();
      });

      it('should always evaluate to null', function() {
        [-1, 0, 1, 2, 0.5].forEach(function(t) {
          expect(c.at(t)).to.be.equal(null);
        });
      });
    });

    describe('for single point curve', function() {
      var p, c;
      beforeEach('create normal curve', function() {
        p = {x: 0, y: 0};
        c = new Curve([p]);
      });

      it('should always evaluate to the control point', function() {
        [-1, 0, 1, 2, 0.5].forEach(function(t) {
          var q = c.at(t);
          expect(q.x).to.be.equal(p.x);
          expect(q.y).to.be.equal(p.y);
        });
      });
    });

    describe('for linear curve', function() {
      var p, c;
      beforeEach('create curve', function() {
        p = [
          {x: 0, y: 0},
          {x: 1, y: 1}
        ];
        c = new Curve(p);
      });

      it('should evaluate to start-point when t <= 0', function() {
        [-1, 0].forEach(function(t) {
          var q = c.at(t);
          expect(q.x).to.be.equal(p[0].x);
          expect(q.y).to.be.equal(p[0].y);
        });
      });

      it('should evaluate to end-point when t >= 1', function() {
        [1, 2].forEach(function(t) {
          var q = c.at(t);
          expect(q.x).to.be.equal(p[1].x);
          expect(q.y).to.be.equal(p[1].y);
        });
      });

      it ('should evaluate to middle-point when t = 0.5', function() {
        var q = c.at(0.5);
        expect(q.x).to.be.equal(0.5);
        expect(q.y).to.be.equal(0.5);
      });
    });

    describe('for quadratic curve', function() {
      var p, c;
      beforeEach('create curve', function() {
        p = [
          {x: 0, y: 0},
          {x: 1, y: 1},
          {x: 2, y: 2}
        ];
        c = new Curve(p);
      });

      it('should evaluate to start-point when t <= 0', function() {
        [-1, 0].forEach(function(t) {
          var q = c.at(t);
          expect(q.x).to.be.equal(p[0].x);
          expect(q.y).to.be.equal(p[0].y);
        });
      });

      it('should evaluate to end-point when t >= 1', function() {
        [1, 2].forEach(function(t) {
          var q = c.at(t);
          expect(q.x).to.be.equal(p[2].x);
          expect(q.y).to.be.equal(p[2].y);
        });
      });

      it ('should evaluate to middle-point when t = 0.5', function() {
        var q = c.at(0.5);
        expect(q.x).to.be.equal(1);
        expect(q.y).to.be.equal(1);
      });
    });
  });

  describe('skeleton computation', function() {
    describe('for empty curve', function() {
      it('should be empty', function() {
        var c = new Curve();

        expect(c.outline().length).to.be.equal(0);
      });
    });

    describe('for single point curve', function() {
      var p, c, s;
      beforeEach('create point and curve', function() {
        p = {x: 0, y: 1};
        c = new Curve([p]);
        s = c.outline();
      });

      it('should have length one', function() {
        expect(s.length).to.be.equal(1);
      });
      it('should contain a single control point', function() {
        expect(s[0].x).to.be.equal(p.x);
        expect(s[0].y).to.be.equal(p.y);
        });
      });

    describe('for linear curve', function() {
      var p, c, s;
      beforeEach('create point and curve', function() {
        p = [
          {x: 0, y: 1},
          {x: 2, y: 3}
        ];
        c = new Curve(p);
        s = c.outline(0, 1, 0.01);
      });

      it('should have length of (1 / precision + 1)', function() {
          var s = c.outline(0, 1, 0.01);
          expect(s.length).to.be.equal(101);
      });
    });

    describe('for quadratic curve', function() {
      var p, c;
      beforeEach('create point and curve', function() {
        p = [
          {x: 0, y: 0},
          {x: 1, y: 1},
          {x: 2, y: 2}
        ];
        c = new Curve(p);
      });

      it('should have length of (1 / precision + 1)',
        function() {
          var s = c.outline(0, 1, 0.01);
          expect(s.length).to.be.equal(101);
      });
    });
  });
});