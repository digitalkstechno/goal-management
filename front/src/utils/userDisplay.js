/** Resolves user id to display name; falls back to raw id. */
export function userDisplayName(id, users = []) {
  if (!id) return '—';
  // If id is an object (populated), return its name
  if (typeof id === 'object' && id.name) return id.name;
  
  const user = users.find((u) => u.id === id || u._id === id);
  return user?.name || id;
}
