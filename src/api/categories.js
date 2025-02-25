import httpInstance from '@/utils/http';

// 标签列表
export const getTagsList = () => {
  return httpInstance({
    url: `/admin/tag/getTagsList`,
    method: 'get'
  });
};
