import axiosInstance from './axiosInstance';

export async function loginApi(payload) {
  const { data } = await axiosInstance.post('/auth/login', payload);
  return data?.data;
}

export async function registerApi(payload) {
  const { data } = await axiosInstance.post('/auth/register', payload);
  return data?.data;
}

export async function getMeApi() {
  const { data } = await axiosInstance.get('/auth/me');
  return data?.data;
}
