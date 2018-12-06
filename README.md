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

support data url(`data:image/svg+xml...`, not base64): just append `dataUrl` query param to svg file path. 

eg: work with css `background-image: url('@/assets/some.svg?dataUrl')`.
