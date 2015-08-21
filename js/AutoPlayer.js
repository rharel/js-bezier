/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-bezier
 */

function AutoPlayer(timeObject, interval, increment) {

  this._time = timeObject;
  this._interval = interval || 100;
  this._increment = increment || 0.01;

  this._lastUpdate = new Date();
  this._playing = false;
}

AutoPlayer.prototype = {

  constructor: AutoPlayer,

  play: function() {

    if (this._playing) { return; }

    this._playing = true;
    this._update();
  },

  stop: function() {

    this._playing = false;
  },

  _update: function() {

    if (!this._playing) { return; }

    var currentTime = new Date();
    var dt = currentTime - this._lastUpdate;

    if (dt > this._interval) {

      if (this.t >= 1) { this.t = 0; }
      else { this.t += this._increment; }
      this._lastUpdate = currentTime;
    }

    if (this._playing) {
      setTimeout(this._update.bind(this), this._interval);
    }
  },

  get t() { return this._time.get(); },
  set t(value) { this._time.set(value); }
};