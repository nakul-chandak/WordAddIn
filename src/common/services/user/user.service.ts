import { HttpClient } from "../../http";
import { HttpErrorResponse } from "../article/models/ArticleResponse";
import { userLogin } from "./models/userLogin";


class UserServiceImpl { 
    logIn(request: userLogin): Promise<any> {
        const loginURL = '/login';
        return HttpClient.post<any>(`https://api.azstage.guardrail.tech/auth/v1${loginURL}`,request,{
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