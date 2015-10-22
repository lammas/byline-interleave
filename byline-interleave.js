var stream = require('stream');
var byline = require('byline');
var es = require('event-stream');

/**
 * Adds a line number to each line read
 */
function counter() {
  var transform = new stream.Transform({ objectMode: true });
  transform._count = 0;
  transform._transform = function (chunk, encoding, done) {
    var data = chunk.toString();
    var o = { line: this._count, data: data };
    this.push(o);
    this._count++;
    done();
  }
  return transform;
}

/**
 * Groups lines with the same line number until there are numInputs
 * lines in the group.
 */
function group(numInputs) {
  var transform = new stream.Transform({ objectMode: true });
  transform._buffer = {};
  transform._transform = function (data, encoding, done) {
    if (!(data.line in this._buffer)) {
      this._buffer[data.line] = [];
    }
    this._buffer[data.line].push(data.data);
    if (this._buffer[data.line].length == numInputs) {
      this.push(this._buffer[data.line]);
      delete this._buffer[data.line];
    }
    done();
  }
  return transform;
}

/**
 * Takes 1..n input streams and reads from them line-by-line.
 * Outputs the same lines read from each source in groups in
 * an interleaved fashion.
 */
function interleave(arrayOfStreams) {
  var args = arguments;
  if (arrayOfStreams instanceof Array)
    args = arrayOfStreams;
  if (args.length < 2)
    throw "Error: interleaving less than 2 streams is pointless.";
  var streams = [];
  for (var i=0; i<args.length; i++)
    streams.push(byline(args[i]).pipe(counter()));
  var merged = es.merge(streams);
  return merged.pipe(group(args.length));
}

module.exports = interleave;
