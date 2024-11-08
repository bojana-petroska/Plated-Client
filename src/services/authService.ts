import axios from 'axios';

class AuthService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    });

    // Automatically set JWT token in the headers for every request
    this.api.interceptors.request.use((config) => {
      // Retrieve the JWT token from the local storage
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }

      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }

  signin = (requestBody: { userName: string; password: string }) => {
    return this.api.post('/auth/signin', requestBody);
  };

  signup = (requestBody: { userName: string; email: string; password: string }) => {
    console.log('just some text')
    return this.api.post('/auth/signup', requestBody);
  };

  verify = () => {
    return this.api.get('/auth/verify');
  };
}

const authService = new AuthService();

export default authService;
