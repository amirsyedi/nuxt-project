export const useAuth = () => {
  const login = async ({ identifier, password }) => {
    return await $fetch('/api/auth/login', {
      method: 'POST',
      body: { identifier, password }
    });
  };

  const register = async ({ fullName, email, password }) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: { fullName, email, password }
    });
  };

  const logout = async () => {
    return await $fetch('/api/auth/logout', {
      method: 'POST'
    });
  };

  return {
    login,
    register,
    logout
  };
};
