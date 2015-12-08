var L = require('leaflet')
var BingLayer = require('leaflet-bing-layer')
var assign = require('object-assign')

// Transparent 1x1 png
var ERROR_TILE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII='
var BING_MAPS_KEY = 'AqAa7FyZoTAvP_O-vFPJi9y8AWm9ElvmvMHqIBglCtdRsZjDqTpKZCccuJiu2Zue'

var DdTileLayer = L.TileLayer.extend({
  initialize: function (options) {
    var r = L.Browser.retina ? '@2x' : ''
    var url = 'http://s3.amazonaws.com/dd-tiles/' +
      options.id + '/{z}/{x}/{y}' + r + '.jpg'
    this.options.errorTileUrl = ERROR_TILE
    L.TileLayer.prototype.initialize.call(this, url, options)
  }
})

module.exports = function (options) {
  options = assign({}, options)
  if (options.id === 'bing') {
    options.BingMapsKey = BING_MAPS_KEY
    return new BingLayer(options)
  }
  return new DdTileLayer(options)
}
