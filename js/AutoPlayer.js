/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function AutoPlayer(interval, increment) {
  this.interval = interval || 100;
  this.increment = increment || 0.01;
  this.t = 0;

  this._lastUpdate = new Date();
}

AutoPlayer.prototype = {
  constructor: AutoPlayer,

  update: function() {
    var currentTime = new Date();
    var dt = currentTime - this._lastUpdate;
    if (dt > this.interval) {
      if (this.t >= 1) { this.t = 0; }
      else { this.t += this.increment; }
      this._lastUpdate = currentTime;
    }
  }
};