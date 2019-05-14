const SVGO = require('svgo')
const loaderUtils = require('loader-utils')
const toDataUri = require('mini-svg-data-uri')
const isNumber = require('is-number')
const isPlainObject = require('lodash.isplainobject')

const instances = new WeakMap()
const { name } = require('./package.json')

function normalizeFallback(fallback, originalOptions) { // from url-loader
  let loader = 'file-loader'
  let options = {}
  if (typeof fallback === 'string') {
    loader = fallback
    const index = fallback.indexOf('?')
    if (index >= 0) {
      loader = fallback.substr(0, index)
      options = loaderUtils.parseQuery(fallback.substr(index))
    }
  }
  if (fallback !== null && typeof fallback === 'object') {
    ({ loader, options } = fallback)
  }
  options = Object.assign({}, originalOptions, options)
  delete options.fallback
  return { loader, options }
}

function rawLoader(source) { // from raw-loader
  const result = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
  return `module.exports = ${result}`
}

module.exports = function svgoLoader(source) {
  const callback = this.async()
  const options = loaderUtils.getOptions(this) || {}
  let { svgo, limit, fallback } = options
  if (!isPlainObject(svgo)) {
    svgo = {}
  }
  delete svgo.datauri
  if (!instances.has(svgo)) {
    instances.set(svgo, new SVGO(svgo))
  }
  const useDataUrl = this.resourceQuery[0] === '?' && ('dataUrl' in loaderUtils.parseQuery(this.resourceQuery))
  instances.get(svgo).optimize(source, { path: this.resourcePath }).then(result => {
    let svgStr = result.data
    let overLimit = isNumber(limit) && limit > 0 && svgStr.length > limit
    if (useDataUrl && overLimit) {
      this.emitWarning(new Error(
        `${name}: ${this.resourcePath} is used as data-uri but optimized size(${svgStr.length}) is larger than limit(${limit}).`
      ))
      overLimit = false
    }
    if (overLimit) {
      const {
        loader: fallbackLoader,
        options: fallbackOptions,
      } = normalizeFallback(fallback, options)
      const fallbackLoaderContext = Object.assign({}, this, {
        query: fallbackOptions,
      })
      const fallbackNormal = require(fallbackLoader)
      callback(null, fallbackNormal.call(fallbackLoaderContext, svgStr))
    } else {
      if (useDataUrl) {
        svgStr = toDataUri(svgStr)
      }
      if (this.loaderIndex) {
        this.emitWarning(new Error(
          `${name}: not support work with other loaders, use "fallback" option instead.`
        ))
      }
      callback(null, rawLoader(svgStr))
    }
  }).catch(err => callback(err instanceof Error ? err : new Error(err)))
}
