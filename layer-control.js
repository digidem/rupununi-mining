var L = require('leaflet')
var assign = require('object-assign')
var debounce = require('lodash.debounce')

var formatName = require('./formats').formatName

module.exports = L.Control.Layers.extend({
  initialize: function (layerDefs, options) {
    L.setOptions(this, options)
    this.options.position = 'top' + options.side

    this._layers = {}
    this._lastZIndex = 0
    this._handlingClick = false
    this._dateRange = {min: Infinity, max: -Infinity}

    this._updateDebounced = debounce(this._update, 150)

    layerDefs.forEach(this._addLayer, this)
  },

  onAdd: function (map) {
    L.Control.Layers.prototype.onAdd.call(this, map)
    L.DomEvent.on(this._form, 'click', this._collapse, this)
    L.DomEvent.on(window, 'resize', this._updateDebounced, this)
    return this._container
  },

  onRemove: function () {
    L.Control.Layers.prototype.onRemove.call(this)
    L.DomEvent.off(this._form, 'click', this._collapse, this)
    L.DomEvent.off(window, 'resize', this._updateDebounced, this)
  },

  setWidth: function (width) {
    this.getContainer().style.width = width + 'px'
    return this
  },

  setTitle: function (title) {
    this._layersLink.innerHTML = title + '&lrm;'
    if (this.getActiveBaseLayer()) {
      this._layersLink.title = formatName(this.getActiveBaseLayer())
    }
  },

  getActiveBaseLayer: function () {
    for (var i in this._layers) {
      if (this._map.hasLayer(this._layers[i].layer)) {
        return this._layers[i]
      }
    }
  },

  _addLayer: function (layerDef) {
    var layer = layerDef.layer
    layer.on('add remove', this._onLayerChange, this)

    var id = L.stamp(layer)

    this._layers[id] = assign(layerDef, {name: layerDef.id})

    if (this._prevLayerDef && this._prevLayerDef.date) {
      this._layers[id].diff = layerDef.date ? Date.parse(layerDef.date) - Date.parse(this._prevLayerDef.date) : 0
    } else {
      this._layers[id].diff = 0
    }

    this._prevLayerDef = layerDef

    if (this.options.autoZIndex && layer.setZIndex) {
      this._lastZIndex++
      layer.setZIndex(this._lastZIndex)
    }

    this._dateRange.min = layerDef.date ? Math.min(Date.parse(layerDef.date), this._dateRange.min) : this._dateRange.min
    this._dateRange.max = layerDef.date ? Math.max(Date.parse(layerDef.date), this._dateRange.max) : this._dateRange.max
  },

  _onLayerChange: function (e) {
    L.Control.Layers.prototype._onLayerChange.call(this, e)
    var obj = this._layers[L.stamp(e.target)]
    this.setTitle(formatName(obj))
  },

  _addItem: function (obj) {
    var label = document.createElement('label')
    var checked = this._map.hasLayer(obj.layer)

    var input

    if (obj.overlay) {
      input = document.createElement('input')
      input.type = 'checkbox'
      input.className = 'leaflet-control-layers-selector'
      input.defaultChecked = checked
    } else {
      input = this._createRadioElement('leaflet-base-layers', checked)
    }

    input.layerId = L.stamp(obj.layer)

    L.DomEvent.on(input, 'click', this._onInputClick, this)

    var nameEl = document.createElement('a')
    var res = obj.maxNativeZoom === 15 ? 'lo-res' : 'hi-res'
    res = ' <span class="leaflet-control-layers-resolution">(' + res + ')&lrm;</span>'
    nameEl.innerHTML = ' ' + formatName(obj) + res
    nameEl.title = obj.attribution

    // Helps from preventing layer control flicker when checkboxes are disabled
    // https://github.com/Leaflet/Leaflet/issues/2771
    var holder = document.createElement('div')

    label.appendChild(holder)
    holder.appendChild(input)
    holder.appendChild(nameEl)

    label.style.paddingTop = this._calculateListPadding(obj) + 'px'

    var container = obj.overlay ? this._overlaysList : this._baseLayersList
    container.appendChild(label)

    this._checkDisabledLayers()
    return label
  },

  _expand: function () {
    L.Control.Layers.prototype._expand.call(this)
    if (L.Browser.touch) {
      L.DomEvent.on(this._layersLink, 'click', this._collapse, this)
      L.DomEvent.off(this._layersLink, 'click', this._expand, this)
    }
  },

  _collapse: function () {
    if (L.Browser.touch) {
      L.DomEvent.off(this._layersLink, 'click', this._collapse, this)
      L.DomEvent.on(this._layersLink, 'click', this._expand, this)
    }
    L.Control.Layers.prototype._collapse.call(this)
  },

  _calculateListPadding: function (layerDef) {
    var listHeight = this._map.getSize().y - 50 - 30
    var numListItems = Object.keys(this._layers).length
    var availablePadding = listHeight - (numListItems * 27)
    var dateRange = this._dateRange.max - this._dateRange.min
    return availablePadding * (layerDef.diff / dateRange)
  }
})
