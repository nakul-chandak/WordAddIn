import { HttpClient } from "../../http";
import { HttpErrorResponse } from "../article/models/ArticleResponse";
import { ChatGptRequest } from "./models/ChatGptRequest";
import { LlmResponse } from "./models/llmResponse";
import { promptRequest } from "./models/promptRequest";

class LlmServiceImpl {
    processLlm(request: ChatGptRequest): Promise<LlmResponse> {
        const baseURL = 'llm/clientApp';
        return HttpClient.post<LlmResponse>(baseURL, request, {
            // portNumber: 80,
            headers: { 'Content-Type': 'application/json' },

        }).then(response => response.data).catch((err: HttpErrorResponse) => {
            throw err;
        });
    }

    getLlms(request: promptRequest): Promise<any> {
        const baseURL = 'guardrail/v1/llms';
        return HttpClient.post<any>(`${baseURL}`,request,{
            headers: { 
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.localStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        });
    }

    getOptimizedPrompts(request:any):Promise<any>{
        const baseURL = 'guardrail/v1/llm/prompt_optimization';
        return HttpClient.post<any>(`${baseURL}`,request,{
            headers: { 
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.localStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: HttpErrorResponse) => {
            throw err;
        });
    }
    getArticles(request:any):Promise<any>{
        const baseURL = 'guardrail/v1/articles';
        return HttpClient.post<LlmResponse>(baseURL, request, {
            headers: { 
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.localStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        })
    }


    getProtectedPrompt(request: promptRequest): Promise<any> {
        const baseURL = 'guardrail/v1/prompt';
        return HttpClient.post<any>(`${baseURL}`,request,{
            headers: { 
                'Content-Type': 'application/json',
                'authorization': `Bearer ${window.localStorage.getItem("token")}`,
            },
        }).then(response => response.data).catch((err: any) => {
            throw err;
        });
    }
}
const LlmService = new LlmServiceImpl();

export { LlmService };
