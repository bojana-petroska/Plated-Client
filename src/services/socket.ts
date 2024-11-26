import { IOrder } from '@/types';
import { io, Socket } from 'socket.io-client';

class SocketService {
   private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5001');
  }

  // Connect to the socket server
  connect() {
    this.socket.connect();
  }

  registerClient(restaurantId: string) {
    console.log('Emitting register event with restaurantId:', restaurantId);
    this.socket.emit('register', { restaurantId });
  }

  // Listen for orderCreated event
  listenForOrderCreation(callback: (order: IOrder) => void) {
    this.socket.on('orderCreated', callback);
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();

export default socketService;
