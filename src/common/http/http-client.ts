import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { CustomError } from "./models/error-response";
import { requestInterceptor, responseInterceptor } from "./http-interceptors";

type FullFilled<V> = (value: V) => V | Promise<V>;
type Rejected = (error: any) => Promise<CustomError>;
export type RequestInterceptor = { onFulfilled: FullFilled<AxiosRequestConfig>; onRejected: Rejected };
export type ResponseInterceptor = { onFulfilled: FullFilled<AxiosResponse>; onRejected: Rejected };
export const IS_RETRY_HEADER = "Is-Retry";

class HttpClientImpl {
    private hostname = "https://api.azstage.guardrail.tech";
    private apiVersion = "v1";
    private http!: AxiosInstance;
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];

    private mergeConfig(config?: AxiosRequestConfig, portNumber?: number): AxiosRequestConfig {
        const hostname = process.env.REACT_APP_API_URL;
        this.hostname = hostname ?? this.hostname;
        const envPortNumber = parseInt(process.env.REACT_APP_API_PORT || "0");
        if (portNumber) {
            this.hostname = `${this.hostname}:${portNumber}`;
        } else if (envPortNumber > 0) {
            this.hostname = `${this.hostname}:${envPortNumber}`;
        }
        console.log("hostname", this.hostname);
        config = config || {};
        return {
            ...config,
            headers: {
                ...config.headers,
            },
            baseURL: `${this.hostname}/${this.apiVersion}`
        };
    }

    setUp(port?: number) {
        this.http = axios.create(this.mergeConfig(undefined, port));
        for (const x of this.requestInterceptors) this.http.interceptors.request.use(
            x.onFulfilled as (value: any) => any | Promise<any>, // Type assertion here
            x.onRejected
        );
        for (const x of this.responseInterceptors) this.http.interceptors.response.use(
            x.onFulfilled as (value: any) => any | Promise<any>, // Type assertion here
            x.onRejected
        );
    }

    addRequestInterceptor = ({ onFulfilled, onRejected }: RequestInterceptor) => {
        this.requestInterceptors.push({ onFulfilled, onRejected });
    };

    addResponseInterceptor = ({ onFulfilled, onRejected }: ResponseInterceptor) => {
        this.responseInterceptors.push({ onFulfilled, onRejected });
    };

    fromConfig<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.http.request(config);
    }

    post<ResponseType>(url: string, body?: any, config?: { portNumber?: number; enableVersion?: boolean } & AxiosRequestConfig) {
        const apiUrl = `${this.hostname}/${url}`;
        return this.http.post<ResponseType>(apiUrl, body, this.mergeConfig(config, config?.portNumber));
    }

    put<ResponseType>(url: string, body?: any, config?: { portNumber?: number } & AxiosRequestConfig) {
        const apiUrl = `${this.hostname}/${url}`;
        return this.http.put<ResponseType>(apiUrl, body, this.mergeConfig(config, config?.portNumber));
    }

    patch<ResponseType>(url: string, body?: any, config?: { portNumber?: number } & AxiosRequestConfig) {
        const apiUrl = `${this.hostname}/${url}`;
        return this.http.patch<ResponseType>(apiUrl, body, this.mergeConfig(config, config?.portNumber));
    }

    get<ResponseType>(url: string, config?: { portNumber?: number } & AxiosRequestConfig) {
        const fullUrl = `${this.hostname}/${url}`;
        return this.http.get<ResponseType>(fullUrl, this.mergeConfig(config, config?.portNumber));
    }

    delete<ResponseType>(url: string, config?: { portNumber?: number } & AxiosRequestConfig) {
        const apiUrl = `${this.hostname}/${url}`;
        return this.http.delete<ResponseType>(apiUrl, this.mergeConfig(config, config?.portNumber));
    }
}

const HttpClient = new HttpClientImpl();

HttpClient.addRequestInterceptor(requestInterceptor);

HttpClient.addResponseInterceptor(responseInterceptor);

HttpClient.setUp();

export { HttpClient };
