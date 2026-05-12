import axiosInstance from './axiosInstance';

export async function fetchTasks(filters = {}) {
  const { data } = await axiosInstance.get('/tasks', { params: filters });
  return data.data;
}

export async function fetchTaskById(id) {
  const { data } = await axiosInstance.get(`/tasks/${id}`);
  return data.data;
}

export async function createTask(payload) {
  const { data } = await axiosInstance.post('/tasks', payload);
  return data.data;
}

export async function updateTask(id, payload) {
  const { data } = await axiosInstance.put(`/tasks/${id}`, payload);
  return data.data;
}

export async function deleteTask(id) {
  const { data } = await axiosInstance.delete(`/tasks/${id}`);
  return data;
}

export async function reorderTasks(actionId, taskIds) {
  const { data } = await axiosInstance.put('/tasks/reorder', { actionId, taskIds });
  return data.data;
}

/** Persist task order for one action in real API. */
export async function reorderTasksForAction(actionId, orderedIds) {
  const { data } = await axiosInstance.put(`/tasks/reorder`, { actionId, taskIds: orderedIds });
  return data;
}
