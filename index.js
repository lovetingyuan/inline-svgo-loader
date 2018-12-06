const SVGO = require('svgo');
const loaderUtils = require('loader-utils');
const instance = new Map();

module.exports = function svgoLoader(source) {
  const callback = this.async();
  const config = loaderUtils.getOptions(this);
  if (!instance.has(config)) {
    instance.set(config, new SVGO(config || {}));
  }
  instance.get(config).optimize(source, {path: this.resourcePath}).then(result => {
    let dataUrl;
    if (this.resourceQuery[0] === '?') {
      dataUrl = 'dataUrl' in loaderUtils.parseQuery(this.resourceQuery);
    }
    const svgStr = (dataUrl ? 'data:image/svg+xml;charset=utf8,' : '') + result.data;
    if (this.loaderIndex) {
      callback(null, svgStr);
    } else {
      callback(null, `module.exports = ${JSON.stringify(svgStr)}`);
    }
  });
};
