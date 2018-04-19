// Fixes https://github.com/socketio/socket.io/issues/1602

/**
 * @param {object} httpServer - the httpserver
 * @param {object} [io] - (optional) the socketIO server that has been connected to that httpServer
 * @param {boolean} [debug] - (optional) log some information
 */
function wireUpServer(httpServer, io, debug) {
  var connections = {};

  httpServer.on('connection', function(conn) {
    var key = conn.remoteAddress + ':' + conn.remotePort;
    debug && console.log('[socket.io-fix-close] Client has connected: ' + key);
    connections[key] = conn;
    conn.on('close', function() {
      debug && console.log('[socket.io-fix-close] Client has disconnected: ' + key);
      delete connections[key];
    });
  });

  // I don't like the idea of overriding this function,
  // unless we keep a copy of the original destroy function and call it.
  /*
  httpServer.destroy = function(cb) {
    debug && console.log('[socket.io-fix-close] HTTP server is being destroyed');
    closeAllConnections();
    httpServer.close(cb);
  };
  */

  if (io) {
    io.on('close', function () {
      debug && console.log('[socket.io-fix-close] Socket IO is being closed');
      closeAllConnections();
    });
  }

  httpServer.on('close', function () {
    debug && console.log('[socket.io-fix-close] HTTP server is being closed');
    closeAllConnections();
  });

  function closeAllConnections () {
    for (var key in connections) {
      debug && console.log('[socket.io-fix-close] Destroying connection: ' + key);
      connections[key].destroy();
    }
  }
}

module.exports = wireUpServer;
