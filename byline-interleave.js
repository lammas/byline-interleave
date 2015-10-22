var util = require('util');
var stream = require('stream');
var LineByLineReader = require('line-by-line');

/**
 * Takes 1..n input streams and reads from them line-by-line.
 * Outputs the same lines read from each source in groups in
 * an interleaved fashion.
 */
function interleave(arrayOfFilePaths) {
  var args = arguments;
  if (arrayOfFilePaths instanceof Array)
    args = arrayOfFilePaths;
  if (args.length < 2)
    throw "Error: interleaving less than 2 streams is pointless.";

  var numInputs = args.length;
  var streams = [];
  var buffer = [];
  var out = new stream.PassThrough({ objectMode: true });
  var ended = false;

  function onLine(line) {
    buffer.push(line.toString());
    this.pause();

    if (buffer.length == numInputs) {
      out.write(buffer);
      buffer.length = 0;
      for (var i=0; i<streams.length; i++)
        streams[i].resume();
    }
  }

  function onEnd() {
    if (ended)
      return;
    ended = true;
    out.end();
  }

  function onError(err) {
    throw err;
  }

  for (var i=0; i<args.length; i++) {
    var s = new LineByLineReader(args[i]);
    s.on('line', onLine);
    s.on('end', onEnd);
    streams.push(s);
  }

  return out;
}

module.exports = interleave;
