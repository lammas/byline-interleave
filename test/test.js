var fs = require('fs');
var interleave = require('../byline-interleave');

var files = [
	'file0.txt',
	'file1.txt',
	'file2.txt'
];

var stream = interleave(files);

stream.on('data', function(data) {
  console.log('COMBINED:', data);
});

stream.on('end', function() {
  console.timeEnd('total');
  console.log('End');
});

console.log('Start');
console.time('total');
