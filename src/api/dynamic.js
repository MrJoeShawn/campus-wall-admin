import httpInstance from '@/utils/http';

// 通用请求函数
const request = (url, method, params = {}, data = null) => {
  return httpInstance({
    url,
    method,
    params,
    data
  });
};


// 发布校园公告
export const createCampusAnnouncements = (dynamic) => {
  return request('/admin/createCampusAnnouncements', 'post', {}, dynamic);
};

// 根据id获取详情 用来修改动态
export const updateGetDynamic = (dynamicId) => {
  return request(`/admin/update/${dynamicId}`, 'get');
};

// 首页校园动态展示
export const getCampusAnnouncements = () => {
  return request(`/admin/getCampusAnnouncements`, 'get')
}

// 管理所有校园动态
export const getAdminCampusAnnouncementsList = ( pageNum, pageSize) => {
  return request(`/admin/getAdminCampusAnnouncements`, 'get', { pageNum, pageSize });
};

// 置顶公告
export const updateAnnouncementStatus = (dynamicId, isTop) => {
  return request(`/admin/updateStatus`, "put", { dynamicId, isTop });
};



// 删除校园公告
export const deleteDynamic = (dynamicId) => {
  return request(`/admin/delete?dynamicId=${dynamicId}`, 'put')
}
