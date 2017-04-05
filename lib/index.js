'use strict';

/**
 * Module dependencies.
 */

var integration = require('@segment/analytics.js-integration');
var isObject = require('isobject');
var push = require('global-queue')('_dcq');
var each = require('@ndhoule/each');

/**
 * Expose `Drip` integration.
 */

var Drip = module.exports = integration('Drip')
  .global('_dc')
  .global('_dcq')
  .global('_dcqi')
  .global('_dcs')
  .option('account', '')
  .tag('<script src="//tag.getdrip.com/{{ account }}.js">');

/**
 * Initialize.
 *
 * @api public
 */

Drip.prototype.initialize = function() {
  window._dcq = window._dcq || [];
  window._dcs = window._dcs || {};
  window._dcs.account = this.options.account;
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @api private
 * @return {boolean}
 */

Drip.prototype.loaded = function() {
  return isObject(window._dc);
};

/**
 * Track.
 *
 * @api public
 * @param {Track} track
 */

Drip.prototype.track = function(track) {
  var props = {};
  each(function(value, key) {
    var formattedKey = key.replace(' ', '_');
    props[formattedKey] = value;
  }, track.properties());
  var cents = Math.round(track.revenue() * 100);
  if (cents) props.value = cents;
  delete props.revenue;
  push('track', track.event(), props);
};

/**
 * Identify.
 *
 * @api public
 * @param {Identify} identify
 */

Drip.prototype.identify = function(identify) {
  push('identify', identify.traits());
};
