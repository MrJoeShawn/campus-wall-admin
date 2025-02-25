import httpInstance from '@/utils/http';

// 分类获取七牛云上传凭证
export const getUploadToken = () => {
  return httpInstance({
    url: `/qiniutoken`,
    method: 'get'
  });
};
