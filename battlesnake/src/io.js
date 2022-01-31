import { Server } from 'socket.io';

export default const io = new Server({ serveClient: false });

