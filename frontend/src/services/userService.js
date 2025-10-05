
export async function getMyProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch('http://localhost:5000/api/users/profile', {
    headers: {
      
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile data.');
  }
  return await response.json();
}