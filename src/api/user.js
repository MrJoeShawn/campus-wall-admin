import httpInstance from '@/utils/http';
// 登录接口
export const loginAPI = ({ username, password }) => {
  return httpInstance({
    url: '/admin/login',
    method: 'post',
    data: { username, password }
  });
};

// 退出登录接口
export const logoutAPI = () => {
  return httpInstance({
    url: '/admin/logout',
    method: 'post'
  });
};


// 获取用户信息（支持分页）
export const getAllUserInfo = (pageNum = 1, pageSize = 10) => {
  return httpInstance.get(`/admin/userAllInfo`, {
    params: { pageNum, pageSize },
  });
};

// 添加用户
export const addUser = (userData) => {
  return httpInstance.post('/admin/addUser', userData);
};

// 删除用户
export const deleteUser = (id) => {
  return httpInstance.delete(`/admin/deleteUser/${id}`);
};

// 修改用户
export const updateUser = (userData) => {
  return httpInstance.put('/admin/updateUser', userData);
};

// 获取单个用户的详细信息
export const getUserById = (userId) => {
  return httpInstance.get(`/admin/user/${userId}`);
};
