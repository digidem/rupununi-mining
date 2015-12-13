var drop = require('drag-and-drop-files')
var fileReaderStream = require('filereader-stream')
var tar = require('tar-stream')
var gunzip = require('gunzip-maybe')
var mime = require('mime-types')
var cache = require('image-cache/lib/cache')()

module.exports = function (el) {
  drop(el, function (files) {
    var first = files[0]
    var extract = tar.extract()

    extract.on('entry', function (header, stream, next) {
      var opts = {
        url: 'http://s3.amazonaws.com/dd-tiles/' + header.name,
        contentType: mime.lookup(header.name) || ''
      }
      if (header.type !== 'file') {
        stream.on('end', next)
        stream.resume()
        return
      }
      console.log(opts.url)
      var ws = cache.createWriteStream(opts, next)
      stream.pipe(ws)
    })

    fileReaderStream(first).pipe(gunzip()).pipe(extract)
  })
}
