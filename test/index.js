
const webpack = require('webpack');
const memoryfs = require('memory-fs');
const test = require('tape');
const path = require('path');

test('svgo inline loader', function (t) {
  const compiler = webpack({
    entry: path.resolve(__dirname, 'main.js'),
    module: {
      rules: [{
        test: /\.svg$/,
        loader: require.resolve('../')
      }]
    }
  });
  compiler.outputFileSystem = new memoryfs();
  compiler.run((err, stats) => {
    const fs = compiler.outputFileSystem;
    const result = fs.readFileSync(path.join(compiler.outputPath, 'main.js'), 'utf8');
    t.equal(/exports="data:image\/svg\+xml,%3csvg /.test(result), true);
    t.equal(/exports='<svg /.test(result), true);
    t.equal(/><\/svg>/.test(result), true);
    t.equal(/xmlns="http:\/\/www.w3.org\/2000\/svg"/.test(result), true);
    t.equal(/xmlns='http:\/\/www.w3.org\/2000\/svg'/.test(result), true);
    t.equal(/Created with Sketch/.test(result), false);
    t.equal(/color='red' font-size='14'/.test(result), true);
    if (err || stats.hasErrors()) {
      t.fail(err || 'webpack has errors.');
    } else {
      t.end();
    }
  });
});
