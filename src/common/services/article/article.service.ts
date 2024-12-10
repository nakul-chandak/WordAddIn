import { ArticleUpdateRequest, AssertionResult, HttpErrorResponse } from "./models/ArticleResponse";
import { HttpClient } from "../../http";
import { ArticleProcessRequest } from "./models/ArticleProcessRequest";

class ArticleServiceImpl {
    processArticle(request: ArticleProcessRequest): Promise<AssertionResult> {
        const baseURL = '/articles/clientApp';
        return HttpClient.post<AssertionResult>(baseURL, request, {
            // portNumber: 80,
            headers: { 'Content-Type': 'application/json' },

        }).then(response => response.data).catch((err: HttpErrorResponse) => {
            throw err;
        });
    }

}
const ArticleService = new ArticleServiceImpl();

export { ArticleService };
