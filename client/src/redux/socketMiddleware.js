// socketMiddleware.js
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Create the socket instance

const socketMiddleware = () => (next) => (action) => {
  if (action.type === 'GET_SOCKET') {
    action.payload(socket); // Pass the socket instance to the action payload
  }
  return next(action);
};

export default socketMiddleware;
