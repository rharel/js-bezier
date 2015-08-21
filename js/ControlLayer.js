/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function ControlLayer(_2d) {

  this._2d = _2d;

  this._layer = new Layer(_2d);
  this._layer.style.fill = 'blue';
}

ControlLayer.prototype = {

  constructor: ControlLayer,

  add: function(p) {

    //this._layer.
  }
};