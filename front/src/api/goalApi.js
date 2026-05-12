import axiosInstance from './axiosInstance';

export async function fetchGoals(filters = {}) {
  const { data } = await axiosInstance.get('/goals', { params: filters });
  return data.data;
}

export async function fetchGoalById(id) {
  const { data } = await axiosInstance.get(`/goals/${id}`);
  return data.data;
}

export async function createGoal(payload) {
  const { data } = await axiosInstance.post('/goals', payload);
  return data.data;
}

export async function updateGoal(id, payload) {
  const { data } = await axiosInstance.put(`/goals/${id}`, payload);
  return data.data;
}

export async function deleteGoal(id) {
  const { data } = await axiosInstance.delete(`/goals/${id}`);
  return data;
}
