# byline-interleave
Interleaved line-by-line streaming from multiple streams

It currently assumes that all input streams provide equal number of lines.

## Install

    npm install byline-interleave

## Usage

```javascript
var interleave = require('byline-interleave');

var stream = interleave(
  fs.createReadStream('file-1.txt'),
  fs.createReadStream('file-2.txt')
);

stream.on('data', function(data) {
  console.log(data); // ['line 1 from file-1.txt', 'line 1 from file2.txt'] etc
});

stream.on('end', function() {
  console.log('end of stream');
});
```
