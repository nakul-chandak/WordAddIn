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
    //config.headers.Authorization="bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im9yZ2FuaXphdGlvbnMiOlt7Il9pZCI6IjY2MGQ1N2YwYTgwNDBiMTk5ZGIxNmFiMSIsIl9yb2xlSWQiOiI2NGViMTA4Y2E3YzkxNjA0ZjViZmViZmIiLCJyb2xlIjoiVXNlciIsInN0YXR1cyI6IkFjdGl2ZSJ9XSwiZmlyc3ROYW1lIjoiRnJuZCIsImxhc3ROYW1lIjoiQkIiLCJlbWFpbCI6ImZybmRiYkBnbWFpbC5jb20iLCJpc1BsYXRmb3JtQWRtaW4iOmZhbHNlLCJzdWJzY3JpcHRpb24iOnsicGxhbk5hbWUiOiJQcm8iLCJwbGFuSWQiOiJwcmljZV8xUHBuekRMdnM4TmQ0Q051WkZLenhOZXYiLCJjdXN0b21lcklkIjoiY3VzX1F5djU2VnNORGlMdlFuIiwic3RhcnREYXRlIjoiMjAyNC0xMS0wNlQxNjoyNDoxMy4wMDBaIiwiZW5kRGF0ZSI6IjIwMjQtMTItMDZUMTY6MjQ6MTMuMDAwWiIsInN0YXR1cyI6ImFjdGl2ZSIsInN1YnNjcmlwdGlvbklkIjoic3ViXzFRNnhGaEx2czhOZDRDTnUxaUlEN09QYiJ9LCJwZXJtaXNzaW9ucyI6WyJBY2Nlc3NHdWFyZHJhaWwxMjMiLCJQcm9jZXNzRmFjdENoZWNrZXIiLCJBY2Nlc3NHYXRlV2F5U2VydmljZSIsIkFjY2Vzc0ZhY3RDaGVja1NlcnZpY2UiLCJBY2Nlc3NQcm9tb3RQcm90ZWN0U2VydmljZSIsIkFkZFJlbW92ZUZhdm9yaXRlcyIsImNhblVwbG9hZFN5c3RlbVBhdHRlcm5MaWJyYXJ5IiwiVmlld01hbmFnZUhpc3RvcnkiLCJBY2Nlc3NEb3dubG9hZCIsImNhblVwbG9hZFN5c3RlbVBhdHRlcm5MaWJyYXJ5IiwiQWNjZXNzR2F0ZVdheVNlcnZpY2UiLCJBY2Nlc3NGYWN0Q2hlY2tTZXJ2aWNlIiwiQWNjZXNzUHJvbW90UHJvdGVjdFNlcnZpY2UiLCJjYW5VcGxvYWRTeXN0ZW1MaWJyYXJ5IiwiY2FuVXBsb2FkQ3VzdG9tTGlicmFyeSIsImNhblVwbG9hZEN1c3RvbVBhdHRlcm5MaWJyYXJ5IiwiU2hhcmVDb250ZW50IiwiUHJvY2Vzc0ZhY3RDaGVja2VyIiwiRGVsZXRlSGlzdG9yeSIsIkFjY2Vzc0ZhY3RDaGVja2VyIiwiUHJvY2Vzc0ZhY3RDaGVja2VyIiwiQWNjZXNzQ29kZUFuYWx5emVyIiwiQWNjZXNzUHJvbW90UHJvdGVjdCIsIkFjY2Vzc1Byb2plY3RzIiwiQWNjZXNzU3VtbWFyaXphdGlvbiIsIkFjY2Vzc1N5c3RlbVBhdHRlcm4iLCJBY2Nlc3NQYXR0ZXJuTWFuYWdlbWVudCIsIkdlbmVyYXRlUERGIiwiQ29uZmlndXJlVXNlclNldHRpbmdzIiwiVXBkYXRlUGVyc29uYWxJbmZvIiwiU3VibWl0UmVxdWVzdHMiLCJBZGRVc2VycyIsIkNvbmZpZ3VyZVN5c3RlbVNldHRpbmdzIiwiV3JpdGVBY2Nlc3NUb0JpbGxpbmdBbmRTdWJzY3JpcHRpb24iLCJBY2Nlc3NEZXZlbG9wbWVudEVudmlyb25tZW50cyIsIkdlbmVyYXRlQVBJS2V5cyIsIkNvbmZpZ3VyZURhdGFTb3VyY2VzIiwiQ29uZmlndXJlRXh0ZXJuYWxTZWFyY2giLCJNb2RpdHlVc2VycyIsIkRlbGV0ZVVzZXJzIiwiQWNjZXNzRGFzaGJvYXJkIiwiTWFuYWdlQWNjZXNzUGVybWlzc2lvbnMiLCJjYW5VcGxvYWRTeXN0ZW1QYXR0ZXJuTGlicmFyeSIsIkFjY2Vzc0d1YXJkcmFpbDEyMyJdfSwic3ViIjoiNjcwMmI4ZTQyNmVhNzVmMDNiNTNmZDQyIiwiaWF0IjoxNzMzMTIyOTA5LCJleHAiOjE3MzMyMDkzMDl9.-iyYFuLyQYLi5I7yFpw878XgPldgj2cFGd323lDK8Gk"; 
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
      window.location.href = "/taskpane.html#login";
      localStorage.removeItem("LoggedIn");
      localStorage.removeItem("userId");
    }
    else if (error.response?.status === 403) {
      // StoreProviderService.dispatch(profileActions.logout());
      window.location.href = "/taskpane.html#login";
      localStorage.removeItem("LoggedIn");
      localStorage.removeItem("userId");
    }
    const data: ErrorResponse | undefined = error.response?.data;
    return Promise.reject({ name: data?.error, message: data?.message, statusCode: data?.statusCode });
  },
};
