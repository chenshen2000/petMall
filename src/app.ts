import type { RequestConfig } from '@umijs/max';
import { matchRoutes,history  } from '@umijs/max';
import { notification } from 'antd';
import {getToken} from '@/models/global'



export function onRouteChange({ clientRoutes, location }: any) {
  const route :any= matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    document.title = route.title || '';
  }
  if(getToken() && ['/login','/register'].includes(route.path)){
      history.push("/");
  }
}
 
// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}
 
// 配置请求对象
export const request: RequestConfig = {
  timeout: 2000,
  errorConfig: {
    errorHandler(error: any) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
      throw error;
    },
    errorThrower(res: any) {
      notification.error({
        description: '您的的请求出错了',
        message: '请求出错',
      });
      throw res;
    },
  },
  //请求拦截
  requestInterceptors: [
    [
      (config: any) => {
        // 拦截请求配置，进行个性化处理。
        let token = getToken();
        if(token) config.headers.Authorization=token;
        const url = config.url;
        return { ...config, url };
      },
    ],
  ],
  //响应拦截
  responseInterceptors: [
    (response) => {
      // console.log("响应拦截器",response)
      return response;
    },
  ],
};