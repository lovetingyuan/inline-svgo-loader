# inline-svgo-loader
use [svgo](https://github.com/svg/svgo) to optimize svg file, transformed as string or data-url

[![npm version](https://img.shields.io/npm/v/inline-svgo-loader.svg)](https://www.npmjs.com/package/inline-svgo-loader)
[![Build Status](https://travis-ci.org/lovetingyuan/inline-svgo-loader.svg?branch=master)](https://travis-ci.org/lovetingyuan/inline-svgo-loader)

### options
* svgo: [k: string]: any, passed to svgo, see https://github.com/svg/svgo.
* limit: number, when optimized svg file size is larger than limit, will use fallback option.
* fallback: { loader: string, options: any }, see above, just like `url-loader`.

### usage
```bash
npm install inline-svgo-loader --save-dev
```

```javascript
{
  module: {
    rules: [
      {
        test: /\.svg$/,
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

Just append `dataUrl` query param to svg file path to support data url(`data:image/svg+xml,%3csvg...`, not base64).

eg: in css `background-image: url('assets/some.svg?dataUrl')`.
