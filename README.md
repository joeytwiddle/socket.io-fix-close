Status: ALPHA - May or may not be working as intended.

If there are still socket.io clients connected to an httpServer when it closes, the httpServer will not close properly.

The problem is discussed here: https://github.com/socketio/socket.io/issues/1602

This module attempts to fix the bug, by keeping track of active clients, and automatically forcing them to close when the httpServer closes.

The code was based on [ilkovich's snippet](https://github.com/socketio/socket.io/issues/1602#issuecomment-120561951) from the aforementioned issue.

Example usage:

```js
const app = express();
const httpServer = app.listen(8000);
const io = socketIO(httpServer);

wireUpServer(httpServer, io);

// When you want to stop the httpServer
httpServer.close();

// Or if you only want to stop the socket listener
io.close();
```
