import { HttpClient } from "../../http";
import { HttpErrorResponse } from "../article/models/ArticleResponse";
import { registerUser } from "./models/register";
import { userLogin } from "./models/userLogin";


class UserServiceImpl { 
    logIn(request: userLogin): Promise<any> {
        const loginURL = 'auth/v1/login';
        return HttpClient.post<any>(`${loginURL}`,request,{
            headers: { 
                'Content-Type': 'application/json'
            },
        }).then(response => response.data).catch((err: HttpErrorResponse) => {
            throw err;
        });
    }

    registerUser(request: registerUser): Promise<any> {
        const loginURL = 'platform/v1/user';
        return HttpClient.post<any>(`${loginURL}`,request,{
            headers: { 
                'Content-Type': 'application/json'
            },
        }).then(response => response.data).catch((err: HttpErrorResponse) => {
            throw err;
        });
    }
}

const UserService = new UserServiceImpl();

export { UserService };