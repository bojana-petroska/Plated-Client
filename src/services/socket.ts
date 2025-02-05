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
    console.log('Connected to the socket server!');
  }

  registerRestaurant(restaurantId: string) {
    console.log(
      'Emitting register event for Restaurant with id:',
      restaurantId
    );
    this.socket.emit('restaurantRegister', { restaurantId });
  }

  registerUser(userId: string) {
    console.log('Emitting register event for User with id:', userId);
    this.socket.emit('userRegister', { userId });
  }

  registerCourier(courierId: string) {
    console.log('Emitting register event for Courier with id:', courierId);
    this.socket.emit('courierRegister', { courierId });
  }

  listenForOrderCreation(callback: (order: IOrder) => void) {
    this.socket.on('orderCreated', callback);
  }

  listenForOrderStatusChange(callback: (order: IOrder) => void) {
    this.socket.on('orderStatusChanged', callback);
  }

  listenForCourierPickUp(callback: (order: IOrder) => void) {
    this.socket.on('courierPickedUp', callback);
  }

  sendMessageToUser(orderId: string, userId: string, message: string) {
    console.log('Courier sending a message to User with id:', userId, 'message:', message);
    this.socket.emit('courierMessage', { orderId, userId, message });
  }

  listenForCourierMessages(
    callback: (data: { orderId: string; message: string }) => void
  ) {
    this.socket.on('courierMessageReceived', callback);
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
