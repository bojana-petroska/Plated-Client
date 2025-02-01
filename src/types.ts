export interface PaginatedResults<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface RestaurantSummary {
  restaurant_id: number;
  name: string;
  imageUrl: string;
}

export interface IRestaurant {
  restaurant_id?: number;
  name: string;
  password: string;
  address?: string;
  phoneNumber?: string;
  imageUrl?: string;
  email?: string;
  openingHours?: string;
  deliveryRadius?: number;
  role?: string;
  menu?: IMenuItem[];
  isOpen?: boolean;
  rating?: number;
  notifications?: INotification[];
}

export type RestaurantInput = Omit<IRestaurant, 'restaurant_id' | 'menu'>;

export interface IMenuItem {
  menuItem_id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  availability: boolean;
  category?: string;
  restaurantId?: number;
}

export type MenuItemInput = Omit<IMenuItem, 'menuItem_id'>;

export interface IUser {
  user_id?: number;
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  profilePicture?: string;
  orderHistory?: IOrder[];
  role?: string;
  token?: string;
  refreshToken?: string;
  createdAt?: Date;
  notifications?: INotification[];
}

export type UserInput = Pick<IUser, 'userName' | 'email' | 'password'>;

export enum OrderStatus {
  pending = 'pending',
  preparing = 'preparing',
  // ready = 'ready for pick up',
  delivered = 'delivered',
  // canceled = 'canceled',
}
export interface IOrder {
  order_id?: number;
  orderItems: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  restaurant?: RestaurantSummary;
  user?: IUser;
  courier?: ICourier;
}

export type OrderInput = Omit<
  IOrder,
  'order_id' | 'status' | 'createdAt' | 'updatedAt'
> & { restaurant_id: number };

export interface ICart {
  cart_id?: number;
  userId: number;
  orderItems: IOrderItem[];
  createdAt: Date;
  updatedAt?: Date;
}

export type CartInput = Omit<ICart, 'cart_id' | 'createdAt' | 'updatedAt'>;

export interface IOrderItem {
  orderItem_id?: number;
  order?: IOrder;
  menuItem: IMenuItem;
  quantity: number;
}

export enum Availability {
  available = 'available',
  unavailable = 'unavailable',
}

export interface ICourier {
  courier_id?: number;
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  availability: Availability;
  createdAt?: Date;
  updatedAt?: Date;
  restaurant?: IRestaurant;
  user?: IUser;
  notifications?: INotification[];
  order: IOrder[];
}

export type CourierInput = Omit<
  ICourier,
  'id' | 'phoneNumber' | 'availability' | 'createdAt' | 'updatedAt'
>;

export interface INotification {
  notification_id?: number;
  content: string;
  restaurant?: IRestaurant;
  user?: IUser;
  courier?: ICourier;
}
