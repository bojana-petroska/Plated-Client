import axios from 'axios';
import socketService from './socket';

class AuthService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5001',
    });

    this.api.interceptors.request.use(
      (config) => {
        const storedToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('userAuthToken')
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

  signin = async (requestBody: { userName: string; password: string }) => {
    try {
      const response = await this.api.post('/auth/signin', requestBody);

      const token = response.data.token;
      localStorage.setItem('userAuthToken', token);

      const userId = response.data.data.user_id;

      console.log(
        'what data I see before user signin',
        response.data.data
      );
      console.log(
        'is the USER ID correct before connecting to Sockets?',
        userId
      );

      socketService.registerUser(userId);

      return response;
    } catch (error) {
      console.error('User signin error:', error);
      throw error;
    }
  };

  signup = (requestBody: {
    userName: string;
    email: string;
    password: string;
  }) => {
    return this.api.post('/auth/signup', requestBody);
  };
}

const authService = new AuthService();

export default authService;
