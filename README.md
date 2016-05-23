# byline-interleave
Interleaved line-by-line streaming from multiple streams

It currently assumes that all input streams provide equal number of lines.
The order of the lines in the consuming end is not guaranteed to be the same
as the order of the input files.

[![NPM](https://nodei.co/npm/byline-interleave.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/byline-interleave/)

## Install

```sh
npm install byline-interleave
```

## Usage

```javascript
var interleave = require('byline-interleave');

var stream = interleave(
  'file-1.txt',
  'file-2.txt'
);

stream.on('data', function(data) {
  console.log(data); // ['line 1 from file-1.txt', 'line 1 from file2.txt'] etc
});

stream.on('end', function() {
  console.log('end of stream');
});
```
