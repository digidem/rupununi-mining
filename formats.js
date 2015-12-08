var moment = require('moment')
var titleCase = require('title-case')
var assign = require('object-assign')

var DATE_FORMAT = 'MMM D, YYYY'

var customRelativeTime = {
  future: '%s later',
  past: '%s prior'
}

moment.locale('en', {
  relativeTime: assign(moment.localeData()._relativeTime, customRelativeTime)
})

function formatName (layerDef) {
  if (moment(layerDef.date).isValid()) {
    return moment(layerDef.date).format(DATE_FORMAT)
  } else {
    return layerDef.attribution
  }
}

function formatRelativeName (layerDef, layerDefFrom) {
  if (moment(layerDef.date).isValid()) {
    if (moment(layerDef.date).diff(moment(layerDefFrom.date)) === 0) {
      return moment(layerDef.date).format(DATE_FORMAT)
    }
    return titleCase(moment(layerDef.date).from(layerDefFrom.date))
  } else {
    return layerDef.attribution
  }
}

module.exports = {
  formatName: formatName,
  formatRelativeName: formatRelativeName
}
