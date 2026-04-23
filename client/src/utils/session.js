export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function clearStoredUser() {
  localStorage.removeItem("user");
}
