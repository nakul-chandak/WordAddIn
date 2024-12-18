import { HttpClient } from "../../http";
import { HttpErrorResponse } from "../article/models/ArticleResponse";
import { registerUser } from "./models/register";
import { userLogin } from "./models/userLogin";


class UserServiceImpl {
    async logIn(request: userLogin): Promise<any> {
        const loginURL = 'auth/v1/login';
        try {
            const response = await HttpClient.post<any>(`${loginURL}`, request, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async registerUser(request: registerUser): Promise<any> {
        const url = 'platform/v1/user';
        try {
            const response = await HttpClient.post<any>(`${url}`, request, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
    async requestOtp(request: any): Promise<any> {
        const url = 'platform/v1/account/password_reset/request';
        try {
            const response = await HttpClient.post<any>(`${url}`, request, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
    async validateOtp(request: any): Promise<any> {
        const url = 'platform/v1/account/password_reset/validate';
        try {
            const response = await HttpClient.post<any>(`${url}`, request, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }
}

const UserService = new UserServiceImpl();

export { UserService };