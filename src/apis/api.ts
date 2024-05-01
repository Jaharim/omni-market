import axios from 'axios';

const API_URL = process.env.API_URL;

export const getProductsInfo = async (page: number) => {
  const { data } = await axios.get(`${API_URL}/products/?page=${page}`);
  return data;
};

export const getProductDetail = async (productId: string | undefined) => {
  const { data } = await axios.get(`${API_URL}/products/${productId}`);
  return data;
};
