import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const getAllRestaurants = async () => {
  try {
    const response = await axios.get(`${API_URL}/restaurants`);
    return response.data;
  } catch (error) {
    console.error(`Error at fetching restaurants.`, error);
    throw error;
  }
};

const getRestaurantById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error at fetching the restaurant with id: ${id}.`, error);
    throw error;
  }
};

const restaurantApi = {
    getAllRestaurants,
    getRestaurantById
}

export default restaurantApi;
