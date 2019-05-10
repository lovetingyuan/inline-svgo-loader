
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
        loader: require.resolve('../'),
        options: {}
      }]
    }
  });
  compiler.outputFileSystem = new memoryfs();
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      t.fail(err || 'webpack has errors.');
    } else {
      const fs = compiler.outputFileSystem;
      const result = fs.readFileSync(path.join(compiler.outputPath, 'main.js'), 'utf8');
      t.equal([
        /exports="data:image\/svg\+xml,%3csvg /,
        /exports='<svg /, /><\/svg>'/,
        /xmlns="http:\/\/www.w3.org\/2000\/svg"/,
        /xmlns='http:\/\/www.w3.org\/2000\/svg'/,
        /#FF4742/, // down.svg
        /%23ef35a2/, // up.svg
        /#EA6B66/, /#F0D6B7/ // jenkins.svg
      ].every(r => r.test(result)), true);
      t.equal([
        /Created with Sketch/,
        /レイヤー_1/,
        /downdowndowndown/, /upupupup/,
        /#ef35a2/
      ].every(r => r.test(result)), false);
      t.end();
    }
  });
});

test('svgo inline loader', function (t) {
  const compiler = webpack({
    entry: path.resolve(__dirname, 'main.js'),
    module: {
      rules: [{
        test: /\.svg$/,
        loader: require.resolve('../'),
        options: {
          limit: 10 * 1024,
          fallback: {
            loader:'file-loader',
            options: {name: '[name].[ext]'}
          }
        }
      }]
    }
  });
  compiler.outputFileSystem = new memoryfs();
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err, stats.compilation.errors)
      t.fail(err || 'webpack has errors.');
    } else {
      const fs = compiler.outputFileSystem;
      const result = fs.readFileSync(path.join(compiler.outputPath, 'main.js'), 'utf8');
      const files = fs.readdirSync(path.join(compiler.outputPath))
      t.ok(files.includes('jenkins.svg'))
      const jenkins = fs.readFileSync(path.join(compiler.outputPath, 'jenkins.svg'), 'utf8');
      t.ok(jenkins.indexOf('#EA6B66') > 0)
      t.notOk(jenkins.indexOf('レイヤー_1') > 0)

      t.equal([
        /exports="data:image\/svg\+xml,%3csvg /,
        /exports='<svg /, /><\/svg>'/,
        /xmlns="http:\/\/www.w3.org\/2000\/svg"/,
        /xmlns='http:\/\/www.w3.org\/2000\/svg'/,
        /#FF4742/, // down.svg
        /%23ef35a2/, // up.svg
      ].every(r => r.test(result)), true);
      t.equal([
        /Created with Sketch/,
        /レイヤー_1/,
        /#EA6B66/, /#F0D6B7/ // jenkins.svg
      ].every(r => r.test(result)), false);

      t.end();
    }
  });
});
