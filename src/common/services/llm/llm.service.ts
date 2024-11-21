import { HttpClient } from "../../http";
import { HttpErrorResponse } from "../article/models/ArticleResponse";
import { ChatGptRequest } from "./models/ChatGptRequest";
import { LlmResponse } from "./models/llmResponse";

class LlmServiceImpl {
    processLlm(request: ChatGptRequest): Promise<LlmResponse> {
        const baseURL = '/llm/clientApp';
        return HttpClient.post<LlmResponse>(baseURL, request, {
            // portNumber: 80,
            headers: { 'Content-Type': 'application/json' },

        }).then(response => response.data).catch((err: HttpErrorResponse) => {
            throw err;
        });
    }

}
const LlmService = new LlmServiceImpl();

export { LlmService };
