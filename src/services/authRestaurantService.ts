import axios from 'axios';

class RestaurantAuthService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5001',
    });

    // Automatically set JWT token in the headers for every request
    this.api.interceptors.request.use(
      (config) => {
        // Retrieve the JWT token from the local storage
        const storedToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('authToken')
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

  signin = (requestBody: { name: string; password: string }) => {
    return this.api.post('/auth/restaurant/signin', requestBody);
  };

  signup = (requestBody: { name: string; password: string }) => {
    return this.api.post('/auth/restaurant/signup', requestBody);
  };
}

const restaurantAuthService = new RestaurantAuthService();

export default restaurantAuthService;
