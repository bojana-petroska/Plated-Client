import axiosInstance from './axiosInstance';

const getAllRestaurants = async () => {
  const token = localStorage.getItem('authToken');
  console.log(token);
  if (!token) {
    throw new Error('User is not authenticated.');
  }

  try {
    const response = await axiosInstance.get(`/restaurants`);
    return response.data;
  } catch (error) {
    console.error(`Error at fetching restaurants.`, error);
    throw error;
  }
};

const getRestaurantById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error at fetching the restaurant with id: ${id}.`, error);
    throw error;
  }
};

const restaurantApi = {
  getAllRestaurants,
  getRestaurantById,
};

export default restaurantApi;
