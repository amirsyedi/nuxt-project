// services/api.js

export const useApi = () => {
  
  // 1. READ: Get all items (e.g., users)
  const getUsers = async () => {
    try {
      return await $fetch('/api/users');
    } catch (err) {
      console.error('Failed to fetch users:', err);
      return [];
    }
  };

  const getAttendanceByUserId = async (id) => {
    try {
      return await $fetch(`/api/attendance/user/${id}`);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      return null;
    }
  };

  // 2. CREATE: Add a new item
  // const createUser = async (userData) => {
  //   try {
  //     return await $fetch('/api/users', {
  //       method: 'POST',
  //       body: userData
  //     });
  //   } catch (err) {
  //     console.error('Failed to create user:', err);
  //     throw err;
  //   }
  // };

  // const updateUser = async (id, userData) => {
  //   try {
  //     return await $fetch(`/api/users/${id}`, {
  //       method: 'PUT',
  //       body: userData
  //     });
  //   } catch (err) {
  //     console.error('Failed to update user:', err);
  //     throw err;
  //   }
  // };

  // // 3. DELETE: Remove an item by ID
  // const deleteUser = async (id) => {
  //   console.log("deleteUser deleting", id);
  //   try {
  //     return await $fetch(`/api/users/${id}`, {
  //       method: 'DELETE'
  //     });
  //   } catch (err) {
  //     console.error('Failed to delete user:', err);
  //     throw err;
  //   }
  // };

  return {
    getUsers,
    getAttendanceByUserId,
    // createUser,
    // updateUser,
    // deleteUser,
  };
};