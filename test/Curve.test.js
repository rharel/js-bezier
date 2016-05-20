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

        var curve;
        beforeEach('create a new curve', function() {

            curve = new Curve();
        });

        it('should create an empty curve by default', function () {

            expect(curve.complexity).to.be.equal(0);
        });
    });
    describe('array constructor', function() {

        var points, curve;
        beforeEach('create curve from array', function() {

            points = [
                {x: 0, y: 1},
                {x: 2, y: 3},
                {x: 4, y: 5}
            ];
            curve = new Curve(points);
        });

        it('should have the same complexity as the array\'s length', function() {

            expect(curve.complexity).to.be.equal(points.length);
        });
        it('should populate control points from the array', function() {

            var a, b;
            for (var i = 0; i < points.length; ++i) {

                a = points[i];
                b = curve.point(i);
                expect(b.x).to.be.equal(a.x);
                expect(b.y).to.be.equal(a.y);
            }
        });
    });

    describe('control point addition', function() {

        var curve;
        var a, b, p, q;
        beforeEach('create curve and add points', function() {

            curve = new Curve();
            a = {x: 0, y: 1};
            b = {x: 2, y: 3};

            p = curve.add(a.x, a.y);
            q = curve.add(b.x, b.y);
        });

        it('should return the new control point', function() {

            expect(p.x).to.be.equal(a.x);
            expect(p.y).to.be.equal(a.y);
            expect(q.x).to.be.equal(b.x);
            expect(q.y).to.be.equal(b.y);
        });
        it('should increment curve complexity', function() {

            expect(curve.complexity).to.be.equal(2);
        });
        it('should add new control points in order', function() {

            p = curve.point(0);
            q = curve.point(1);

            expect(p.x).to.be.equal(a.x);
            expect(p.y).to.be.equal(a.y);
            expect(q.x).to.be.equal(b.x);
            expect(q.y).to.be.equal(b.y);
        });
    });
    describe('control point clearance', function() {

        var curve = new Curve();
        curve.add(0, 1);

        it ('should have complexity == 1', function() {

            expect(curve.complexity).to.be.equal(1);

            curve.clear();
            it ('should have cleared all points', function() {

            expect(curve.complexity).to.be.equal(0);
        });
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

            var point, curve;
            var s_t0, s_t1, s_t05;
            var computed_shells;
            beforeEach('create curve and extract shell', function() {

                point = {x: 0, y: 1};
                curve = new Curve([point]);

                s_t0 = curve.shell(0);
                s_t1 = curve.shell(1);
                s_t05 = curve.shell(0.5);
                computed_shells = [s_t0, s_t1, s_t05];
            });

            it('should have only one layer', function() {

                computed_shells.forEach(function(shell) {

                    expect(shell.length).to.be.equal(1);
                });
            });
            it('should have a single control point at layer 0', function() {

                computed_shells.forEach(function(shell) {

                    expect(shell[0].length).to.be.equal(1);
                });
            });
            it('should have one point matching the curve', function() {

                computed_shells.forEach(function(shell) {

                    expect(shell[0][0].x).to.be.equal(point.x);
                    expect(shell[0][0].y).to.be.equal(point.y);
                });
            });
        });
        describe('for linear curve', function() {
            var point, curve;
            var s_t0, s_t1, s_t05;
            var computed_shells;
            beforeEach('create curve and extract shell', function() {

                point = [
                    {x: 0, y: 0},
                    {x: 1, y: 1}
                ];
                curve = new Curve(point);

                s_t0 = curve.shell(0);
                s_t1 = curve.shell(1);
                s_t05 = curve.shell(0.5);
                computed_shells = [s_t0, s_t1, s_t05];
            });

            it('should have two layers', function() {

                computed_shells.forEach(function(shell) {

                    expect(shell.length).to.be.equal(2);
                });
            });
            it('should have two control points at layer 0', function() {

                computed_shells.forEach(function(shell) {

                    expect(shell[0].length).to.be.equal(2);
                });
            });
            it('should have one control point at layer 1', function() {

                computed_shells.forEach(function(shell) {

                    expect(shell[1].length).to.be.equal(1);
                });
            });
            it('should have correct interpolation for t = 0', function() {

                expect(s_t0[0][0].x).to.be.equal(point[0].x);
                expect(s_t0[0][0].y).to.be.equal(point[0].y);
                expect(s_t0[0][1].x).to.be.equal(point[1].x);
                expect(s_t0[0][1].y).to.be.equal(point[1].y);
                expect(s_t0[1][0].x).to.be.equal(point[0].x);
                expect(s_t0[1][0].y).to.be.equal(point[0].y);
            });
            it('should have correct interpolation for t = 1', function() {

                expect(s_t1[0][0].x).to.be.equal(point[0].x);
                expect(s_t1[0][0].y).to.be.equal(point[0].y);
                expect(s_t1[0][1].x).to.be.equal(point[1].x);
                expect(s_t1[0][1].y).to.be.equal(point[1].y);
                expect(s_t1[1][0].x).to.be.equal(point[1].x);
                expect(s_t1[1][0].y).to.be.equal(point[1].x);
            });
            it('should have correct interpolation for t = 0.5', function() {

                expect(s_t05[0][0].x).to.be.equal(point[0].x);
                expect(s_t05[0][0].y).to.be.equal(point[0].y);
                expect(s_t05[0][1].x).to.be.equal(point[1].x);
                expect(s_t05[0][1].y).to.be.equal(point[1].y);
                expect(s_t05[1][0].x).to.be.equal(0.5);
                expect(s_t05[1][0].y).to.be.equal(0.5);
            });
        });
    });

    describe('evaluation', function() {

        describe('for empty curve', function() {

            var curve;
            beforeEach('create curve', function() {

                curve = new Curve();
            });

            it('should always evaluate to null', function() {

                [0, 1, 0.5].forEach(function(t) {

                    expect(curve.at(t)).to.be.equal(null);
                });
            });
        });
        describe('for single point curve', function() {

            var point, curve;
            beforeEach('create normal curve', function() {

                point = {x: 0, y: 0};
                curve = new Curve([point]);
            });

            it('should always evaluate to the control point', function() {

                [0, 1, 0.5].forEach(function(t) {

                    var q = curve.at(t);
                    expect(q.x).to.be.equal(point.x);
                    expect(q.y).to.be.equal(point.y);
                });
            });
        });
        describe('for linear curve', function() {

            var point, curve;
            beforeEach('create curve', function() {

                point = [
                    {x: 0, y: 0},
                    {x: 1, y: 1}
                ];
                curve = new Curve(point);
            });

            it('should evaluate to start-point when t = 0', function() {

                var q = curve.at(0);
                expect(q.x).to.be.equal(point[0].x);
                expect(q.y).to.be.equal(point[0].y);
            });
            it('should evaluate to end-point when t = 1', function() {

                var q = curve.at(1);
                expect(q.x).to.be.equal(point[1].x);
                expect(q.y).to.be.equal(point[1].y);
            });
            it ('should evaluate to middle-point when t = 0.5', function() {

                var q = curve.at(0.5);
                expect(q.x).to.be.equal(0.5);
                expect(q.y).to.be.equal(0.5);
            });
        });
        describe('for quadratic curve', function() {

            var point, curve;
            beforeEach('create curve', function() {
                point = [
                    {x: 0, y: 0},
                    {x: 1, y: 1},
                    {x: 2, y: 2}
                ];
                curve = new Curve(point);
            });

            it('should evaluate to start-point when t = 0', function() {

                var q = curve.at(0);
                expect(q.x).to.be.equal(point[0].x);
                expect(q.y).to.be.equal(point[0].y);
            });
            it('should evaluate to end-point when t = 1', function() {

                var q = curve.at(1);
                expect(q.x).to.be.equal(point[2].x);
                expect(q.y).to.be.equal(point[2].y);
            });
            it ('should evaluate to middle-point when t = 0.5', function() {

                var q = curve.at(0.5);
                expect(q.x).to.be.equal(1);
                expect(q.y).to.be.equal(1);
            });
        });
    });

    describe('computing the outline', function() {

        describe('for empty curve', function() {

            it('should be empty', function() {
                var curve = new Curve();

                expect(curve.outline().length).to.be.equal(0);
            });
        });
        describe('for single point curve', function() {

            var point, curve, outline;
            beforeEach('create point and curve', function() {

                point = {x: 0, y: 1};
                curve = new Curve([point]);
                outline = curve.outline();
            });

            it('should have length one', function() {

                expect(outline.length).to.be.equal(1);
            });
            it('should contain a single control point', function() {

                expect(outline[0].x).to.be.equal(point.x);
                expect(outline[0].y).to.be.equal(point.y);
            });
        });
        describe('for linear curve', function() {

            var point, curve, outline;
            beforeEach('create point and curve', function() {

                point = [
                    {x: 0, y: 1},
                    {x: 2, y: 3}
                ];
                curve = new Curve(point);
                outline = curve.outline(0, 1, 0.01);
            });

            it('should have length of (1 / precision + 1)', function() {

                var s = curve.outline(0, 1, 0.01);
                expect(s.length).to.be.equal(101);
            });
        });
        describe('for quadratic curve', function() {

            var point, curve;
            beforeEach('create point and curve', function() {

                point = [
                    {x: 0, y: 0},
                    {x: 1, y: 1},
                    {x: 2, y: 2}
                ];
                curve = new Curve(point);
            });

            it('should have length of (1 / precision + 1)', function() {

                var s = curve.outline(0, 1, 0.01);
                expect(s.length).to.be.equal(101);
            });
        });
    });
});
