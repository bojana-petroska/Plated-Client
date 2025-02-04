import axios from 'axios';
import socketService from './socket';

class RestaurantAuthService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5001',
    });

    this.api.interceptors.request.use(
      (config) => {
        const storedToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('restaurantAuthToken')
            : null;
        if (storedToken) {
          console.log('STORED TOKEN IN AUTH SERVICE:', storedToken);
          config.headers.Authorization = `Bearer ${storedToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  signin = async (requestBody: { name: string; password: string }) => {
    try {
      const response = await this.api.post(
        '/auth/restaurant/signin',
        requestBody
      );

      const token = response.data.token;
      localStorage.setItem('restaurantAuthToken', token);

      const restaurantId = response.data.data.restaurant_id;

      console.log('what data I see before restaurant signin', response.data.data);
      console.log(
        'is the restaurant Id correct before connecting to Sockets?',
        restaurantId
      );

      socketService.registerRestaurant(restaurantId);

      return response;
    } catch (error) {
      console.error('Restaurant signin error:', error);
      throw error;
    }
  };

  signup = (requestBody: { name: string; password: string }) => {
    return this.api.post('/auth/restaurant/signup', requestBody);
  };
}

const restaurantAuthService = new RestaurantAuthService();

export default restaurantAuthService;
