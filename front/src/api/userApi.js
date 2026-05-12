import axiosInstance from './axiosInstance';

export async function fetchUsers() {
  const { data } = await axiosInstance.get('/users');
  return data.data;
}

export async function fetchUserById(id) {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data.data;
}
