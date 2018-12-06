const SVGO = require('svgo');
const loaderUtils = require('loader-utils');
const instance = new Map();
const toDataUri = require('mini-svg-data-uri');

module.exports = function svgoLoader(source) {
  const callback = this.async();
  const config = loaderUtils.getOptions(this);
  if (!instance.has(config)) {
    instance.set(config, new SVGO(config || {}));
  }
  instance.get(config).optimize(source, {path: this.resourcePath}).then(result => {
    let svgStr = result.data;
    if (this.resourceQuery[0] === '?' && ('dataUrl' in loaderUtils.parseQuery(this.resourceQuery))) {
      svgStr = toDataUri(result.data);
    }
    if (this.loaderIndex) {
      callback(null, svgStr);
    } else {
      callback(null, `module.exports = ${JSON.stringify(svgStr)}`);
    }
  }).catch(e => callback(e instanceof Error ? e : new Error(e)));
};
