import { IS_RETRY_HEADER, RequestInterceptor, ResponseInterceptor } from './http-client';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { ErrorResponse } from './models/error-response';

function hasRetryFlag(config?: AxiosRequestConfig) {
  return config?.headers?.[IS_RETRY_HEADER] || false;
}

const isRequestBypassedByRequestInterceptor = (config: AxiosRequestConfig) => {
  return !!(config.url?.startsWith('/login') || (config.url?.startsWith('/account/password_reset') && (config.url !== '/account/password_reset/change')));
};

export const requestInterceptor: RequestInterceptor = {
  onFulfilled: config => {
    // config.url = config.url?.replace(/(https?:\/\/[^\/]+)\/+(.*)/g, (match, protocolAndDomain, path) => protocolAndDomain + '/' + path.replace(/\/+/g, '/'));;
    if (isRequestBypassedByRequestInterceptor(config)) return config;
    const savedSecret = localStorage.getItem("Onboarding");
    if (savedSecret) {
     let secret= JSON.parse(savedSecret);
      if (config.headers && secret.value ) {
        config.headers['grp-ext-api-key'] = secret.value
      }
    }   
    return config;
  },

  onRejected: error => error,
};

export const responseInterceptor: ResponseInterceptor = {
  onFulfilled: response => response,
  onRejected: (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401 && !hasRetryFlag(error?.config)) {
      // StoreProviderService.dispatch(profileActions.logout());
      // return HttpClient.fromConfig(setRetryFlag(error.config));
    }
    if (error.response?.status === 403) {
      // StoreProviderService.dispatch(profileActions.logout());
    }
    const data: ErrorResponse | undefined = error.response?.data;
    return Promise.reject({ name: data?.error, message: data?.message, statusCode: data?.statusCode });
  },
};
