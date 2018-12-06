# inline-svgo-loader
use svgo to optimize svg file, transformed as string or data-url

### usage
```bash
npm install git+https://github.com/lovetingyuan/inline-svgo-loader.git --save-dev
```

```javascript
{
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'inline-svgo-loader'
      }
    ]
  }
}
```

append `dataUrl` query param to svg path to get data-url result like `data:image/svg+xml...`(not base64) when used in css `url()`

eg: `background-image: url('@/assets/some.svg?dataUrl')`
