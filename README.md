## inline-svgo-loader
Use [svgo](https://github.com/svg/svgo) to optimize svg file, transformed as **string** or **data-uri** or **file**.

[![npm version](https://img.shields.io/npm/v/inline-svgo-loader.svg)](https://www.npmjs.com/package/inline-svgo-loader)
[![Build Status](https://travis-ci.org/lovetingyuan/inline-svgo-loader.svg?branch=master)](https://travis-ci.org/lovetingyuan/inline-svgo-loader)

### Options
* `svgo`: `[k: string]: any`, configuration passed to svgo, see https://github.com/svg/svgo.
* `limit`: `number`, when optimized svg file size is larger than limit, will use `fallback` option.
* `fallback`: `{ loader: string, options: any }`, see above, default fallback is `file-loader`, just like `url-loader`.

### Usage
```bash
npm install inline-svgo-loader --save-dev
```

```javascript
{
  module: {
    rules: [
      {
        test: /\.(svg)(\?.*)?$/,
        loader: 'inline-svgo-loader'，
        options: {
          svgo: {},
          limit: 4 * 1024,
          fallback: {
            loader: 'file-loader',
            options: { name: '[name].svg' }
          }
        }
      }
    ]
  }
}
```

#### support `data:image/svg+xml,`
Just append `dataUrl` query param to svg file path to support data url(`data:image/svg+xml,%3csvg...`, Not base64).
    eg: in css `background-image: url('assets/some.svg?dataUrl')`.
